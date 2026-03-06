// ============================================================
// WORKFLOW 1 — Code Node: Build Slack Notification
// 
// Builds the Slack Block Kit JSON for the new task notification.
// Uses header, fields layout, context, and action buttons.
//
// INPUT: Expects these fields from the previous Set node:
//   - taskId, projectId, taskTitle, channel, dueDate,
//     pocName, estimatedHours, priority
//
// OUTPUT: Sets $json.slackBlocks and $json.slackText
// ============================================================

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
