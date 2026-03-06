# Workflow 2: AI Analysis (On-Demand)

**Goal:** When a user clicks "Analyze & Recommend" in Slack, fetch team workload from TeamworkFX via MCP, run GPT-4o analysis, and reply in the Slack thread with a recommendation and two buttons.

**Nodes:** ~12 total  
**Time:** ~45 minutes

---

## Workflow Overview

```
[Webhook: Slack Interactivity]
    → [Code: Parse Payload]
    → [IF: Route by action_id]
    ─── analyze_task branch: ───
        → [Code: Build Updated Notification]
        → [Slack: Update Original Message]
        → [MCP Client: get_todo]
        → [Code: Build Team Member Array]
        → [Loop Over Items]
            → [MCP Client: get_todos per member]
        → [Code: Calculate Workload]
        → [Code: Build OpenAI Prompt]
        → [OpenAI: GPT-4o]
        → [Code: Parse AI Response]
        → [Code: Build Analysis Message]
        → [Slack: Post Thread Reply]
    ─── auto_assign_task branch: ───
        → (goes to Workflow 3 nodes — see 03-workflow3-auto-assignment.md)
```

**Important:** This workflow and Workflow 3 share the same Webhook trigger, because Slack only allows one Interactivity Request URL. The IF node routes button clicks to the correct branch.

---

## Node 1: Webhook (Slack Interactivity)

1. Create a **new workflow** (separate from Workflow 1)
2. Add a **Webhook** node as the trigger
3. Configure:
   - **HTTP Method:** POST
   - **Path:** something like `slack-interactivity` (choose any path)
   - **Response Mode:** "Immediately" (Slack expects a response within 3 seconds)
   - **Content Type:** Slack sends `application/x-www-form-urlencoded`

4. **Copy the Production URL** — you need to paste this into your Slack app config:
   - Go to your Slack app at **api.slack.com**
   - Navigate to **Interactivity & Shortcuts**
   - Enable Interactivity
   - Paste the n8n webhook URL as the **Request URL**
   - Save

---

## Node 2: Code (Parse Slack Payload)

1. Add a **Code** node after the Webhook
2. Paste this code:

```javascript
// Slack sends interactive payloads as URL-encoded form data
// with a single "payload" field containing JSON
let payload;

if (typeof $input.first().json.payload === 'string') {
  payload = JSON.parse($input.first().json.payload);
} else if ($input.first().json.payload && typeof $input.first().json.payload === 'object') {
  payload = $input.first().json.payload;
} else {
  payload = $input.first().json;
}

const action = payload.actions[0];
const actionId = action.action_id;
const actionValue = action.value;

const username = payload.user?.username || payload.user?.name || 'unknown';
const slackUserId = payload.user?.id || '';
const channelId = payload.channel?.id || '';
const messageTs = payload.message?.ts || '';
const triggerId = payload.trigger_id || '';
const responseUrl = payload.response_url || '';

let parsed = {
  actionId,
  actionValue,
  username,
  slackUserId,
  channelId,
  messageTs,
  triggerId,
  responseUrl,
  originalBlocks: payload.message?.blocks || []
};

if (actionId === 'analyze_task') {
  // Convert to numbers — MCP server requires numeric IDs for todoId, etc.
  const parts = actionValue.split('_');
  parsed.taskId = Number(parts[1]);
  parsed.projectId = Number(parts[2]);
} else if (actionId === 'auto_assign_task') {
  // Convert to numbers — MCP server requires numeric IDs.
  const parts = actionValue.split('_');
  parsed.taskId = Number(parts[1]);
  parsed.currentProjectId = Number(parts[2]);
  parsed.assigneeUserId = Number(parts[3]);
  parsed.newProjectId = Number(parts[4]);
  parsed.newTasklistId = Number(parts[5]);
}

return [{ json: parsed }];
```

---

## Node 3: IF (Route by Action ID)

