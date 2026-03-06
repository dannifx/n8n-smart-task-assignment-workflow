// ============================================================
// WORKFLOW 2 — Code Node: Build Updated Notification (after analysis requested)
//
// Replaces the "Analyze & Recommend" button with
// "Analyzed by {username}" so people know it's been done.
//
// INPUT: Parsed Slack payload with originalBlocks and username
// OUTPUT: Updated blocks JSON for Slack chat.update
// ============================================================

const taskId = $input.first().json.taskId;
const projectId = $input.first().json.projectId;
const username = $input.first().json.username;
const originalBlocks = $input.first().json.originalBlocks;

// Rebuild blocks — keep the info sections, update the actions
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
