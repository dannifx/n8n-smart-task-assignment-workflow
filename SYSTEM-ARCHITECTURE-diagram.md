# System Architecture — Smart Task Assignment Workflow

**Visual guide to how all the pieces fit together**

---

## High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER CREATES TASK                       │
│                  (in Project Management System)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                        [WEBHOOK]
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       WORKFLOW 1: NOTIFY                        │
│                                                                 │
│  1. Receive webhook                                             │
│  2. Filter (new task or moved into list?)                       │
│  3. Extract key fields                                          │
│  4. Build Slack message with buttons                            │
│  5. Post to #interactive-task-assignment                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    [SLACK NOTIFICATION]
                     📥 New Task Alert
                   [Analyze & Recommend]
                   [Open Task in TWFX]
                             │
            ┌────────────────┴────────────────┐
            │                                 │
            ▼                                 ▼
     [User clicks                      [User clicks
      "Analyze"]                        "Open Task"]
            │                                 │
            ▼                                 ▼
┌──────────────────────────┐         (Opens PM system
│  WORKFLOW 2: AI ANALYSIS │          in browser)
│                          │
│  1. Parse button click   │
│  2. Get task details     │
│  3. Query each member's  │
│     workload             │
│  4. Calculate capacity   │
│  5. Build AI prompt      │
│  6. Call GPT-4o          │
│  7. Parse recommendation │
│  8. Post thread reply    │
│     with assignee button │
└──────────┬───────────────┘
           │
           ▼
    [THREAD REPLY]
    🤖 Recommendation:
    Assign to Erron
    [Auto-Assign to Erron]
           │
           ▼
    [User clicks
     "Auto-Assign"]
           │
           ▼
┌──────────────────────────┐
│ WORKFLOW 3: AUTO-ASSIGN  │
│                          │
│  1. Parse button click   │
│  2. Move task to         │
│     member's project     │
│  3. Assign task to user  │
│  4. Post confirmation    │
└──────────────────────────┘
           │
           ▼
    [CONFIRMATION]
    ✅ Task assigned
    to Erron


┌──────────────────────────────────────────────────────────────┐
│              WORKFLOW 4: INTERACTIVE BOT                     │
│                    (Parallel, @mention triggered)            │
│                                                              │
│  User: "@bot team capacity"                                  │
│    → Query all workloads                                     │
│    → Format capacity report                                  │
│    → Post in thread                                          │
│                                                              │
│  User: "@bot [task URL]"                                     │
│    → Extract task ID                                         │
│    → Run AI analysis (same as Workflow 2)                    │
│    → Post recommendation                                     │
│                                                              │
│  User: "@bot assign to Giancarlo" (in thread)                │
│    → Parse name                                              │
│    → Fetch thread context                                    │
│    → Move + assign task                                      │
│    → Post confirmation                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Workload Calculation

```
┌──────────────────────────────────────────────────────────────┐
│                    FOR EACH TEAM MEMBER                      │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
        [Query PM System API/MCP]
        "Get all tasks for [Member]"
                   │
                   ▼
        ┌──────────────────┐
        │  ALL TASKS FOR   │
        │  THIS MEMBER     │
        │  (100-500 tasks) │
        └────────┬─────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   FILTER BY ACTIVE LISTS               │
        │   (exclude Done, Backlog, Archive)     │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   FILTER BY DUE DATE                   │
        │   Daily lists: always include          │
        │   Other lists: only if due ≤ 2 weeks   │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   FILTER OUT HEADERS/DIVIDERS          │
        │   (tasks with no assignee = headers)   │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   APPLY PRIORITY WEIGHTING             │
        │   High/Urgent: 1.0x                    │
        │   Medium: 0.75x                        │
        │   Low/None: 0.5x                       │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   SUM WEIGHTED HOURS                   │
        │   Total Hours Used = Σ(estimate × wt)  │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   CALCULATE AVAILABILITY               │
        │   Available = 80h - Total Used         │
        │   Utilization = Total Used / 80h       │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   MEMBER CAPACITY OBJECT               │
        │   {                                    │
        │     name: "Erron",                     │
        │     totalHours: 46,                    │
        │     availableHours: 34,                │
        │     utilizationPct: 0.43,              │
        │     taskCount: 12                      │
        │   }                                    │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        [REPEAT FOR ALL 6 MEMBERS]
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   TEAM CAPACITY ARRAY                  │
        │   [member1, member2, ..., member6]     │
        └────────┬───────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │   SEND TO AI FOR ANALYSIS              │
        │   (along with task details + skills)   │
        └────────────────────────────────────────┘
```

---

## Workflow Trigger Types

