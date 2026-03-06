# Workflow 3: Auto-Assignment

**Goal:** When a user clicks "Auto-Assign to [Name]" in the analysis thread reply, move the task to the assignee's project/tasklist and assign them in TeamworkFX, then update Slack with a confirmation.

**Nodes:** 5 total (added to the Workflow 2 canvas, on the "False" branch of the IF node)  
**Time:** ~20 minutes

---

## Important: This Is Part of Workflow 2

This workflow is NOT a separate n8n workflow. It's built on the **False/auto_assign_task branch** of the IF node in Workflow 2. Both button types (Analyze and Auto-Assign) come through the same Slack interactivity webhook.

```
[Webhook: Slack Interactivity]
    → [Code: Parse Payload]        ← already built in Workflow 2
    → [IF: Route by action_id]     ← already built in Workflow 2
        ─── True (analyze_task): → Workflow 2 analysis nodes
        ─── False (auto_assign_task): → THIS WORKFLOW ↓
            → [Code: Prepare Assignment Data]
            → [MCP Client: move_todo]
            → [MCP Client: assign_todo]
            → [Code: Build Confirmation Message]
            → [Slack: Update Message]
```

---

## Node A1: Code (Prepare Assignment Data)

Connect this to the **False** output of the IF node from Workflow 2.

1. Add a **Code** node
2. Paste this code:

```javascript
// The parse-slack-payload Code node already extracted these fields
// for auto_assign_task actions:
//   taskId, currentProjectId, assigneeUserId, newProjectId, newTasklistId

const data = $input.first().json;

// Team name lookup for the confirmation message
// Keys are strings because the values parsed from the Slack button payload are strings
const TEAM_NAMES = {
  "12804013": "Giancarlo",
  "1226193945": "Sid",
  "1226175529": "Erron",
  "1225938597": "Edmund",
  "1226066097": "Jesslyn",
  "1226189703": "Elika"
};

const assigneeName = TEAM_NAMES[String(data.assigneeUserId)] || 'Team Member';

// Convert IDs to numbers — the MCP server requires numeric types
// for todoId, todolistId, and userId parameters.
return [{
  json: {
    taskId: Number(data.taskId),
    currentProjectId: data.currentProjectId,
    assigneeUserId: Number(data.assigneeUserId),
    newProjectId: data.newProjectId,
    newTasklistId: Number(data.newTasklistId),
    assigneeName,
    channelId: data.channelId,
    messageTs: data.messageTs,
    username: data.username,
    // We'll need the analysis message timestamp to update it
    // This is the message the user clicked the button on
    analysisMessageTs: data.messageTs
  }
}];
```

---

## Node A2: MCP Client (Move Todo)

1. Add an **MCP Client** node
2. Configure:
   - **Server URL:** `https://teamworkfx-mcp.com/mcp`
   - **Credential:** `TeamworkFX MCP` (Header Auth)
   - **Tool:** `move_todo`
   - **Input Mode:** JSON
   - **Parameters:**

```json
{
  "todoId": {{ $json.taskId }},
  "todolistId": {{ $json.newTasklistId }}
}
```

> **Note:** `todoId` and `todolistId` must be **numbers** (no quotes around the expressions). The MCP server validates types strictly. If the values coming from the Slack button payload are strings, you may need to convert them in the Code node (Node A1) using `Number(data.taskId)` etc.

**What this does:** Moves the task from the "New Interactive Requests" list to the assignee's personal "New Tasks" list in their project.

**Enable "Continue on Fail"** on this node so the workflow doesn't crash if the move fails. We'll check for errors in the next step.

---

## Node A3: MCP Client (Assign Todo)

1. Add an **MCP Client** node after the move
2. Configure:
   - **Server URL:** `https://teamworkfx-mcp.com/mcp`
   - **Credential:** `TeamworkFX MCP` (Header Auth)
   - **Tool:** `assign_todo`
   - **Input Mode:** JSON
   - **Parameters:**

