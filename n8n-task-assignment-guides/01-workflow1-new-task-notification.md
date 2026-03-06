# Workflow 1: New Task Notification

**Goal:** When a task first arrives in the "New Interactive Requests" tasklist (either created there or moved in from another list), post a Slack message with "Analyze & Recommend" and "Open Task" buttons.

**Nodes:** 5 total  
**Time:** ~20 minutes

> **Revision (Feb 23, 2026):** The original IF node ("Filter by Tasklist") has been removed. The "Filter: New Arrivals Only" Code node (Node 2) already checks both the target list name AND the trigger reason (create vs move-in vs edit), making the IF node redundant. This simplifies the workflow from 6 nodes to 5.

---

## Workflow Overview

```
[Webhook] → [Code: Filter New Arrivals] → [Set: Extract Fields] → [Code: Build Slack Blocks] → [Slack: Post Message]
```

---

## Node 1: Webhook (Trigger)

1. Add a **Webhook** node
2. Configure:
   - **HTTP Method:** POST
   - **Path:** Use the existing path `b041bca4-9a40-4cdf-a7c9-e5010412714a` or create a new one
   - **Response Mode:** "Immediately" (so TWFX doesn't timeout waiting)
3. Note the **Production URL** — this is what TWFX sends task creation events to
4. **Important:** The TWFX webhook must be configured to fire on both **create** and **update** events. This is necessary to catch tasks that are moved into the "New Interactive Requests" list (which fires an update event, not a create).

**Testing tip:** When you first set this up, use the **Test URL** and create a test task in TWFX to capture the webhook payload. This lets you see the exact field names and structure TWFX sends. You'll need these for Node 3.

---

## Node 2: Code (Filter: New Arrivals Only)

**Why this node exists:** The TWFX webhook fires on every create AND every update to tasks in any configured project. Without this filter, editing a task's description, changing its due date, or any other update would trigger a duplicate Slack notification. This node ensures we only process a task when it **first arrives** in the target list.

1. Add a **Code** node after the Webhook
2. Language: **JavaScript**
3. Paste this code (also in `scripts/filter-new-arrivals.js`):

```javascript
const body = $input.first().json.body || $input.first().json;
const event = body.event || {};
const action = event.action;
const result = event.result || {};
const original = event.original || {};

const TARGET_LIST = 'New Interactive Requests';
const resultTasklist = result.todolist?.name || '';

const isInTargetList = resultTasklist.includes(TARGET_LIST);
const isCreate = action === 'create';
const isMovedIn = action === 'update'
  && isInTargetList
  && original.todolistId !== result.todolistId;

if (isInTargetList && (isCreate || isMovedIn)) {
  return [{
    json: {
      ...$input.first().json,
      _triggerReason: isCreate ? 'new_task_created' : 'task_moved_to_list'
    }
  }];
}

return [];
```

**How it works:**
- **Create events:** If the task was created directly in "New Interactive Requests" → pass through
- **Update events:** Compares `original.todolistId` with `result.todolistId`. If they differ, the task was moved between lists. If the destination is "New Interactive Requests" → pass through
- **All other updates:** The todolistId is the same in both original and result, meaning the task stayed in the same list (just an edit) → returns `[]` to stop execution

> **Important (Feb 23, 2026):** The TWFX webhook's `original` object only contains flat fields (e.g. `todolistId`). It does NOT include nested objects like `todolist.name`. The `result` object includes both. This is why we compare `todolistId` values instead of `todolist.name` strings.

**Testing this node:**
- Create a task in "New Interactive Requests" → should output with `_triggerReason: "new_task_created"`
- Edit an existing task's description in that list → should output nothing (empty array)
- Move a task from another list into "New Interactive Requests" → should output with `_triggerReason: "task_moved_to_list"`

---

## Node 3: Set (Extract & Normalize Fields)

1. Add a **Set** node after the Filter Code node
2. Set mode: **Manual Mapping**
3. Add these fields:

| Field Name | Value (Expression) | Notes |
|---|---|---|
| `taskId` | `{{ $json.body.event.result.todoId }}` | Confirmed from webhook payload |
| `projectId` | `{{ $json.body.event.result.projectId }}` | Confirmed — used in button URLs |
| `taskTitle` | `{{ $json.body.event.result.content || 'Untitled Task' }}` | `content` is the task title field |
| `channel` | `{{ $json.body.event.result.customFields?.["41"]?.value || 'Uncategorized' }}` | Custom field 41 = Channel (Design, Development, CRO, etc.) |
| `priority` | `{{ $json.body.event.result.priority || 'none' }}` | Values: low, normal, high, crazy urgent |
| `dueDate` | `{{ $json.body.event.result.dueDate || 'No deadline' }}` | Format: `YYYY-MM-DD` |
| `estimatedHours` | `{{ $json.body.event.result.estimatedHours || 0 }}` | Already in hours (not seconds). May be null if not set |
| `pocName` | `{{ $json.body.event.result.creator.firstName }} {{ $json.body.event.result.creator.lastName }}` | Uses `creator` (same as POC in most cases) |

> **Field paths confirmed Feb 23, 2026** from live webhook payload. The `result` object contains full nested objects (`project`, `todolist`, `customFields`, `creator`). The `original` object only has flat fields. Note: `customFields["1"].value` also has estimated hours but in seconds (time format) — use `result.estimatedHours` instead which is already in hours.

---

## Node 4: Code (Build Slack Block Kit)

1. Add a **Code** node after the Set node
2. Language: **JavaScript**
3. Paste this code:

```javascript
const taskId = $input.first().json.taskId;
const projectId = $input.first().json.projectId;
const taskTitle = $input.first().json.taskTitle || 'Untitled Task';
const dueDate = $input.first().json.dueDate || 'No deadline';
const channel = $input.first().json.channel || 'Uncategorized';
const pocName = $input.first().json.pocName || 'Unassigned';
const estimatedHours = $input.first().json.estimatedHours;
const priority = $input.first().json.priority || 'none';

const hoursDisplay = estimatedHours && estimatedHours > 0
  ? `${estimatedHours}h`
  : 'Not estimated';

const priorityMap = {
  'low': { label: 'Low', emoji: '🔵' },
  'normal': { label: 'Medium', emoji: '🟡' },
  'high': { label: 'High', emoji: '🟠' },
  'crazy urgent': { label: 'Urgent', emoji: '🔴' },
  'none': { label: 'None', emoji: '⚪' }
};
const p = priorityMap[priority] || { label: priority, emoji: '⚪' };

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let formattedDate = dueDate;
if (dueDate && dueDate.includes('-')) {
  const parts = dueDate.split('-');
  formattedDate = `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
}

