# Project Progress — Smart Task Assignment Workflow

> **Purpose:** This file tracks build progress session by session. Read this file at the start of each new chat session to pick up where we left off.

---

## AI Guidance Rules

**READ THIS FIRST if you are an AI assistant continuing this build:**

1. **One node at a time.** Guide the user through each workflow node by node. Give instructions for ONE node, then STOP and wait for the user to say they're ready for the next one. Do NOT send all nodes and instructions at once.
2. **Debug together.** After each node, ask the user to test it and share what they see. If something doesn't match the guide, update the guide and scripts immediately with the corrected information.
3. **Update docs as you go.** When a field path, parameter type, or behavior differs from what the guide says, edit the `.md` and `.js` files right away so they stay accurate.
4. **Read this file first** every new session. It tells you exactly where we left off and what to do next.
5. **Update this file** at the end of each session (or when significant progress is made) with what was done and what's next.

---

## Current Status

| Workflow | Status | Notes |
|----------|--------|-------|
| Phase 0: MCP Connection Test | COMPLETE | Confirmed MCP connectivity and field paths |
| Workflow 1: New Task Notification | COMPLETE | Filter node added, IF removed, Slack message redesigned with Block Kit fields layout. Tested and working. |
| Workflow 2: AI Analysis | COMPLETE | All 13 nodes built and tested. Recommends assignees based on role + workload. Posts thread reply in Slack. |
| Workflow 3: Auto-Assignment | COMPLETE | 5 nodes on Workflow 2 False branch. Moves task, assigns user, posts confirmation. |
| Workflow 4: Interactive Bot | COMPLETE | @mention bot in Slack triggers AI analysis. Separate workflow with Slack Events webhook. |
| Workflow 4 Enhancement: Capacity Command | COMPLETE | `@bot team capacity` shows formatted team workload overview. Built and tested. |

---

## Session Log

### Session 1 — Feb 17, 2026

**What we did:**
- Reviewed all guide files, scripts, and project architecture
- Identified the duplicate-processing problem: the TWFX webhook fires on both `create` and `update` events, meaning every edit to a task in the "New Interactive Requests" list was triggering a notification — not just new arrivals
- Designed a stateless deduplication solution using the webhook's own `event.result` vs `event.original` payload fields
- Created `scripts/filter-new-arrivals.js` — the Code node script for the filter
- Updated `01-workflow1-new-task-notification.md` to include the new filter node (Node 2)
- Updated `00-overview.md` with the new correction and requirement
- Updated `02-workflow2-ai-analysis.md` — no changes needed (Workflow 2 is triggered by Slack button clicks, not the TWFX webhook)
- Removed task description from the Slack notification message (keeps messages compact — just title, project, due date, and buttons). Updated both the guide and `scripts/build-notification-message.js`

**Deduplication Rule (important — applies to Workflow 1):**
The TWFX webhook must fire on both `create` and `update` to catch tasks moved into the list. The "Filter: New Arrivals Only" Code node (inserted as Node 2 in Workflow 1) compares `event.original.todolist.name` with `event.result.todolist.name` to detect:
1. Tasks CREATED in the target list → process
2. Tasks MOVED INTO the target list (tasklist changed from something else) → process
3. All other updates (edits to tasks already in the list) → skip (returns empty array)

**Where we left off (Session 1):**
- Workflow 1 amendment is documented but NOT YET APPLIED in n8n
- Two changes need to be made in the live n8n Workflow 1:
  1. Add the "Filter: New Arrivals Only" Code node between the Webhook and the IF node (new Node 2)
  2. Update Node 5 (Code: Build Slack Block Kit) to remove the task description from the Slack notification message (use the updated code from the guide or `scripts/build-notification-message.js`)

**Next steps (in order):**
1. **Amend Workflow 1** — IN PROGRESS:
   - ~~Add the filter Code node (Node 2)~~ Instructions given, user is applying in n8n
   - ~~Remove the IF node~~ Decided to remove (redundant)
   - Update Node 4 (Code: Build Slack Block Kit) to use updated notification code
   - Test the amended workflow
2. **Build Workflow 2: AI Analysis** — node by node, starting from `02-workflow2-ai-analysis.md`
3. **Build Workflow 3: Auto-Assignment** — on the Workflow 2 canvas
4. **Build Workflow 4: Interactive Bot** — after Workflow 2 is tested

### Session 2 — Feb 23, 2026

**What we're doing:**
- Amending Workflow 1 ("New Task Notification") — two changes:
  1. Adding the "Filter: New Arrivals Only" Code node (Node 2) between Webhook and Set
  2. Removing the IF node entirely (redundant — the Code node already checks target list + trigger reason)
  3. Updating Node 4 (Code: Build Slack Block Kit) to use the updated notification message (no task description)
