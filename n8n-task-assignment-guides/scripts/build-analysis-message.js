// ============================================================
// WORKFLOW 2 — Code Node: Build Analysis Thread Reply (Message 2)
//
// Builds the Slack Block Kit JSON for the AI analysis results.
// Two buttons: "Auto-Assign to {Name}" and "Open Task in TWFX"
//
// INPUT: Parsed AI response with assignee details + workload
// OUTPUT: slackBlocks for the Slack thread reply
// ============================================================

const data = $input.first().json;

const taskId = data.taskId;
const projectId = data.projectId;
const taskTitle = data.taskTitle || 'Task';
const taskDueDate = data.taskDueDate || 'No deadline';
const assigneeName = data.assigneeName;
const assigneeUserId = data.assigneeUserId;
const assigneeProjectId = data.assigneeProjectId;
const assigneeNewTasksListId = data.assigneeNewTasksListId;
const reasoning = data.reasoning || 'No reasoning provided';
const timeline = data.timeline || 'No timeline assessment';
const missingInfo = data.missingInfo || 'None';
const workloadSummary = data.workloadSummary || [];

// Build capacity lines with status indicators
const capacityLines = workloadSummary.map(m => {
  let icon = '';
  if (m.percentUsed >= 80) icon = '!!';
  else if (m.percentUsed >= 60) icon = '!';
  return `${icon} ${m.name}: ${m.availableHours}h available (${m.percentUsed}% utilized)`;
}).join('\n');

// Build the blocks
const blocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Assignment Recommendation*\n\n*SUGGESTED ASSIGNEE:* ${assigneeName}\n\n*Reasoning:*\n${reasoning}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*TEAM CAPACITY (Next 2 Weeks):*\n${capacityLines}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Timeline:* ${timeline}\n\n*Notes:*\n${missingInfo}`
    }
  }
];

// Add action buttons
const actionElements = [];

// Only add Auto-Assign button if we successfully matched an assignee
if (assigneeUserId && assigneeProjectId && assigneeNewTasksListId) {
  actionElements.push({
    type: "button",
    text: {
      type: "plain_text",
      text: `Auto-Assign to ${assigneeName}`,
      emoji: true
    },
    style: "primary",
    value: `assign_${taskId}_${projectId}_${assigneeUserId}_${assigneeProjectId}_${assigneeNewTasksListId}`,
    action_id: "auto_assign_task"
  });
}

// Always add Open Task button
actionElements.push({
  type: "button",
  text: {
    type: "plain_text",
    text: "Open Task in TWFX",
    emoji: true
  },
  url: `https://app.webfx.com/projects/${projectId}/tasks/${taskId}`,
  action_id: "open_task_link_analysis"
});

blocks.push({
  type: "actions",
  elements: actionElements
});

// Add context footer
blocks.push({
  type: "context",
  elements: [
    {
      type: "mrkdwn",
      text: `<https://app.webfx.com/projects/${projectId}/tasks/${taskId}|View in TWFX>`
    }
  ]
});

return [{
  json: {
    ...data,
    slackBlocks: JSON.stringify(blocks),
    slackText: `Recommendation: Assign to ${assigneeName}`
  }
}];
