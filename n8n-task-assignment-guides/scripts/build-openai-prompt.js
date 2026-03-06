// ============================================================
// WORKFLOW 2 — Code Node: Build OpenAI Prompt
//
// Combines the task details and workload summary into the
// full prompt for GPT-4o analysis.
//
// INPUT: 
//   - workloadSummary (from calculate-workload)
//   - taskDetails (from MCP get_todo earlier in the workflow)
//     You may need to merge these from different branches.
//
// OUTPUT: openaiPrompt string for the OpenAI node
// ============================================================

// Get task details — adjust field paths based on your MCP get_todo output
// NOTE (from Phase 0 testing): MCP uses "content" for the task title, not "title" or "name".
// Description and estimatedHours may be null. Data is nested in content[0].text in raw MCP responses.
const taskData = $input.first().json.taskDetails || $input.first().json;
const taskTitle = taskData.taskTitle || taskData.content || taskData.name || 'Unknown Task';
const taskDescription = taskData.taskDescription || taskData.description || 'No description provided';
const taskProject = taskData.projectName || taskData.project?.name || 'Unknown Project';
const taskDueDate = taskData.dueDate || 'No deadline set';

// Get workload summary
const workloadSummary = $input.first().json.workloadSummary || [];

// Build the team workload section
const workloadLines = workloadSummary.map(m => {
  const statusIcon = m.percentUsed >= 80 ? '!!' : m.percentUsed >= 60 ? '!' : '';
  return `${m.name} (${m.role}): ${m.allocatedHours}h allocated / ${m.availableHours}h available (${m.percentUsed}% capacity) ${statusIcon}\nSkills: ${m.skills.join(', ')}`;
}).join('\n\n');

const systemPrompt = `You are a project management assistant analyzing task assignments for the WebFX Interactive team. You provide concise, actionable recommendations.

IMPORTANT: Your response MUST follow this exact format:

RECOMMENDED_ASSIGNEE: [exact name - must be one of: Giancarlo, Sid, Erron, Edmund, Jesslyn, Elika]

REASONING:
[2-3 bullet points explaining why this person is the best fit based on skills + availability]

TEAM_CAPACITY:
[One line per team member showing their capacity status]

TIMELINE:
[1-2 sentences about feasibility within the next 2 weeks]

MISSING_INFO:
[List any missing information or concerns, or "None" if all looks good]`;

const userPrompt = `NEW TASK:
Title: ${taskTitle}
Description: ${taskDescription}
Project: ${taskProject}
Due Date: ${taskDueDate}

TEAM WORKLOAD (Next 2 Weeks, 80 hours max capacity per person):

${workloadLines}

Based on the task requirements, team skills, and current workload:
1. Is this a design, development, or hybrid task?
2. What specific skills does this task require?
3. Which team members have the required skills?
4. Among qualified team members, who has the most availability?
5. Are there any concerns (missing info, tight timeline, capacity issues)?

Provide your recommendation following the exact format specified.`;

return [{
  json: {
    ...$input.first().json,
    systemPrompt,
    userPrompt,
    // Also pass through for later use
    taskTitle,
    taskDescription,
    taskProject,
    taskDueDate
  }
}];