- Workflow is now 5 nodes: Webhook → Filter Code → Set → Build Slack Code → Slack
- Updated `01-workflow1-new-task-notification.md` to reflect the IF removal and renumbered nodes

**Debugged double-trigger issue:**
- TWFX fires both a `create` and an `update` event when a task is created
- The original filter compared `original.todolist.name` vs `result.todolist.name`, but `original` only has flat fields (no nested `todolist` object), so `original.todolist?.name` was always undefined
- This made every `update` event look like a "moved in" event → two notifications per task
- Fix: compare `original.todolistId !== result.todolistId` instead (flat field available on both)

**Confirmed webhook payload field paths (from live test):**
- Task title: `body.event.result.content`
- Task ID: `body.event.result.todoId`
- Project ID: `body.event.result.projectId`
- Project name: `body.event.result.project.name` (has emoji: "🏡 Interactivities Central Hub")
- Due date: `body.event.result.dueDate` (format: YYYY-MM-DD)
- Tasklist name: `body.event.result.todolist.name` (has emoji: "📥 New Interactive Requests")
- Channel/task type: `body.event.result.customFields["41"].value` (Design, Development, CRO, etc.)
- Estimated hours: `body.event.result.estimatedHours` (null if not set)
- Priority: `body.event.result.priority` or `body.event.result.customFields["3"].value`

**Workflow 1 amendment complete:**
- Filter code fixed (compare `todolistId` instead of `todolist.name`) — tested, catches duplicate update events
- IF node removed (redundant) — workflow now 5 nodes
- Set node updated with confirmed field paths: taskId, projectId, taskTitle, channel, priority, dueDate, estimatedHours, pocName
- Slack notification redesigned with Block Kit: header, two-column fields, context block for POC, priority emojis, formatted dates
- POC uses `creator.firstName`/`lastName` (same as POC in most cases)
- All tested and working in production

**Workflow 2 build complete:**
- 13 nodes: Webhook → Parse Payload → IF Route → Build Updated Notification → Update Message → MCP Get Task → Build Team Array → Loop Members → MCP Get Todos → Calculate Workload → Build Prompt → AI Analysis (GPT-4o) → Parse AI Response → Build Analysis Message (also posts to Slack)
- MCP Get Todos uses `projectId` (not `responsibleUserId`) to capture all tasks in each member's project
- Workload whitelist: only tasks on Mon-Fri, Next Week, This Week, New Tasks, Larger/Cycle Projects lists are counted
- Header/divider items (responsibleUser === null) are filtered out
- `dueDateBefore` removed from MCP call — daily list tasks count regardless of due date
- AI response parsed into structured sections (assignee, reasoning, capacity, timeline)
- Thread reply with `reply_broadcast: true` shows in both thread and main channel
- Auto-Assign button encodes all IDs needed for Workflow 3

**Where we left off (Session 2):**
- Workflows 1 and 2 fully built, tested, and working in production
- Next session: Build Workflow 3 (Auto-Assignment) on the Workflow 2 canvas (False branch of the IF Route node)
- Then Workflow 4 (Interactive Bot)

**All 4 workflows complete!**

