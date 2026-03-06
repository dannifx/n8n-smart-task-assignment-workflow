# Smart Task Assignment Assistant — n8n Build Guide

## What's in This Folder

Step-by-step instructions for building 4 n8n workflows. Each guide tells you exactly which nodes to add, how to configure them, and includes copy-paste JavaScript for all Code nodes.

## Build Order

| # | Guide File | What It Does | Time Estimate |
|---|-----------|--------------|---------------|
| 0 | `00-phase0-mcp-test.md` | Test that n8n can talk to TeamworkFX via MCP | 5 min |
| 1 | `01-workflow1-new-task-notification.md` | Post Slack notification when a new task is created | 20 min |
| 2 | `02-workflow2-ai-analysis.md` | Fetch workload, run AI analysis, reply in Slack thread | 45 min |
| 3 | `03-workflow3-auto-assignment.md` | Move + assign task in TWFX when button is clicked | 20 min |
| 4 | `04-workflow4-interactive-bot.md` | Respond to @mentions with task analysis | 20 min |

## Scripts Folder

The `scripts/` folder contains standalone JavaScript files for every Code node. These are the same scripts that appear inline in the guides — use whichever is easier to copy from.

## Prerequisites

Before starting, configure these 3 credentials in n8n:

### 1. TeamworkFX MCP (Header Auth)
- Go to **Credentials** → **Add Credential** → **Header Auth**
- Name: `TeamworkFX MCP`
- Header Name: `x-twfx-api-key`
- Header Value: `185d6fa9-b3b3-4dfe-9851-9ab664761c0e`

### 2. Slack (Bot Token)
- Go to **Credentials** → **Add Credential** → **Slack API**
- Bot Token: `xoxb-YOUR-SLACK-BOT-TOKEN`
- Required scopes: `chat:write`, `chat:write.customize`, `reactions:write`, `channels:read`, `app_mentions:read`

### 3. OpenAI (API Key)
- Go to **Credentials** → **Add Credential** → **OpenAI**
- Use your existing OpenAI API key

## Important: Update These Guides As You Build

These guides were written before the workflows were built. Some assumptions turned out to be wrong. As you build each workflow and test each node, **update the guide files and scripts with what you learn**.

Corrections already applied during the initial build:
- MCP server requires `responsibleUserId` as a **number** (not string) and `fields` as a **JSON array** (not comma-separated string). All guides and scripts have been updated.
- MCP response data is nested inside `content[0].text.todos`. The `calculate-workload.js` script has been updated to check this path first.
- TWFX webhook payloads nest task data inside `body.event.result` (not `todo` or `todolist` at the top level). See the Webhook Payload Structure section below.
- Task title is in the `content` field (not `title` or `name`) in both MCP responses and webhooks.
- The tasklist name has an emoji prefix (`📥 New Interactive Requests`), so the IF node uses "Contains" not "Equals".
- IDs parsed from Slack button values are strings and must be converted to numbers with `Number()` before passing to MCP calls.
- **Duplicate processing prevention (Feb 2026):** The TWFX webhook fires on both `create` and `update` events (needed to catch tasks moved into the list). A "Filter: New Arrivals Only" Code node was added to Workflow 1 (Node 2) to compare `event.original.todolist.name` vs `event.result.todolist.name` — only tasks that are newly created in or just moved into the target list are processed. See `scripts/filter-new-arrivals.js` and the updated Workflow 1 guide.

### AI Assistant Instructions

If you are an AI assistant continuing this build in a new chat session:
1. Read all the guide files and scripts in this folder first — they contain corrected field paths and parameter types
2. Ask the user where they left off (which workflow and node)
3. Continue building node by node, testing as you go
4. When you discover something that differs from the guide, update the relevant `.md` and `.js` files immediately
5. The TWFX webhook payload structure is documented below — reference it for Workflow 1 field paths

### TWFX Webhook Payload Structure (Confirmed)

The webhook sends a POST with this structure:
```
$json.body.event.action        → "update" or "create"
$json.body.event.result        → the current task state (use this one)
$json.body.event.original      → the previous task state (before changes)
$json.body.event.user          → the user who triggered the event
$json.body.timestamp           → ISO timestamp
```

Key fields from `body.event.result`:
```
todoId              → task ID (number)
content             → task title (string)
description         → task description (string, may be empty "")
dueDate             → "YYYY-MM-DD" or null
estimatedHours      → number or null
priority            → "high", "normal", "low", or null
projectId           → project ID (number)
todolistId          → tasklist ID (number)
todolist.name       → "📥 New Interactive Requests"
project.name        → "🏡 Interactivities Central Hub"
responsibleUser     → { userId, firstName, lastName, ... }
customFields.41.value → Channel type ("Development", "Design", etc.)
```

### Build Progress

> **For detailed session-by-session progress, see `project-progress.md`.**

- [x] Phase 0: MCP Connection Test — working
- [x] Workflow 1: New Task Notification — working, posted to #interactive-task-assignment
- [ ] Workflow 1 Amendment: Add "Filter: New Arrivals Only" Code node (Node 2) — documented, needs to be applied in n8n
- [ ] Workflow 2: AI Analysis
- [ ] Workflow 3: Auto-Assignment (part of Workflow 2 canvas)
- [ ] Workflow 4: Interactive Bot

### n8n URLs

- Workflow 1 Webhook Test URL: `https://webfx.app.n8n.cloud/webhook-test/ca444580-e321-48ad-932a-5c00e79e7997`
- Workflow 1 Webhook Production URL: `https://webfx.app.n8n.cloud/webhook/ca444580-e321-48ad-932a-5c00e79e7997`

---

## Slack App Configuration

In your Slack app settings (api.slack.com):

1. **Interactivity & Shortcuts** → Enable → Set Request URL to your Workflow 2 webhook URL (you'll get this when building Workflow 2)
2. **Event Subscriptions** → Enable → Subscribe to `app_mention` bot event (needed for Workflow 4)
3. **OAuth & Permissions** → Ensure all required scopes are added