```json
{
  "todoId": {{ $json.taskId }},
  "userId": {{ $json.assigneeUserId }}
}
```

> **Note:** Both `todoId` and `userId` must be **numbers** (no quotes). See Node A1 note about converting string values from the Slack payload.

**What this does:** Sets the "responsible party" on the task to the recommended team member.

**Enable "Continue on Fail"** on this node too.

---

## Node A4: Code (Build Confirmation Message)

1. Add a **Code** node
2. Paste this code:

```javascript
const data = $input.first().json;
const taskId = data.taskId;
const newProjectId = data.newProjectId;
const assigneeName = data.assigneeName || 'Team Member';

// Check if previous MCP calls succeeded
// Adjust these checks based on what the MCP nodes actually output on error
const hasError = data.error || data.errorMessage;

let blocks;

if (hasError) {
  // Error state — show error with manual link
  blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          `*Assignment Failed*`,
          ``,
          `There was an error assigning this task automatically.`,
          `Please assign it manually:`,
          ``,
          `<https://app.webfx.com/projects/${data.currentProjectId}/tasks/${taskId}|Open Task in TWFX>`
        ].join('\n')
      }
    }
  ];
} else {
  // Success state
  blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          `*Task Assigned Successfully!*`,
          ``,
          `*Assigned to:* ${assigneeName}`,
          `*Moved to:* ${assigneeName}'s Project`,
          ``,
          `<https://app.webfx.com/projects/${newProjectId}/tasks/${taskId}|View in TWFX>`
        ].join('\n')
      }
    }
  ];
}

return [{
  json: {
    ...data,
    slackBlocks: JSON.stringify(blocks),
    slackText: hasError
      ? 'Assignment failed — please assign manually'
      : `Task assigned to ${assigneeName}`
  }
}];
```

---

## Node A5: Slack (Update Analysis Message with Confirmation)

1. Add a **Slack** node (or HTTP Request)
2. If using **HTTP Request** node:
   - **Method:** POST
   - **URL:** `https://slack.com/api/chat.update`
   - **Headers:** `Authorization: Bearer xoxb-YOUR-SLACK-BOT-TOKEN`
   - **Body (JSON):**

```json
{
  "channel": "{{ $json.channelId }}",
  "ts": "{{ $json.analysisMessageTs }}",
  "text": "{{ $json.slackText }}",
  "blocks": {{ $json.slackBlocks }}
}
```

**What this does:** Replaces the analysis message (with the Auto-Assign button) with a simple confirmation that the task has been assigned and moved. No more buttons — the action is complete.

---

## Testing

1. Run through the full flow: create task → notification → click "Analyze & Recommend" → get analysis → click "Auto-Assign to {Name}"
2. Verify:
   - [ ] Task is moved to the correct project in TWFX
   - [ ] Task is in the assignee's "New Tasks" list
   - [ ] Task is assigned to the correct person in TWFX
   - [ ] Slack analysis message is replaced with confirmation
   - [ ] Assignee's name appears correctly (plain text, no @tag)
   - [ ] TWFX link in confirmation points to the new project location
   - [ ] Test error handling: temporarily use a wrong taskId and verify the error message appears

---

## Notes

### About the message timestamp (`ts`)

When the user clicks "Auto-Assign to {Name}", the Slack payload includes the `message.ts` of the message they clicked on. This is the **analysis thread reply** (Message 2), not the original notification (Message 1). The `chat.update` call uses this `ts` to replace that specific message.

### MCP move_todo cross-project behavior

The `move_todo` MCP tool moves a todo to a specified todolist. If the todolist is in a different project, the task should move to that project automatically. If this doesn't work (the task stays in the original project), you may need to:

1. Check the MCP server documentation for a separate "move to project" tool
2. Or use a two-step process: delete from source, create in destination

Test this carefully in Phase 0 before relying on it.

---

## Next Step

Proceed to **04-workflow4-interactive-bot.md** to build the @mention bot.
