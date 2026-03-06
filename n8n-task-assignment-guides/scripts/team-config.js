// ============================================================
// TEAM CONFIGURATION
// Used by multiple Code nodes across workflows.
// If a team member changes, update this one file and paste
// the updated version into each Code node that uses it.
//
// NOTE: userId values are NUMBERS because the MCP server
// (TeamworkFX) validates types strictly — it rejects string
// userIds. projectId and newTasksListId are also numbers for
// consistency with MCP calls (move_todo, assign_todo, etc.).
// ============================================================

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
      "ACF (Advanced Custom Fields) development (Advanced)",
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
      "Can style without designers most of the time",
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

// Standard capacity constants
const HOURS_PER_WEEK = 40;
const WORKLOAD_PERIOD_WEEKS = 2;
const MAX_CAPACITY_HOURS = HOURS_PER_WEEK * WORKLOAD_PERIOD_WEEKS; // 80

// TWFX base URL for building links
const TWFX_BASE_URL = "https://app.webfx.com";
