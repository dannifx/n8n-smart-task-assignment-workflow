// ============================================================
// WORKFLOW 4 — Code Node: Calculate Workload for Capacity Check
//
// Processes MCP get_todos results and calculates team capacity
// with active list filtering and due date logic.
//
// INPUT: Loop output with MCP get_todos data per member
// OUTPUT: workloadSummary with channelId/threadTs for Slack
// ============================================================

const TEAM_CONFIG = {
  12804013:    { name: "Giancarlo",  role: "Lead Full-Stack Developer",  projectId: 15004754, newTasksListId: 30886797,  skills: ["Full-stack development (Expert)", "Trello integrations (Expert)", "Form handling (Expert)"] },
  1226193945:  { name: "Sid",        role: "Front-End Developer",        projectId: 15004756, newTasksListId: 333488395, skills: ["Front-end development (Expert)", "ACF development (Advanced)", "Calculators (Advanced)"] },
  1226175529:  { name: "Erron",      role: "Full-Stack Developer",       projectId: 15004755, newTasksListId: 333422938, skills: ["Full-stack development (Advanced)", "Tools development (Expert)", "Interactive components (Expert)"] },
  1225938597:  { name: "Edmund",     role: "Backend Developer",          projectId: 15004757, newTasksListId: 32018114,  skills: ["Backend development (Expert)", "Tools development (Expert)", "Complex components (Expert)"] },
  1226066097:  { name: "Jesslyn",    role: "Lead Graphic, Web & Product Designer", projectId: 15004752, newTasksListId: 333400073, skills: ["UX design (Expert)", "Tools design (Expert)", "Branding (Expert)"] },
  1226189703:  { name: "Elika",      role: "Web & Graphic Designer",     projectId: 15004758, newTasksListId: 333466163, skills: ["Illustration (Expert)", "Social assets (Expert)", "Unique graphics (Expert)", "Web Design (Expert)", "Branding (Expert)"] }
};

const ACTIVE_LISTS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'next week',
  'this week',
  'new task',
  'larger project',
  'cycle project'
];

const DAILY_LISTS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const HOURS_PER_2_WEEKS = 80;
const twoWeeksOut = new Date();
twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);

const items = $input.all();
const teamArray = $('Build Team Array').all();
const workloadSummary = [];

for (let i = 0; i < items.length; i++) {
  const mcpData = items[i].json;
  const member = teamArray[i]?.json || {};
  const allTodos = mcpData.content?.[0]?.text?.todos || [];

  const config = TEAM_CONFIG[member.userId] || {};
  const name = config.name || member.name || 'Unknown';

  // Filter to active tasks only
  const activeTodos = allTodos.filter(todo => {
    const listName = (todo.todolist?.name || '').toLowerCase();
    const isActiveList = ACTIVE_LISTS.some(active => listName.includes(active));
    const isRealTask = todo.responsibleUser !== null;

    if (!isActiveList || !isRealTask) return false;

    // Daily lists always count regardless of due date
    const isDailyList = DAILY_LISTS.some(day => listName.includes(day));
    if (isDailyList) return true;

    // Non-daily lists: only count if due within 2 weeks
    if (todo.dueDate) {
      const due = new Date(todo.dueDate);
      return due <= twoWeeksOut;
    }

    // No due date on non-daily list = exclude
    return false;
  });

  let totalHours = 0;
  let tasksWithNoEstimate = 0;

  for (const todo of activeTodos) {
    if (todo.estimatedHours && todo.estimatedHours > 0) {
      let hours = todo.estimatedHours;
      
      // Apply priority weighting
      const priority = (todo.priority || '').toLowerCase();
      if (priority === 'low' || priority === 'none' || !priority) {
        hours *= 0.5;  // Low/None priority = 50%
      } else if (priority === 'medium') {
        hours *= 0.75; // Medium priority = 75%
      }
      // Urgent/High = 100% (no multiplier)
      
      totalHours += hours;
    } else {
      tasksWithNoEstimate++;
    }
  }

  const available = Math.max(0, HOURS_PER_2_WEEKS - totalHours);
  const percentUsed = Math.round((totalHours / HOURS_PER_2_WEEKS) * 100);

  workloadSummary.push({
    name,
    role: config.role,
    userId: member.userId,
    projectId: config.projectId,
    newTasksListId: config.newTasksListId,
    skills: config.skills || [],
    allocatedHours: totalHours,
    availableHours: available,
    percentUsed,
    todoCount: activeTodos.length,
    tasksWithNoEstimate,
    capacityStatus: percentUsed >= 80 ? 'high' : percentUsed >= 60 ? 'medium' : 'low'
  });
}

// Get channelId/threadTs from Build Team Array node
const teamArrayData = $('Build Team Array').first().json;

return [{
  json: {
    workloadSummary,
    channelId: teamArrayData.channelId,
    threadTs: teamArrayData.threadTs
  }
}];