```
┌──────────────────────────────────────────────────────────────┐
│                       TRIGGER TYPES                          │
└──────────────────────────────────────────────────────────────┘

┌────────────────────┐
│  WORKFLOW 1        │  Triggered by: PM System Webhook
│  (Notification)    │  When: Task created or moved into target list
└────────────────────┘  Frequency: Real-time (as tasks arrive)

┌────────────────────┐
│  WORKFLOW 2        │  Triggered by: Slack Interactivity Webhook
│  (AI Analysis)     │  When: User clicks "Analyze & Recommend" button
└────────────────────┘  Frequency: On-demand (user initiated)

┌────────────────────┐
│  WORKFLOW 3        │  Triggered by: Slack Interactivity Webhook
│  (Auto-Assign)     │  When: User clicks "Auto-Assign to [Name]" button
└────────────────────┘  Frequency: On-demand (user initiated)
                        Note: Same webhook as Workflow 2, routed by action_id

┌────────────────────┐
│  WORKFLOW 4        │  Triggered by: Slack Events Webhook
│  (Interactive Bot) │  When: User @mentions bot in Slack
└────────────────────┘  Frequency: On-demand (user initiated)
```

---

## External Integrations

```
┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  PROJECT MGMT SYS   │  Purpose: Task data source
│  (TeamworkFX/Asana) │  Connection: MCP Server or REST API
│                     │  Authentication: API Key or OAuth
│                     │  Usage: 
│                     │   - Receive task webhooks
│                     │   - Query task details
│                     │   - Query workload per member
│                     │   - Move tasks between lists
│                     │   - Assign tasks to users
└─────────────────────┘

┌─────────────────────┐
│  SLACK API          │  Purpose: Notifications & interactions
│                     │  Connection: Bot Token + Webhooks
│                     │  Authentication: OAuth (Bot token)
│                     │  Usage:
│                     │   - Post new task notifications
│                     │   - Receive button clicks
│                     │   - Receive @mentions
│                     │   - Post thread replies
│                     │   - Update messages
└─────────────────────┘

┌─────────────────────┐
│  OPENAI API         │  Purpose: AI assignment analysis
│  (GPT-4o)           │  Connection: HTTPS API
│                     │  Authentication: API Key
│                     │  Usage:
│                     │   - Analyze task + workload data
│                     │   - Generate assignment recommendation
│                     │   - Provide reasoning
└─────────────────────┘

┌─────────────────────┐
│  n8n PLATFORM       │  Purpose: Workflow orchestration
│                     │  Deployment: Cloud or self-hosted
│                     │  Features Used:
│                     │   - Webhook triggers
│                     │   - HTTP requests
│                     │   - Code nodes (JavaScript)
│                     │   - Loops (for processing team members)
│                     │   - Conditional routing (IF nodes)
└─────────────────────┘
```

---

## Data Structures

### Task Object (from PM System)
```javascript
{
  todoId: 123456,
  content: "Build ROI calculator for HVAC",
  description: "Interactive tool with...",
  projectId: 15004754,
  todolistId: 789012,
  todolist: {
    name: "📥 New Interactive Requests"
  },
  project: {
    name: "🏡 Interactivities Central Hub"
  },
  dueDate: "2026-03-15",
  estimatedHours: 8,
  priority: "high",
  responsibleUser: null,  // unassigned
  creator: {
    userId: 456,
    firstName: "Danelle",
    lastName: "Wright"
  },
  customFields: {
    "41": { value: "Development" },  // Channel
    "3": { value: "high" }           // Priority (may also be in .priority)
  }
}
```

### Team Member Object (in Code nodes)
```javascript
{
  name: "Erron",
  role: "Full-Stack Developer",
  skills: [
    { skill: "JavaScript", level: "Expert" },
    { skill: "React", level: "Expert" },
    { skill: "Tools Development", level: "Expert" },
    { skill: "CSS/Styling", level: "Advanced" }
  ],
  userId: 67890,
  projectId: 15004800,
  newTasksListId: 1234567
}
```

### Workload Object (calculated)
```javascript
{
  name: "Erron",
  role: "Full-Stack Developer",
  totalHours: 46,
  availableHours: 34,
  utilizationPct: 0.43,
  taskCount: 12,
  tasks: [
    {
      title: "Landing page for client X",
      estimatedHours: 8,
      priority: "high",
      dueDate: "2026-03-10",
      weightedHours: 8  // high priority = 1.0x
    },
    {
      title: "Minor CSS tweaks",
      estimatedHours: 2,
      priority: "low",
      dueDate: "2026-03-12",
      weightedHours: 1  // low priority = 0.5x
    }
    // ... 10 more tasks
  ]
}
```

### AI Recommendation Object (parsed response)
```javascript
{
  assignee: "Erron",
  reasoning: "Erron is the best fit because he has expertise in tools development...",
  capacityBreakdown: "Giancarlo: 44h available (45% utilized)\nSid: 28h...",
  timeline: "Should be completable within 2 weeks given 8h estimate",
  rawResponse: "SUGGESTED ASSIGNEE: Erron\n\nReasoning:\nErron is the best..."
}
```