1. Add an **IF** node after the Code node
2. Condition:
   - **Value 1:** `{{ $json.actionId }}`
   - **Operation:** Equals
   - **Value 2:** `analyze_task`
3. **True** output → continues to Node 4 (analysis flow)
4. **False** output → goes to Workflow 3 nodes (auto-assign flow, see separate guide)

---

## Node 4: Code (Build Updated Notification)

On the **True** branch of the IF node:

1. Add a **Code** node
2. Paste this code:

```javascript
const taskId = $input.first().json.taskId;
const projectId = $input.first().json.projectId;
const username = $input.first().json.username;
const originalBlocks = $input.first().json.originalBlocks;

// Rebuild blocks — keep info sections, update the action buttons
const updatedBlocks = originalBlocks.map(block => {
  if (block.type === 'actions') {
    return {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: `Analyzed by ${username}`,
            emoji: true
          },
          action_id: "already_analyzed"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Open Task in TWFX",
            emoji: true
          },
          url: `https://app.webfx.com/projects/${projectId}/tasks/${taskId}`,
          action_id: "open_task_link"
        }
      ]
    };
  }
  return block;
});

return [{
  json: {
    ...$input.first().json,
    updatedBlocks: JSON.stringify(updatedBlocks)
  }
}];
```

---

## Node 5: Slack (Update Original Message)

1. Add a **Slack** node (or HTTP Request) to update the original notification
2. If using **HTTP Request** node:
   - **Method:** POST
   - **URL:** `https://slack.com/api/chat.update`
   - **Headers:** `Authorization: Bearer xoxb-YOUR-SLACK-BOT-TOKEN`
   - **Body (JSON):**

```json
{
  "channel": "{{ $json.channelId }}",
  "ts": "{{ $json.messageTs }}",
  "blocks": {{ $json.updatedBlocks }}
}
```

This replaces the "Analyze & Recommend" button with "Analyzed by {username}".

---

## Node 6: MCP Client (Get Task Details)

1. Add an **MCP Client** node
2. Configure:
   - **Server URL:** `https://teamworkfx-mcp.com/mcp`
   - **Credential:** `TeamworkFX MCP` (Header Auth)
   - **Tool:** `get_todo`
   - **Input Mode:** JSON
   - **Parameters:**

```json
{
  "todoId": {{ $json.taskId }},
  "fields": ["description", "dueDate", "startDate", "estimatedHours", "project", "todolist", "status", "responsibleUser"]
}
```

> **Note:** `todoId` must be a **number** (no quotes around the expression). `fields` must be a **JSON array**, not a comma-separated string. The MCP server validates types strictly.

After this node runs, check the output to see the exact structure of the returned data. The response is nested inside `content[0].text` — the task title is in the `content` field (not `title`), and `description`/`estimatedHours` may be `null`. You'll use these field names in the prompt builder.

---

## Node 7: Code (Build Team Member Array for Loop)

1. Add a **Code** node
2. This converts the team config into items for the Loop node:

```javascript
// Carry forward task details from the MCP get_todo response
const taskDetails = $input.first().json;

// NOTE: userId values are numbers (not strings) because the MCP server
// validates types strictly. They're stored as numbers here so they can
// be passed directly to MCP get_todos calls in the loop.
const TEAM_MEMBERS = [
  { name: "Giancarlo",  userId: 12804013,    projectId: "15004754" },
  { name: "Sid",        userId: 1226193945,  projectId: "15004756" },
  { name: "Erron",      userId: 1226175529,  projectId: "15004755" },
  { name: "Edmund",     userId: 1225938597,  projectId: "15004757" },
  { name: "Jesslyn",    userId: 1226066097,  projectId: "15004752" },
  { name: "Elika",      userId: 1226189703,  projectId: "15004758" }
];

// Calculate the date 14 days from now in YYYY-MM-DD format
const twoWeeksOut = new Date();
twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
const dueDateBefore = twoWeeksOut.toISOString().split('T')[0];

// Output one item per team member — the Loop node will iterate these
return TEAM_MEMBERS.map(member => ({
  json: {
    memberName: member.name,
    memberUserId: member.userId,
    memberProjectId: member.projectId,
    dueDateBefore,
    taskDetails  // pass through for later use
  }
}));
```

