// ============================================================
// WORKFLOW 2/3 — Code Node: Parse Slack Interactivity Payload
//
// Slack sends interactive button clicks as a URL-encoded POST
// with a single "payload" field containing JSON.
//
// This node parses that payload and extracts everything needed
// for both the Analyze and Auto-Assign flows.
//
// INPUT: Raw webhook body from Slack interactivity
// OUTPUT: Parsed fields for downstream nodes
// ============================================================

// Slack sends the payload as a URL-encoded form field
// In n8n, the webhook node may already parse it, or it may be in $input.first().json.payload
let payload;

if (typeof $input.first().json.payload === 'string') {
  payload = JSON.parse($input.first().json.payload);
} else if ($input.first().json.payload && typeof $input.first().json.payload === 'object') {
  payload = $input.first().json.payload;
} else {
  // If n8n parsed the body differently, try the full body
  payload = $input.first().json;
}

const action = payload.actions[0];
const actionId = action.action_id;
const actionValue = action.value;

// Extract common fields
const username = payload.user?.username || payload.user?.name || 'unknown';
const userId = payload.user?.id || '';
const channelId = payload.channel?.id || '';
const messageTs = payload.message?.ts || '';
const triggerId = payload.trigger_id || '';
const responseUrl = payload.response_url || '';

// Parse the button value based on action type
let parsed = {
  actionId,
  actionValue,
  username,
  slackUserId: userId,
  channelId,
  messageTs,
  triggerId,
  responseUrl,
  originalBlocks: payload.message?.blocks || []
};

if (actionId === 'analyze_task') {
  // Value format: analyze_{taskId}_{projectId}
  // Convert to numbers — MCP server requires numeric IDs for todoId, etc.
  const parts = actionValue.split('_');
  parsed.taskId = Number(parts[1]);
  parsed.projectId = Number(parts[2]);
} else if (actionId === 'auto_assign_task') {
  // Value format: assign_{taskId}_{currentProjectId}_{userId}_{newProjectId}_{newTasklistId}
  // Convert to numbers — MCP server requires numeric IDs.
  // The Workflow 3 Code node (Prepare Assignment Data) also does Number() conversion
  // as a safety net, but converting here is cleaner.
  const parts = actionValue.split('_');
  parsed.taskId = Number(parts[1]);
  parsed.currentProjectId = Number(parts[2]);
  parsed.assigneeUserId = Number(parts[3]);
  parsed.newProjectId = Number(parts[4]);
  parsed.newTasklistId = Number(parts[5]);
}

return [{ json: parsed }];