---

## Node Type Reference (n8n)

**Webhook** — Receives HTTP POST requests
- Used for: PM system webhooks, Slack interactivity, Slack events

**Code** — Execute custom JavaScript
- Used for: Parse payloads, filter data, calculate workload, build messages, format data

**Set** — Extract and normalize fields
- Used for: Pull specific fields from webhook payload, rename fields

**HTTP Request** — Call external APIs
- Used for: Slack API calls, PM system REST API (if not using MCP)

**MCP Client** — Call MCP server tools
- Used for: Query tasks, move tasks, assign tasks (TeamworkFX MCP)

**OpenAI** — Call OpenAI models
- Used for: GPT-4o analysis for task assignment recommendations

**Slack** — Built-in Slack operations
- Used for: Post messages (alternative to HTTP Request)

**Loop Over Items** — Process array items one by one
- Used for: Query workload for each team member sequentially

**IF** — Conditional routing
- Used for: Route by action_id (analyze vs auto-assign), route by request type (URL vs assign vs capacity)

---

## Security & Credentials

```
┌──────────────────────────────────────────────────────────────┐
│                    CREDENTIALS STORED IN n8n                 │
└──────────────────────────────────────────────────────────────┘

1. PM System (TeamworkFX MCP)
   Type: Header Auth
   Header: x-twfx-api-key
   Value: [Your API Key]
   Used in: MCP Client nodes

2. Slack
   Type: OAuth (Bot Token)
   Token: YOUR_SLACK_BOT_TOKEN
   Used in: Slack nodes, HTTP Request nodes calling Slack API

3. OpenAI
   Type: API Key
   Key: YOUR_OPENAI_API_KEY
   Used in: OpenAI nodes

SECURITY NOTES:
- Store credentials in n8n's credential manager (encrypted at rest)
- Never hardcode credentials in Code nodes
- Use environment variables for self-hosted n8n
- Rotate API keys periodically
- Limit Slack bot scopes to minimum required
- Use separate Slack app per environment (dev/prod)
```

---

## Customization Points

**Easy to customize (no code changes):**
- Slack channel name
- PM system project/list names
- Due date time window (2 weeks → 1 week, etc.)
- Capacity per person (80h → 40h for part-time, etc.)

**Medium difficulty (edit Code nodes):**
- Team members (add/remove from array)
- Skills matrix (update member skills)
- Priority weighting multipliers
- Active list names (whitelist)
- AI prompt instructions

**Advanced (modify workflow structure):**
- Add new data sources (Google Sheets, Database)
- Change notification platform (Slack → Teams)
- Add new bot commands
- Implement auto-assignment without human approval
- Add assignment tracking to database

---

## Performance Characteristics

**Workflow 1 (Notification):**
- Execution time: < 1 second
- Triggered: Every new task (real-time)
- API calls: 1 (Slack post message)

**Workflow 2 (AI Analysis):**
- Execution time: 8-15 seconds
- Triggered: On-demand (user button click)
- API calls: 1 (get task) + 6 (get todos per member) + 1 (GPT-4o) + 1 (Slack reply) = 9 total

**Workflow 3 (Auto-Assign):**
- Execution time: 2-3 seconds
- Triggered: On-demand (user button click)
- API calls: 2 (move task, assign task) + 1 (Slack confirmation) = 3 total

**Workflow 4 (Interactive Bot):**
- Capacity command: 6-10 seconds (6 workload queries + 1 Slack reply)
- Task analysis: Same as Workflow 2 (8-15 seconds)
- Assignment override: 3-5 seconds (fetch thread + move + assign + reply)

**Scalability:**
- Handles 10-20 tasks per day easily
- Loop performance: 6 team members × ~0.5s per query = 3s for full team workload
- For teams >10 people, consider parallel workload queries (n8n limits apply)

---

## Failure Modes & Recovery

**PM System API Down:**
- Webhook won't fire → tasks won't notify
- Workload queries fail → AI can't analyze
- Recovery: Manual assignment in PM system, retry when API recovers

**Slack API Down:**
- Notifications fail to post
- Button clicks not received
- Recovery: Check PM system directly, wait for Slack recovery

**OpenAI API Down:**
- AI analysis fails
- Recovery: Fallback to manual assignment, use capacity command for data, retry later

**n8n Down (self-hosted):**
- All workflows stop
- Webhooks return errors to PM system
- Recovery: Restart n8n, PM system may retry webhooks (check settings)

**Invalid Data:**
- Missing task fields → Slack message shows "Not set" or defaults
- Missing team member info → Excluded from AI consideration
- Recovery: Fix data in PM system, re-trigger analysis

---

**End of Architecture Diagram**

For implementation details, see the workflow guides in `n8n-task-assignment-guides/`.