### Session 2 Final Summary — Feb 23-24, 2026
- All 4 workflows built, tested, and working in production
- Workflow 1: New Task Notification — 5 nodes. Slack message shows task name, channel, priority, due date, estimated hours, POC, and Brand (domain)
- Workflow 2: AI Analysis & Assignment — 13+ nodes. Skills matrix added to AI prompt. Analysis message shows task details, Brand, team capacity, and Auto-Assign button
- Workflow 3: Auto-Assignment — 6 nodes on Workflow 2 False branch (including "Is Auto-Assign?" IF guard). Confirmation shows task name, assignee, Brand
- Workflow 4: Interactive Bot — separate workflow with Slack Events webhook. @mention with task URL triggers full analysis. Brand field uses project name as fallback (MCP doesn't support custom fields)
- Workload calculation: queries by projectId, whitelist active lists, daily lists always count, 2-week due date cap on non-daily lists, filters out headers and no-due-date items on non-daily lists
- Priority weighting: Urgent/High = 100%, Medium = 75%, Low/None = 50% — reflects that low priority work can be rescheduled
- Skills matrix integrated into AI prompt: each team member's role, expertise, and skill levels inform the recommendation
- AI rules: Channel enforcement (Design tasks → designers only, Dev tasks → devs only), name mention favoring (if task description mentions a team member, favor them)
- Brand (domain) flows from Workflow 1 notification → encoded in Analyze button → parsed in Workflow 2 → passed through Calculate Workload → Build OpenAI Prompt → Parse AI Response → Build Analysis Message
- Added "Is Auto-Assign?" IF guard to prevent URL button clicks from triggering assignment
- Slack Events webhook verified with challenge/response handling
- TWFX todo URLs use format `https://app.webfx.com/todos/{taskId}` — no project ID needed

### Thread Assignment Override — Feb 27, 2026
- Added "Assign to {Name}" command to Workflow 4's @mention bot
- Handle Verification code detects three request types: task URL, assign command, or verification
- New IF routing: Valid Request? → Is Assign Command? → True = assignment branch, False = analysis branch
- Assignment branch: Fetch Thread (Slack API) → Parse Thread (extract task ID from Auto-Assign button) → Move Task (MCP) → Assign Task (MCP) → Post Confirmation
- Error handling: invalid names return list of valid team members, missing analysis returns helpful error
- POC field updated to use `pocUser` (available on move events) with `creator` fallback (create events)
- Discovered: TWFX move events don't include `customFields` — channel and domain show defaults for moved tasks. Pending MCP custom field support.

### Capacity Bot Command — Mar 3, 2026

**What we built:**
- New bot interaction: `@bot team capacity` → posts a formatted team workload overview
- Extends Workflow 4 with a "capacity" request type alongside existing task URL and assign command
- Uses MCP `get_todos` nodes (same pattern as Workflow 2) to query each team member's active tasks
- No AI/OpenAI needed — just MCP data + formatting

**New/updated files:**
- `scripts/parse-bot-mention.js` — updated to detect capacity keywords ("capacity", "workload", "who's available", "bandwidth", etc.) as a new `requestType: 'capacity'`
- `scripts/build-capacity-message.js` — new script. Builds Slack Block Kit message with:
  - Developers and Designers grouped separately
  - Per-member: status emoji (🟢🟡🔴), visual progress bar, utilization %, available hours, task count
  - Team summary: total available hours, who's at capacity, who's most available
- `04-workflow4-interactive-bot.md` — updated with capacity branch (Nodes 5a–5e), new IF routing, renumbered nodes
- `interactive-task-assignment-bot-guide.md` — new user-facing documentation for the #interactive-task-assignment channel and bot commands

**Workflow 4 updated routing:**
```
Webhook → Handle Verification → Valid Request?
  → Is Capacity Request?
    → True: Build Team Array → Loop MCP get_todos → Calculate Workload → Build Capacity Message → Post Slack
    → False: Is Assign Command?
      → True: assignment branch
      → False: Has Valid URL?
        → True: analysis branch
        → False: error reply with help menu
```

**Capacity branch nodes (5 new nodes on Workflow 4):**
1. Code: Build Team Array — outputs 6 items (one per member) with channelId/threadTs passthrough
2. Loop Members1 + Get Member Todos1 (MCP Client): get_todos per member (queries by projectId)
3. Code: Calculate Workload1 — runs in "Run Once for All Items" mode, gets channelId/threadTs from Build Team Array node
4. Code: Build Capacity Message — formats Slack Block Kit with progress bars, status emojis, team summary
5. HTTP Request: Post Capacity Reply — posts with `reply_broadcast: true` to show in main channel

**Error reply updated:** Unknown commands now show a help menu with all 3 available commands

**Fixes applied during build:**
- Updated parse-bot-mention.js to unwrap n8n webhook payload (`input.body || input`)
- Changed "Valid Request?" IF to check `requestType !== 'verification'` instead of old `hasValidUrl`/`hasAssignCommand` fields
- Set Calculate Workload1 to "Run Once for All Items" mode to allow `$input.all()`
- Fixed channelId/threadTs passthrough by pulling from Build Team Array node instead of loop output
- Updated Elika's role to "Web & Graphic Designer" and added "Web Design (Expert)" and "Branding (Expert)" to skills

**Status:** COMPLETE. Built and tested in n8n. Working in production.

**Post-build fixes (same session):**

**Fix 1: Workload calculation accuracy**
- Discovered capacity numbers didn't match Workflow 2's AI analysis
- Root cause: Workflow 4's Calculate Workload1 used simplified logic without active list filtering, due date filtering, or priority weighting
- Fixed by updating both Calculate Workload nodes in Workflow 4 to match Workflow 2's implementation
- Also added missing priority weighting to Workflow 2 (Urgent/High = 100%, Medium = 75%, Low/None = 50%)
- All three Calculate Workload nodes now use identical filtering logic:
  - Active list whitelist (Mon-Fri, Next Week, This Week, New Tasks, Larger/Cycle Projects)
  - Daily lists always count regardless of due date
  - Non-daily lists only count if due within 2 weeks
  - Headers/dividers filtered out (responsibleUser !== null)
  - Priority weighting applied to estimated hours
- Tested: Workflow 2 AI analysis and Workflow 4 capacity check now show identical numbers

**Fix 2: Unknown request handling**
- Bug: When bot received unknown messages (e.g., "@bot hello"), it would fail trying to analyze a non-existent task instead of showing the help menu
- Root cause: Missing "Is Task URL?" IF node between "Is Assign Command?" and task analysis branch
- Fixed by adding routing check: False branch from "Is Assign Command?" → "Is Task URL?" IF → False → "Post Error Reply"
- Error reply now uses Expression mode for Slack body to avoid JSON parsing errors
- Added `reply_broadcast: true` so help menu shows in main channel, not just thread
- Tested: Unknown messages now trigger help menu with all 3 available commands

---

## Future Enhancements

### Google Sheet Configuration (Next Session)
Move all hardcoded team and workflow configuration to a single shared Google Sheet that both Workflow 2 and Workflow 4 read from at runtime. This makes the system maintainable by non-technical team members.

**Sheet should include:**
- **Team Members tab:** Name, Role, Skills, userId, projectId, newTasksListId
- **Configuration tab:** Priority weights (Urgent=1.0, High=1.0, Medium=0.75, Low=0.5), active list names, capacity hours per 2-week period, daily list names
- Both workflows add a Google Sheets node early in the flow to fetch this data
- All Code nodes that currently hardcode team config, skills, priority weights, or list names will reference the sheet data instead

**Benefits:**
- Add/remove team members with a spreadsheet edit — no code changes
- Update skills as people grow — no workflow changes
- Adjust priority weights or capacity hours as the team evolves
- Single source of truth for the entire system

### Hours Remaining (Pending MCP Support)
The TWFX MCP doesn't currently return custom fields. "Hours Remaining" is a custom field that devs use to track progress on larger tasks. Until the MCP supports custom fields, devs should update the `estimatedHours` field directly to reflect remaining work. Once MCP custom field support is available, update the Calculate Workload code to check `hoursRemaining` first, falling back to `estimatedHours` if no value is set (null, not 0).

---

## Key Decisions & Learnings

| Decision | Rationale |
|----------|-----------|
| Stateless dedup using `original` vs `result` | No database or cache needed. Compare `todolistId` values (flat fields) to detect moves. The `original` object lacks nested objects like `todolist.name` |
| Webhook configured for create + update | Needed to catch tasks moved into the "New Interactive Requests" list, which fires an "update" event |
| Filter node returns `[]` to stop execution | n8n treats an empty array output as "no items to process," effectively filtering out unwanted webhook fires |
| Workload uses whitelist + projectId | MCP queries by `projectId` (not `responsibleUserId`) to get ALL tasks in a member's project. Only tasks on active lists (Mon-Fri, Next Week, This Week, New Tasks, Larger/Cycle Projects) are counted. Header/divider items filtered out via `responsibleUser !== null`. |
| OpenAI node path: `output[0].content[0].text` | The n8n OpenAI node nests the response text at this path, not `$json.text` or `$json.message.content` |
| Slack JSON body via expression | Using `JSON.stringify()` in a single expression avoids n8n's JSON parsing issues with mixed expressions in raw JSON body |
| TWFX todo URL format | `https://app.webfx.com/todos/{taskId}` — no project ID needed, URL doesn't change when task is moved |
| n8n Cloud: no `fetch` | Code nodes on n8n Cloud don't support `fetch()`. Use a separate HTTP Request node for API calls instead |
| Workload: daily lists always count | Tasks on Mon-Fri lists count regardless of due date. Other active lists only count if due within 2 weeks. No-due-date tasks on non-daily lists are excluded |
| Priority weighting | Urgent/High = 100%, Medium = 75%, Low/None = 50%. Prevents low-priority backlogs from inflating capacity numbers |
| Channel enforcement in AI | Design channel tasks → only designers (Jesslyn, Elika). All other channels → only developers (Giancarlo, Sid, Erron, Edmund) |
| Name mention favoring | If the task description mentions a team member by name, the AI strongly favors assigning to them for context continuity |
| IF node removed (Feb 23) | The Filter Code node already checks the target list name AND trigger reason, making the IF node fully redundant. Simplifies workflow from 6 to 5 nodes. |
| No description in Slack notification | Keeps messages compact. The notification shows task title, project, due date, and buttons only. Full description is available via the "Open Task in TWFX" link or fetched during AI analysis (Workflow 2) |

---

## n8n URLs

- Workflow 1 Webhook Test URL: `https://webfx.app.n8n.cloud/webhook-test/ca444580-e321-48ad-932a-5c00e79e7997`
- Workflow 1 Webhook Production URL: `https://webfx.app.n8n.cloud/webhook/ca444580-e321-48ad-932a-5c00e79e7997`
- Workflow 2 Webhook URL: `https://webfx.app.n8n.cloud/webhook/ai-analysis`
- Workflow 4 Webhook URL: `https://webfx.app.n8n.cloud/webhook/slack-events`

---

## Open Questions

- None currently. All 4 workflows complete with capacity command enhancement. Next session: Google Sheet configuration migration.