---

## Node 8: Loop Over Items → MCP Client (Get Todos per Member)

### Option A: Using Loop Over Items node

1. Add a **Loop Over Items** node (also called "Split In Batches")
2. Set **Batch Size:** 1 (process one team member at a time)
3. Inside the loop, add an **MCP Client** node:
   - **Tool:** `get_todos`
   - **Parameters (JSON):**

```json
{
  "responsibleUserId": {{ $json.memberUserId }},
  "includeCompleted": false,
  "dueDateBefore": "{{ $json.dueDateBefore }}",
  "fields": ["estimatedHours", "dueDate", "status", "todolist"],
  "limit": 1000
}
```

> **Note:** `responsibleUserId` must be a **number** (no quotes around the expression). `fields` must be a **JSON array**. The `memberUserId` values from Node 7 are already numbers, so they pass through correctly.

### Option B: Without Loop node (if MCP Client doesn't work inside loops)

If loops with MCP Client nodes cause issues, use 6 separate MCP Client nodes (one per team member) with hardcoded userIds. This is less elegant but more reliable:

- MCP Client 1: `get_todos` with `responsibleUserId: 12804013` (Giancarlo)
- MCP Client 2: `get_todos` with `responsibleUserId: 1226193945` (Sid)
- MCP Client 3: `get_todos` with `responsibleUserId: 1226175529` (Erron)
- MCP Client 4: `get_todos` with `responsibleUserId: 1225938597` (Edmund)
- MCP Client 5: `get_todos` with `responsibleUserId: 1226066097` (Jesslyn)
- MCP Client 6: `get_todos` with `responsibleUserId: 1226189703` (Elika)

> **Note:** All `responsibleUserId` values must be **numbers** (no quotes).

Then use a **Merge** node to combine all 6 outputs before the next Code node.

**For all calls, use these shared parameters:**
```json
{
  "includeCompleted": false,
  "dueDateBefore": "YYYY-MM-DD (14 days from now — or use expression)",
  "fields": ["estimatedHours", "dueDate", "status", "todolist"],
  "limit": 1000
}
```

---

## Node 9: Code (Calculate Workload)

1. Add a **Code** node after the loop completes (or after the Merge node)
2. Paste the full script from `scripts/calculate-workload.js`

**What this does:**
- Iterates through each team member's todos
- Sums up `estimatedHours` for the next 2 weeks
- Calculates `available = 80 - allocated` and `percentUsed`
- Outputs a `workloadSummary` array

**Important:** The exact path to access each member's todos depends on how the Loop/MCP nodes structure their output. After running the loop once, check the output panel to see the data shape and adjust the script if needed (the script includes multiple fallback paths).

---

## Node 10: Code (Build OpenAI Prompt)

1. Add a **Code** node
2. Paste the full script from `scripts/build-openai-prompt.js`

**Note:** This node needs both the `workloadSummary` (from Node 9) and the task details (from Node 6). If they're on different data paths, you may need a **Merge** node to combine them, or pass task details through via the loop items.

The script builds two strings:
- `systemPrompt` — instructs GPT-4o on the expected response format
- `userPrompt` — contains the task details, team workload, and analysis questions

---

## Node 11: OpenAI (GPT-4o Analysis)

1. Add an **OpenAI** node
2. Configure:
   - **Credential:** Your OpenAI credential
   - **Resource:** Chat Message (or "Chat Completion")
   - **Model:** `gpt-4o`
   - **System Message:** `{{ $json.systemPrompt }}`
   - **User Message:** `{{ $json.userPrompt }}`
   - **Temperature:** `0.3`
   - **Max Tokens:** `1000`

Check the output — it should contain a structured recommendation following the format specified in the prompt.

---

