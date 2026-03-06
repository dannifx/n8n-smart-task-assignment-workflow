// ============================================================
// WORKFLOW 2 — Code Node: Calculate Workload from MCP Results
//
// After the Loop node queries get_todos for each team member,
// this node receives ALL the results and calculates:
//   - Allocated hours per member (next 2 weeks)
//   - Available hours per member
//   - Capacity percentage
//
// INPUT: Array of items from the Loop node. Each item has:
//   - memberName, memberRole, memberUserId, memberProjectId,
//     memberNewTasksListId, memberSkills
//   - todos: array of todo objects from MCP get_todos
//
// OUTPUT: Single item with workloadSummary array
// ============================================================

// ---- TEAM CONFIG (paste from team-config.js) ----
// NOTE: userId values are numbers because the MCP server requires numeric types.
const TEAM_MEMBERS = [
  {
    name: "Giancarlo",
    role: "Lead Full-Stack Developer",
    userId: 12804013,
    projectId: 15004754,
    newTasksListId: 30886797,
    skills: [
      "Full-stack development (Expert)",
      "Trello integrations (Expert)",
      "Form handling (Expert)",
      "Can handle any dev task",
      "Leadership and complex problem-solving"
    ]
  },
  {
    name: "Sid",
    role: "Front-End Developer",
    userId: 1226193945,
    projectId: 15004756,
    newTasksListId: 333488395,
    skills: [
      "Front-end development (Expert)",
      "ACF development (Advanced)",
      "Calculators (Advanced)",
      "Unique pages (Advanced)",
      "Bug fixes (Advanced)"
    ]
  },
  {
    name: "Erron",
    role: "Full-Stack Developer",
    userId: 1226175529,
    projectId: 15004755,
    newTasksListId: 333422938,
    skills: [
      "Full-stack development (Advanced)",
      "Tools development (Expert)",
      "Interactive components (Expert)",
      "Bug fixing (Expert)",
      "Can style without designers",
      "Strong CSS/styling skills"
    ]
  },
  {
    name: "Edmund",
    role: "Backend Developer",
    userId: 1225938597,
    projectId: 15004757,
    newTasksListId: 32018114,
    skills: [
      "Backend development (Expert)",
      "Tools development (Expert)",
      "Backend systems (Expert)",
      "Complex components (Expert)",
      "Database and server-side logic"
    ]
  },
  {
    name: "Jesslyn",
    role: "Lead Graphic, Web & Product Designer",
    userId: 1226066097,
    projectId: 15004752,
    newTasksListId: 333400073,
    skills: [
      "UX design (Expert)",
      "Tools design (Expert)",
      "Branding (Expert)",
      "Web design (Expert)",
      "Product design (Expert)",
      "Complex design requests (Expert)",
      "Leadership"
    ]
  },
  {
    name: "Elika",
    role: "Designer",
    userId: 1226189703,
    projectId: 15004758,
    newTasksListId: 333466163,
    skills: [
      "Illustration (Expert)",
      "Social assets (Expert)",
      "Unique graphics (Expert)",
      "Branding (Advanced)",
      "Web design (Advanced)"
    ]
  }
];

const MAX_CAPACITY = 80; // 2 weeks x 40 hours

// ---- PROCESS LOOP RESULTS ----

// The Loop node outputs items — one per team member.
// Each item should contain the MCP get_todos response for that member.
const allItems = $input.all();

const workloadSummary = [];

for (let i = 0; i < TEAM_MEMBERS.length; i++) {
  const member = TEAM_MEMBERS[i];

  // Get the todos for this member from the loop output
  // The exact path depends on how n8n structures the Loop output.
  // It may be allItems[i].json.todos or allItems[i].json (the raw MCP response).
  // Adjust this path based on what you see in the n8n output panel.
  const memberData = allItems[i]?.json;
  let todos = [];

  // Primary path: MCP response nests data in content[0].text.todos
  // (confirmed during Phase 0 testing)
  if (memberData?.content?.[0]?.text?.todos) {
    todos = memberData.content[0].text.todos;
  } else if (Array.isArray(memberData)) {
    todos = memberData;
  } else if (memberData?.todos && Array.isArray(memberData.todos)) {
    todos = memberData.todos;
  } else if (memberData?.items && Array.isArray(memberData.items)) {
    todos = memberData.items;
  } else if (memberData?.content) {
    // Fallback: MCP might return data in a different content structure
    try {
      const parsed = typeof memberData.content === 'string'
        ? JSON.parse(memberData.content)
        : memberData.content;
      todos = Array.isArray(parsed) ? parsed : (parsed.todos || parsed.items || []);
    } catch (e) {
      todos = [];
    }
  }

  // Sum estimated hours with priority weighting
  let allocatedHours = 0;
  for (const todo of todos) {
    let hours = parseFloat(todo.estimatedHours) || 0;
    
    if (hours > 0) {
      // Apply priority weighting
      const priority = (todo.priority || '').toLowerCase();
      if (priority === 'low' || priority === 'none' || !priority) {
        hours *= 0.5;  // Low/None priority = 50%
      } else if (priority === 'medium') {
        hours *= 0.75; // Medium priority = 75%
      }
      // Urgent/High = 100% (no multiplier)
    }
    
    allocatedHours += hours;
  }

  // Round to 1 decimal
  allocatedHours = Math.round(allocatedHours * 10) / 10;
  const availableHours = Math.round((MAX_CAPACITY - allocatedHours) * 10) / 10;
  const percentUsed = Math.round((allocatedHours / MAX_CAPACITY) * 100);

  workloadSummary.push({
    name: member.name,
    role: member.role,
    userId: member.userId,
    projectId: member.projectId,
    newTasksListId: member.newTasksListId,
    skills: member.skills,
    allocatedHours,
    availableHours: Math.max(0, availableHours),
    percentUsed: Math.min(100, percentUsed),
    todoCount: todos.length,
    capacityStatus: percentUsed >= 80 ? 'high' : percentUsed >= 60 ? 'medium' : 'low'
  });
}

return [{
  json: {
    workloadSummary
  }
}];