const blocks = [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "📥 New Task in Interactive Requests",
      emoji: true
    }
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${taskTitle}*`
    }
  },
  {
    type: "section",
    fields: [
      { type: "mrkdwn", text: `🎨 *Channel*\n${channel}` },
      { type: "mrkdwn", text: `${p.emoji} *Priority*\n${p.label}` },
      { type: "mrkdwn", text: `📅 *Due Date*\n${formattedDate}` },
      { type: "mrkdwn", text: `⏱️ *Estimated*\n${hoursDisplay}` }
    ]
  },
  {
    type: "context",
    elements: [
      { type: "mrkdwn", text: `👤 *POC:* ${pocName}` }
    ]
  },
  { type: "divider" },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "✨ Analyze & Recommend",
          emoji: true
        },
        style: "primary",
        value: `analyze_${taskId}_${projectId}`,
        action_id: "analyze_task"
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "🔗 Open Task in TWFX",
          emoji: true
        },
        url: `https://app.webfx.com/projects/${projectId}/tasks/${taskId}`,
        action_id: "open_task_link"
      }
    ]
  }
];

return [{
  json: {
    ...$input.first().json,
    slackBlocks: JSON.stringify(blocks),
    slackText: `New Task: ${taskTitle} — ${channel}`
  }
}];
```

**What this does:** Builds a Slack Block Kit notification using header, fields layout (two columns), context, and dividers. Shows task title, channel, priority (with color emoji), due date (formatted), estimated hours, and POC. The "Analyze & Recommend" button encodes `analyze_{taskId}_{projectId}` in its value — this is how Workflow 2 knows which task to analyze.

---

## Node 5: Slack (Post Message)

1. Add a **Slack** node after the Code node
2. Configure:
   - **Credential:** Select your Slack credential
   - **Resource:** Message
   - **Operation:** Send a Message
   - **Channel:** `#interactive-task-assignment`
   - **Text:** `{{ $json.slackText }}` (fallback text for notifications)
   - **Blocks:** `{{ $json.slackBlocks }}`
   - Look for a "Block" or "Blocks UI" option — you want to paste the blocks JSON, not use the visual builder

**Note on Blocks:** Depending on your n8n version, you may need to:
- Use the **"Send a Message"** operation and look for "Block Kit" or "Blocks" in the message options
- Or use **"Send Message (Block Kit)"** if that option exists
- Or use an **HTTP Request** node to call `chat.postMessage` directly (see below)

### Alternative: Use HTTP Request for Slack

If the built-in Slack node doesn't support Block Kit well, use an HTTP Request node instead:

- **Method:** POST
- **URL:** `https://slack.com/api/chat.postMessage`
- **Headers:** `Authorization: Bearer xoxb-YOUR-SLACK-BOT-TOKEN`
- **Content-Type:** `application/json`
- **Body:**

```json
{
  "channel": "#interactive-task-assignment",
  "text": "{{ $json.slackText }}",
  "blocks": {{ $json.slackBlocks }}
}
```

---

## Testing

1. Activate the workflow
2. Create a test task in the "New Interactive Requests" tasklist in TWFX
3. Check `#interactive-task-assignment` for the notification
4. Verify:
   - [ ] Task title appears correctly
   - [ ] Project name appears
   - [ ] Due date appears (or "No deadline")
   - [ ] "Analyze & Recommend" button is visible
   - [ ] "Open Task in TWFX" button opens the correct URL
5. Test edge cases:
   - [ ] Task with no due date
6. **Test the deduplication filter (Node 2):**
   - [ ] Create a task in "New Interactive Requests" → notification should appear
   - [ ] Edit that task's description → NO new notification should appear
   - [ ] Change the task's due date → NO new notification should appear
   - [ ] Move a task from another tasklist into "New Interactive Requests" → notification should appear
   - [ ] Check the Code node output: `_triggerReason` should be `"new_task_created"` or `"task_moved_to_list"`

---

## Next Step

Once notifications work, proceed to **02-workflow2-ai-analysis.md** to build the analysis flow triggered by the "Analyze & Recommend" button.
