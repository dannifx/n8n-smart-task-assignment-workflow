# Workflow 4: Interactive Slack Bot

**Goal:** When a user @mentions the bot in `#interactive-task-assignment`, handle one of three commands:
1. **Task URL** → Run AI analysis and reply with recommendation
2. **"Assign to {Name}"** → Assign from a thread with a prior analysis
3. **"Team capacity"** → Show a formatted overview of everyone's workload

**Nodes:** ~18 total (separate workflow)  
**Time:** ~30 minutes

---

## Prerequisites

Before building this workflow:

1. **Workflow 2 must be working** — this workflow reuses its analysis logic
2. **Slack app must subscribe to events:**
   - Go to your Slack app at **api.slack.com**
   - Navigate to **Event Subscriptions** → Enable Events
   - Set the **Request URL** to a new n8n webhook URL (you'll create this below)
   - Under **Subscribe to bot events**, add: `app_mention`
   - Save

---

## Architecture Decision: Sub-Workflow

To avoid duplicating the entire analysis pipeline (MCP queries, workload calc, OpenAI, etc.), we'll extract the core analysis logic from Workflow 2 into a **sub-workflow** that both Workflow 2 and Workflow 4 can call.

### Option A: Dedicated Sub-Workflow (Recommended)

Create a separate workflow called "Sub: Task Analysis" that contains:
- MCP get_todo (task details)
- Team member array builder
- Loop + MCP get_todos (workload per member)
- Calculate workload
- Build OpenAI prompt
- OpenAI call
- Parse AI response
- Build analysis message

**Trigger:** Use an **Execute Workflow Trigger** node instead of a Webhook.  
**Input:** Receives `taskId`, `projectId`, `channelId`, `threadTs`  
**Output:** Returns `slackBlocks`, `slackText`, `assigneeName`, etc.

Then both Workflow 2 and Workflow 4 use an **Execute Workflow** node to call it.

### Option B: Duplicate Nodes (Simpler)

Copy the analysis nodes from Workflow 2 directly into Workflow 4. Simpler to set up but harder to maintain — any changes need to be made in both places.

**This guide covers both options.** Use whichever fits your preference.

---

## Workflow Overview

```
[Webhook: Slack Events]
    → [Code: Handle Verification & Parse Mention]
    → [IF: Valid Request?] ─── False: stop
    → [IF: Is Capacity Request?]
        ─── True: ───
            → [Code: Build Team Array]
            → [Loop Over Items]
                → [MCP Client: get_todos per member]
            → [Code: Calculate Workload]
            → [Code: Build Capacity Message]
            → [Slack: Post Capacity Reply]
        ─── False: ───
            → [IF: Is Assign Command?]
                ─── True: ───
                    → [Slack API: Fetch Thread] → [Code: Parse Thread]
                    → [MCP: Move Task] → [MCP: Assign Task]
                    → [Slack: Post Confirmation]
                ─── False: ───
                    → [IF: Is Task URL?]
                        ─── True: Task analysis nodes (Get Task Details → ... → Post Analysis)
                        ─── False: [HTTP Request: Post Error Reply]
```

---

## Node 1: Webhook (Slack Events)

1. Create a **new workflow** called "Workflow 4: Interactive Bot"
2. Add a **Webhook** node
3. Configure:
   - **HTTP Method:** POST
   - **Path:** something like `slack-events`
   - **Response Mode:** "Immediately"

4. **Copy the Production URL** and paste it into your Slack app's Event Subscriptions Request URL.

**Important — Slack URL Verification:** When you first set the Request URL in Slack, it sends a verification challenge. Your webhook needs to respond with the challenge value. n8n's default "Respond Immediately" mode should handle this, but if it doesn't:

Add a **Code** node right after the Webhook that handles verification:

```javascript
const body = $input.first().json;

// Slack sends a URL verification challenge on setup
if (body.type === 'url_verification') {
  // You may need to use the "Respond to Webhook" node instead
  // to send back: { challenge: body.challenge }
  return [{ json: { challenge: body.challenge, isVerification: true } }];
}

// For actual events, pass through
return [{ json: { ...body, isVerification: false } }];
```

If Slack's verification still fails, temporarily change the webhook's Response Mode to "Using Respond to Webhook Node" and add a Respond node that returns the challenge. Switch back to "Immediately" after verification succeeds.

---

## Node 2: Code (Handle Verification & Parse Mention)

1. Add a **Code** node
2. Paste the full script from `scripts/parse-bot-mention.js`

This node classifies every @mention into one of five types:

| `requestType` | Trigger | Example |
|---|---|---|
| `verification` | Slack URL challenge | *(automatic)* |
| `capacity` | Keywords like "capacity", "workload", "who's available" | `@bot team capacity` |
| `assign` | "assign to {Name}" | `@bot assign to Erron` |
| `task_url` | TWFX URL in the message | `@bot https://app.webfx.com/projects/123/tasks/456` |
| `unknown` | Anything else | `@bot hello` |

The output always includes `requestType`, `channelId`, `messageTs`, and `threadTs`.

---

## Node 3: IF (Is Verification?)

1. Add an **IF** node
2. Condition:
   - **Value 1:** `{{ $json.requestType }}`
   - **Operation:** Equals
   - **Value 2:** `verification`
3. **True** → stop (do nothing, Slack already received the 200 response)
4. **False** → continues to Node 4

---

## Node 4: IF (Is Capacity Request?)

On the **False** branch of the verification check:

1. Add an **IF** node
2. Condition:
   - **Value 1:** `{{ $json.requestType }}`
   - **Operation:** Equals
   - **Value 2:** `capacity`
3. **True** → goes to the **Capacity Branch** (Nodes 5a–5f below)
4. **False** → goes to Node 6 (existing assign/URL routing)

---

---

## Capacity Branch (Nodes 5a–5f) — True output of "Is Capacity Request?"

This branch queries every team member's workload via MCP and posts a formatted overview to Slack. No AI analysis needed — just raw capacity data.

### Node 5a: Code (Build Team Array for Capacity)

1. Add a **Code** node on the **True** branch of the "Is Capacity Request?" IF
2. Paste this code:

```javascript
const data = $input.first().json;

const TEAM_MEMBERS = [
  { name: "Giancarlo",  role: "Lead Full-Stack Developer",  userId: 12804013,    projectId: 15004754, newTasksListId: 30886797,  skills: ["Full-stack development (Expert)", "Trello integrations (Expert)", "Form handling (Expert)"] },
  { name: "Sid",        role: "Front-End Developer",        userId: 1226193945,  projectId: 15004756, newTasksListId: 333488395, skills: ["Front-end development (Expert)", "ACF development (Advanced)", "Calculators (Advanced)"] },
  { name: "Erron",      role: "Full-Stack Developer",       userId: 1226175529,  projectId: 15004755, newTasksListId: 333422938, skills: ["Full-stack development (Advanced)", "Tools development (Expert)", "Interactive components (Expert)"] },
  { name: "Edmund",     role: "Backend Developer",          userId: 1225938597,  projectId: 15004757, newTasksListId: 32018114,  skills: ["Backend development (Expert)", "Tools development (Expert)", "Complex components (Expert)"] },
  { name: "Jesslyn",    role: "Lead Graphic, Web & Product Designer", userId: 1226066097,  projectId: 15004752, newTasksListId: 333400073, skills: ["UX design (Expert)", "Tools design (Expert)", "Branding (Expert)"] },
  { name: "Elika",      role: "Designer",                   userId: 1226189703,  projectId: 15004758, newTasksListId: 333466163, skills: ["Illustration (Expert)", "Social assets (Expert)", "Unique graphics (Expert)"] }
];

return TEAM_MEMBERS.map(member => ({
  json: {
    ...member,
    channelId: data.channelId,
    threadTs: data.threadTs,
    messageTs: data.messageTs
  }
}));
```

This outputs 6 items (one per team member) for the Loop node.

---

### Node 5b: Loop Over Items → MCP Client (Get Todos per Member)

1. Add a **Loop Over Items** node
   - **Batch Size:** 1
2. Inside the loop, add an **MCP Client** node:
   - **Tool:** `get_todos`
   - **Parameters (JSON):**

```json
{
  "projectId": {{ $json.projectId }},
  "includeCompleted": false,
  "fields": ["estimatedHours", "dueDate", "status", "todolist", "priority", "responsibleUser"],
  "limit": 1000
}
```

> **Note:** This queries by `projectId` (same pattern as Workflow 2's workload loop). Each member has their own project in TWFX containing their task lists.

---

### Node 5c: Code (Calculate Workload)

1. Add a **Code** node after the loop completes
2. Paste the full script from `scripts/calculate-workload.js`

This is the same workload calculation used in Workflow 2. It processes the MCP results and produces a `workloadSummary` array with each member's `allocatedHours`, `availableHours`, `percentUsed`, `todoCount`, and `capacityStatus`.

**Important:** You'll also need to pass through `channelId` and `threadTs` so the message node can post the reply. Add these lines at the end of the calculate-workload script, before the return:

```javascript
// Pass through Slack context for the capacity message
// Pull from the first item's data (all items carry the same channelId/threadTs)
const firstItem = allItems[0]?.json || {};
```

And in the return statement, include them:

```javascript
return [{
  json: {
    workloadSummary,
    channelId: firstItem.channelId,
    threadTs: firstItem.threadTs
  }
}];
```

---

### Node 5d: Code (Build Capacity Message)

1. Add a **Code** node
2. Paste the full script from `scripts/build-capacity-message.js`

**What this produces:**

A beautifully formatted Slack Block Kit message with:
- Header: "📊 Team Capacity Overview"
- Context line with date and capacity period
- **Developers section** — each member with status emoji (🟢🟡🔴), visual progress bar, utilization %, available hours, and task count
- **Designers section** — same format
- **Team summary** — total available hours, who's at capacity, who's most available
- Footer explaining the calculation methodology

Status indicators:
- 🟢 Low utilization (< 60%)
- 🟡 Medium utilization (60–79%)
- 🔴 High utilization (80%+)

---

### Node 5e: Slack (Post Capacity Reply)

1. Add an **HTTP Request** node (or Slack node)
2. Configure:
   - **Method:** POST
   - **URL:** `https://slack.com/api/chat.postMessage`
   - **Headers:** `Authorization: Bearer xoxb-YOUR-SLACK-TOKEN`
   - **Body (JSON):**

```json
{
  "channel": "{{ $json.channelId }}",
  "thread_ts": "{{ $json.threadTs }}",
  "text": "{{ $json.slackText }}",
  "blocks": {{ $json.slackBlocks }},
  "reply_broadcast": false
}
```

> **Note:** `reply_broadcast` is `false` for capacity checks — they stay in the thread. Only task analysis replies broadcast to the channel.

---

## Node 6: IF (Is Assign Command?) — False output of "Is Capacity Request?"

On the **False** branch of the capacity check, route to the existing assign/URL logic:

1. Add an **IF** node
2. Condition:
   - **Value 1:** `{{ $json.requestType }}`
   - **Operation:** Equals
   - **Value 2:** `assign`
3. **True** → goes to the assignment branch (Fetch Thread → Parse → Move → Assign → Confirm)
4. **False** → goes to Node 7 (Has Valid URL?)

---

## Node 7: IF (Has Valid URL?) — False output of "Is Assign Command?"

1. Add an **IF** node
2. Condition:
   - **Value 1:** `{{ $json.requestType }}`
   - **Operation:** Equals
   - **Value 2:** `task_url`
3. **True** → goes to the task analysis nodes
4. **False** → goes to the error reply (posts `$json.errorMessage` to Slack)

---

## Node 8a: Execute Workflow (Task Analysis) — True Branch of "Has Valid URL?"

### If using Sub-Workflow (Option A):

1. Add an **Execute Workflow** node
2. Configure:
   - **Workflow:** Select your "Sub: Task Analysis" sub-workflow
   - **Input Data:** Pass `taskId`, `projectId`, `channelId`, `threadTs`

The sub-workflow runs the full analysis pipeline and returns the Slack blocks.

### If duplicating nodes (Option B):

Copy nodes 6-13 from Workflow 2 into this workflow, connecting them after the IF node's True output. Adjust the input references as needed (the data comes from Node 2 instead of Workflow 2's payload parser).

---

## Node 8b: Slack (Post Analysis Reply) — After Task Analysis

1. Add a **Slack** node (or HTTP Request)
2. If using **HTTP Request** node:
   - **Method:** POST
   - **URL:** `https://slack.com/api/chat.postMessage`
   - **Headers:** `Authorization: Bearer xoxb-YOUR-SLACK-TOKEN`
   - **Body (JSON):**

```json
{
  "channel": "{{ $json.channelId }}",
  "thread_ts": "{{ $json.threadTs }}",
  "text": "{{ $json.slackText }}",
  "blocks": {{ $json.slackBlocks }}
}
```

---

## Node 9: IF (Is Task URL?) — False Branch of "Is Assign Command?"

After the "Is Assign Command?" check, we need to distinguish between task URL requests and unknown requests.

1. Add an **IF** node on the **False** branch of "Is Assign Command?"
2. **Name it:** "Is Task URL?"
3. **Condition:**
   - **Value 1:** `{{ $json.requestType }}`
   - **Operation:** `is equal to`
   - **Value 2:** `task_url`
4. **True** output → connects to task analysis branch (Get Task Details, etc.)
5. **False** output → connects to error reply node (Node 10)

---

## Node 10: HTTP Request (Post Error Reply) — False Branch of "Is Task URL?"

For unknown requests (no valid URL, not a capacity check, not an assign command):

1. Add an **HTTP Request** node on the **False** branch of "Is Task URL?"
2. **Name it:** "Post Error Reply"
3. Configure:
   - **Method:** POST
   - **URL:** `https://slack.com/api/chat.postMessage`
   - **Authentication:** Header Auth
   - **Header:** `Authorization: Bearer xoxb-YOUR-SLACK-TOKEN`
   - **Body:** Switch to **Expression** mode
   - **Body Expression:**

```javascript
={{
  {
    "channel": $json.channelId,
    "thread_ts": $json.threadTs,
    "text": $json.errorMessage,
    "reply_broadcast": true
  }
}}
```

**Note:** `reply_broadcast: true` makes the error message visible in the main channel, not just the thread. This ensures users see the help menu even if they're not watching the thread.

The error message from the parse node includes a help menu showing all available commands:

```
I didn't understand that. Here's what I can do:

📊 Check capacity: @bot team capacity
🔍 Analyze a task: @bot [TWFX task URL]
✅ Assign from thread: @bot assign to [Name]
```

---

## Setting Up the Sub-Workflow (Option A Details)

If you chose Option A, here's how to create the sub-workflow:

### Create "Sub: Task Analysis"

1. Create a new workflow called "Sub: Task Analysis"
2. Add an **Execute Workflow Trigger** node as the first node
   - This makes the workflow callable from other workflows
3. Add the following nodes (these are nodes 6-13 from Workflow 2):
   - **MCP Client:** `get_todo` (task details)
   - **Code:** Build team member array
   - **Loop + MCP Client:** `get_todos` per member
   - **Code:** Calculate workload
   - **Code:** Build OpenAI prompt
   - **OpenAI:** GPT-4o analysis
   - **Code:** Parse AI response
   - **Code:** Build analysis message (with both buttons)
4. The sub-workflow should output the final `slackBlocks`, `slackText`, and assignee details

> **Important MCP parameter types:** All MCP calls require `todoId` / `responsibleUserId` as **numbers** (not strings) and `fields` as **JSON arrays** (not comma-separated strings). The `taskId` and `projectId` passed into this sub-workflow should already be numbers (see Node 2 above and Workflow 2's team member array). See `02-workflow2-ai-analysis.md` for the corrected parameter formats.

### Update Workflow 2

In Workflow 2, replace nodes 6-13 with a single **Execute Workflow** node that calls "Sub: Task Analysis". Pass `taskId`, `projectId`, `channelId`, and `messageTs` as inputs.

---

## Testing

1. Activate the workflow

### Test Capacity Request
2. In `#interactive-task-assignment`, type:
   ```
   @TaskAssignmentBot team capacity
   ```
3. Verify:
   - [ ] Bot replies in thread with a formatted capacity overview
   - [ ] Developers and Designers are grouped separately
   - [ ] Each member shows utilization %, available hours, and task count
   - [ ] Status emojis are correct (🟢 < 60%, 🟡 60-79%, 🔴 80%+)
   - [ ] Team summary at the bottom shows totals
   - [ ] Also test with variations: "workload", "who's available", "capacity"

### Test Task Analysis
4. Type:
   ```
   @TaskAssignmentBot who should handle this? https://app.webfx.com/projects/15004754/tasks/123456
   ```
   (Use a real task URL)
5. Verify:
   - [ ] Bot replies in thread with analysis
   - [ ] Analysis includes recommendation, team capacity, timeline
   - [ ] "Auto-Assign" and "Open Task" buttons work

### Test Assign Command
6. In the thread from step 4, type:
   ```
   @TaskAssignmentBot assign to Erron
   ```
7. Verify:
   - [ ] Task is moved and assigned
   - [ ] Confirmation message posted

### Test Error Handling
8. Type a message with no recognized command:
   ```
   @TaskAssignmentBot hello
   ```
9. Verify:
   - [ ] Bot replies with a help message listing available commands
   - [ ] Help message appears in both thread and main channel (reply_broadcast: true)
   - [ ] Workflow doesn't try to analyze a task or throw errors

---

## Notes

### Rate Limiting

Each @mention triggers the full analysis pipeline (6 MCP calls + 1 OpenAI call). At ~50 analyses/month this is fine, but if people start hammering it, consider adding a cooldown check (e.g., don't re-analyze the same task within 5 minutes).

### Bot Display Name

The bot's display name in Slack is configured in your Slack app settings under **App Home** → **App Display Name**. Set it to something like "Task Assignment Bot".
