// ============================================================
// WORKFLOW 3 — Code Node: Build Assignment Confirmation (Message 3)
//
// After successfully moving + assigning a task, this builds the
// Slack Block Kit JSON that replaces the analysis message.
//
// Uses plain text name (no @tagging).
//
// INPUT: Parsed assign payload with task/assignee details
// OUTPUT: slackBlocks for Slack chat.update
// ============================================================

// ---- TEAM LOOKUP for display names ----
const TEAM_NAMES = {
  "12804013": "Giancarlo",
  "1226193945": "Sid",
  "1226175529": "Erron",
  "1225938597": "Edmund",
  "1226066097": "Jesslyn",
  "1226189703": "Elika"
};

const data = $input.first().json;
const taskId = data.taskId;
const taskTitle = data.taskTitle || 'Task';
const assigneeUserId = data.assigneeUserId;
const newProjectId = data.newProjectId;
const taskDueDate = data.taskDueDate || 'No deadline';

// Convert to string for lookup since TEAM_NAMES keys are strings
// but assigneeUserId may be a number after parse-slack-payload conversion
const assigneeName = TEAM_NAMES[String(assigneeUserId)] || 'Team Member';

const blocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: [
        `*Task Assigned Successfully!*`,
        ``,
        `*Task:* ${taskTitle}`,
        `*Assigned to:* ${assigneeName}`,
        `*Moved to:* ${assigneeName}'s Project`,
        `*Due:* ${taskDueDate}`,
        ``,
        `<https://app.webfx.com/projects/${newProjectId}/tasks/${taskId}|View in TWFX>`
      ].join('\n')
    }
  }
];

return [{
  json: {
    ...data,
    slackBlocks: JSON.stringify(blocks),
    slackText: `Task assigned to ${assigneeName}`
  }
}];
