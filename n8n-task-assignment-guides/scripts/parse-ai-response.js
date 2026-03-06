// ============================================================
// WORKFLOW 2 — Code Node: Parse AI Response & Look Up Assignee
//
// Takes the OpenAI response text and extracts:
//   - Recommended assignee name
//   - Reasoning text
//   - Team capacity overview
//   - Timeline assessment
//   - Missing info / concerns
//
// Then looks up the assignee in the team config to get their
// userId, projectId, and newTasksListId for the Auto-Assign button.
//
// INPUT: OpenAI response + workloadSummary + task info
// OUTPUT: Parsed recommendation with assignee details
// ============================================================

// ---- TEAM LOOKUP ----
// NOTE: IDs are kept as strings here because they get embedded into Slack button
// values via string concatenation (e.g. "assign_12345_67890_..."). The Workflow 3
// Code node (Prepare Assignment Data) converts them to numbers before passing to
// MCP calls, which require numeric types.
const TEAM_LOOKUP = {
  "giancarlo": { name: "Giancarlo", userId: "12804013", projectId: "15004754", newTasksListId: "30886797" },
  "sid":       { name: "Sid",       userId: "1226193945", projectId: "15004756", newTasksListId: "333488395" },
  "erron":     { name: "Erron",     userId: "1226175529", projectId: "15004755", newTasksListId: "333422938" },
  "edmund":    { name: "Edmund",    userId: "1225938597", projectId: "15004757", newTasksListId: "32018114" },
  "jesslyn":   { name: "Jesslyn",   userId: "1226066097", projectId: "15004752", newTasksListId: "333400073" },
  "elika":     { name: "Elika",     userId: "1226189703", projectId: "15004758", newTasksListId: "333466163" }
};

// Get the AI response text
// The exact path depends on how the OpenAI node outputs data.
// Common paths: $input.first().json.text, $input.first().json.message.content, etc.
const aiResponse = $input.first().json.text
  || $input.first().json.message?.content
  || $input.first().json.output
  || $input.first().json.content
  || '';

// Pass through from previous nodes
const taskId = $input.first().json.taskId;
const projectId = $input.first().json.projectId;
const taskTitle = $input.first().json.taskTitle;
const taskDueDate = $input.first().json.taskDueDate;
const workloadSummary = $input.first().json.workloadSummary || [];

// ---- PARSE AI RESPONSE ----

// Extract recommended assignee name
let assigneeName = '';
const assigneeMatch = aiResponse.match(/RECOMMENDED_ASSIGNEE:\s*(.+)/i);
if (assigneeMatch) {
  assigneeName = assigneeMatch[1].trim();
}

// Extract sections
function extractSection(text, sectionName, nextSections) {
  const pattern = new RegExp(
    `${sectionName}:\\s*\\n([\\s\\S]*?)(?:${nextSections.map(s => s + ':').join('|')}|$)`,
    'i'
  );
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

const reasoning = extractSection(aiResponse, 'REASONING', ['TEAM_CAPACITY', 'TIMELINE', 'MISSING_INFO']);
const teamCapacity = extractSection(aiResponse, 'TEAM_CAPACITY', ['TIMELINE', 'MISSING_INFO']);
const timeline = extractSection(aiResponse, 'TIMELINE', ['MISSING_INFO']);
const missingInfo = extractSection(aiResponse, 'MISSING_INFO', []);

// ---- LOOK UP ASSIGNEE ----
const lookupKey = assigneeName.toLowerCase().trim();
const assignee = TEAM_LOOKUP[lookupKey];

if (!assignee) {
  // Fallback: try to find a partial match
  const found = Object.entries(TEAM_LOOKUP).find(([key]) =>
    lookupKey.includes(key) || key.includes(lookupKey)
  );
  if (found) {
    const [, data] = found;
    return [{
      json: {
        taskId,
        projectId,
        taskTitle,
        taskDueDate,
        assigneeName: data.name,
        assigneeUserId: data.userId,
        assigneeProjectId: data.projectId,
        assigneeNewTasksListId: data.newTasksListId,
        reasoning,
        teamCapacity,
        timeline,
        missingInfo,
        workloadSummary,
        aiResponseRaw: aiResponse
      }
    }];
  }

  // Could not find assignee — return without assignment button info
  return [{
    json: {
      taskId,
      projectId,
      taskTitle,
      taskDueDate,
      assigneeName: assigneeName || 'Unknown',
      assigneeUserId: null,
      assigneeProjectId: null,
      assigneeNewTasksListId: null,
      reasoning,
      teamCapacity,
      timeline,
      missingInfo,
      workloadSummary,
      aiResponseRaw: aiResponse,
      error: `Could not match assignee name "${assigneeName}" to a team member`
    }
  }];
}

return [{
  json: {
    taskId,
    projectId,
    taskTitle,
    taskDueDate,
    assigneeName: assignee.name,
    assigneeUserId: assignee.userId,
    assigneeProjectId: assignee.projectId,
    assigneeNewTasksListId: assignee.newTasksListId,
    reasoning,
    teamCapacity,
    timeline,
    missingInfo,
    workloadSummary,
    aiResponseRaw: aiResponse
  }
}];