## Node 12: Code (Parse AI Response & Look Up Assignee)

1. Add a **Code** node
2. Paste the full script from `scripts/parse-ai-response.js`

**What this does:**
- Extracts the recommended assignee name from the AI response
- Parses reasoning, team capacity, timeline, and missing info sections
- Looks up the assignee in the team config to get `userId`, `projectId`, `newTasksListId`
- These IDs are needed for the Auto-Assign button

---

## Node 13: Code (Build Analysis Message)

1. Add a **Code** node
2. Paste the full script from `scripts/build-analysis-message.js`

**What this does:**
- Builds the Slack Block Kit for the thread reply (Message 2)
- Includes the AI recommendation, team capacity overview, timeline, and notes
- Adds two buttons:
  - "Auto-Assign to {Name}" — encodes all assignment IDs in the button value
  - "Open Task in TWFX" — link button for manual action

---

## Node 14: Slack (Post Thread Reply)

1. Add a **Slack** node (or HTTP Request)
2. If using **HTTP Request** node:
   - **Method:** POST
   - **URL:** `https://slack.com/api/chat.postMessage`
   - **Headers:** `Authorization: Bearer xoxb-YOUR-SLACK-BOT-TOKEN`
   - **Body (JSON):**

```json
{
  "channel": "{{ $json.channelId }}",
  "thread_ts": "{{ $json.messageTs }}",
  "text": "{{ $json.slackText }}",
  "blocks": {{ $json.slackBlocks }}
}
```

The `thread_ts` field makes this a reply in the thread of the original notification message.

---

## Data Flow Summary

Here's what data passes through the workflow:

```
Webhook → Parse Payload → {taskId, projectId, channelId, messageTs, username}
    ↓
Update Button → uses {channelId, messageTs, originalBlocks, username}
    ↓
MCP get_todo → adds {task title, description, due date, project name}
    ↓
Build Team Array → outputs 6 items [{memberName, memberUserId, dueDateBefore}]
    ↓
Loop + MCP get_todos → each item gets {todos: [...]}
    ↓
Calculate Workload → aggregates into {workloadSummary: [{name, allocated, available, percent}]}
    ↓
Build Prompt → creates {systemPrompt, userPrompt}
    ↓
OpenAI → returns {AI recommendation text}
    ↓
Parse AI → extracts {assigneeName, assigneeUserId, reasoning, ...}
    ↓
Build Message → creates {slackBlocks, slackText}
    ↓
Post Reply → sends to Slack thread
```

---

## Merging Data Between Branches

The trickiest part of this workflow is ensuring data flows correctly between nodes. Key things to watch:

1. **Task details from Node 6** need to reach **Node 10** (prompt builder). Pass them through via the loop items, or use a Merge node.

2. **channelId and messageTs from Node 2** need to reach **Node 14** (Slack reply). Make sure these are passed through every Code node using the `...$input.first().json` spread pattern.

3. **workloadSummary from Node 9** needs to reach **Nodes 10 and 13**. These should flow naturally if they're in sequence.

If data gets lost between nodes, use **Set** nodes to explicitly carry forward the fields you need.

---

## Testing

1. Make sure Workflow 1 is active and posting notifications
2. Click "Analyze & Recommend" on a notification
3. Verify:
   - [ ] Original message button updates to "Analyzed by {username}"
   - [ ] Thread reply appears with recommendation
   - [ ] Recommended assignee name is reasonable for the task type
   - [ ] Team capacity numbers are shown
   - [ ] "Auto-Assign to {Name}" button is present
   - [ ] "Open Task in TWFX" button works
   - [ ] Test with a design task (should recommend Jesslyn or Elika)
   - [ ] Test with a backend task (should recommend Edmund)
   - [ ] Test with a front-end task (should recommend Sid or Erron)

---

## Next Step

Proceed to **03-workflow3-auto-assignment.md** to build the auto-assign flow (triggered by the "Auto-Assign" button in the analysis reply).
