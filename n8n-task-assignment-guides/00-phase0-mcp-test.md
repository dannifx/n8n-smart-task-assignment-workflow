# Phase 0: Test MCP Connection

**Goal:** Verify that n8n can communicate with TeamworkFX through the MCP server before building any workflows.

**Time:** ~5 minutes

---

## Step 1: Create Header Auth Credential

1. In n8n, go to **Credentials** → **Add Credential**
2. Search for **Header Auth**
3. Configure:
   - **Name:** `TeamworkFX MCP`
   - **Header Name:** `x-twfx-api-key`
   - **Header Value:** `185d6fa9-b3b3-4dfe-9851-9ab664761c0e`
4. Save

---

## Step 2: Create Test Workflow

1. Create a new workflow called "Test - MCP Connection"
2. Add a **Manual Trigger** node (this is the default starting node)

---

## Step 3: Add MCP Client Node

1. Click **+** after the Manual Trigger
2. Search for **MCP Client** (NOT "MCP Client Tool" — that one is for AI agents)
3. Configure:
   - **Server URL:** `https://teamworkfx-mcp.com/mcp`
   - **Authentication:** Header Auth → select your `TeamworkFX MCP` credential
   - **Tool:** `get_todos`
   - **Input Mode:** JSON
   - **JSON Parameters:**

```json
{
  "responsibleUserId": 12804013,
  "includeCompleted": false,
  "dueDateBefore": "2026-03-01",
  "fields": ["description", "estimatedHours", "dueDate", "status", "responsibleUser", "todolist"],
  "limit": 5
}
```

> **Note:** `responsibleUserId` must be a **number** (no quotes). `fields` must be a **JSON array** of strings, not a comma-separated string. The MCP server validates these types strictly.

This queries Giancarlo's active todos due before March 1, 2026.

---

## Step 4: Run the Test

1. Click **Test Workflow** (or click the Manual Trigger node and hit "Execute Node")
2. Check the MCP Client node output

### If Successful:
You should see JSON data with todo items — titles, descriptions, estimated hours, due dates, etc. This confirms:
- The API key works
- The MCP server is reachable from n8n
- The `x-twfx-api-key` header auth is correct

**Proceed to Phase 1.**

### If It Fails:
Common issues:
- **"Connection refused" or timeout:** The MCP transport might not be compatible. Try changing the connection type if n8n offers SSE vs HTTP Streamable options.
- **401/403 error:** The API key might be invalid. Generate a new one at `app.webfx.com/my-info/api-keys`.
- **"Tool not found":** Double-check the tool name is exactly `get_todos` (not `getTodos`).

### Fallback Test — Raw HTTP with MCP Header

If the MCP Client node doesn't work, test whether the `x-twfx-api-key` header works with a regular HTTP Request node:

1. Add an **HTTP Request** node
2. Configure:
   - **Method:** GET
   - **URL:** `https://app.webfx.com/projects/15004754/tasklists.json`
   - **Authentication:** None (we'll add the header manually)
   - **Headers:** Add header `x-twfx-api-key` = `185d6fa9-b3b3-4dfe-9851-9ab664761c0e`
3. Run it

If this returns JSON instead of HTML, the raw API works with the MCP-style header. We can build workflows using HTTP Request nodes with this header instead of the MCP Client node.

---

## What We Just Validated

- n8n can authenticate with TeamworkFX
- We can query team member workloads
- The data format includes the fields we need (estimatedHours, dueDate, status)

### Actual Response Structure

The MCP response is nested inside `content[0].text`. The key fields per todo are:

| Field | Path | Notes |
|---|---|---|
| Task title | `content` | Not `title` or `name` |
| Task ID | `todoId` | Number, not string |
| Description | `description` | Can be `null` |
| Due date | `dueDate` | `"YYYY-MM-DD"` string |
| Estimated hours | `estimatedHours` | Number or `null` |
| Status | `status` | May return `null` |
| Tasklist name | `todolist.name` | e.g. `"🗓️ Friday To-do List"` |
| Responsible user | `responsibleUser.userId` / `.firstName` / `.lastName` | |

This nesting matters in later workflows — Code nodes will need to parse through `content[0].text.todos` to reach the actual todo array.
