# AI-Guided Setup Interview: Smart Task Assignment Workflow

**Purpose:** This file provides a structured interview process for an AI agent to guide someone through configuring the Smart Task Assignment Workflow for their own team. The AI should ask these questions, collect answers, and then use the responses to generate customized n8n workflow guides.

---

## How to Use This File (Instructions for AI Agent)

When a user wants to set up this workflow for their team:

1. **Read this entire file first** to understand the full scope of configuration needed
2. **Conduct the interview** section by section, asking questions conversationally (not as a rigid form)
3. **Validate responses** as you go (check that IDs are numbers, URLs are valid, etc.)
4. **Store the answers** in a structured format
5. **Generate customized guides** by taking the base workflow guides and replacing the hardcoded values with the user's configuration
6. **Guide the build** step-by-step in n8n, adapting instructions based on their specific setup

---

## Interview Structure

### Section 1: Project Management System

**Goal:** Understand what system they're using for task management and whether MCP integration exists.

**Questions to Ask:**

1. **What project management system does your team use?**
   - Examples: TeamworkFX, Asana, ClickUp, Monday.com, Jira, Trello, custom system
   - *Store as:* `system.name`

2. **Does this system have an MCP (Model Context Protocol) server available?**
   - If yes: What's the MCP server package name or repository?
   - If no: Does it have a REST API we can use instead?
   - *Store as:* `system.hasMCP` (boolean), `system.mcpPackage` or `system.apiDocs` (URL)

3. **What authentication does the system require?**
   - API key, OAuth token, username/password, etc.
   - Where do they obtain these credentials?
   - *Store as:* `system.authType`, `system.authInstructions`

4. **What's the structure of your project/task organization?**
   - Do you have Projects → Task Lists → Tasks? (like TeamworkFX)
   - Do you have Boards → Lists → Cards? (like Trello)
   - Do you have Spaces → Folders → Lists → Tasks? (like ClickUp)
   - *Store as:* `system.hierarchy` (array like ["Projects", "Task Lists", "Tasks"])

---

### Section 2: Workflow Trigger Configuration

**Goal:** Identify where new tasks come from and how to detect them.

**Questions to Ask:**

1. **Where do new tasks that need assignment arrive?**
   - Specific project name?
   - Specific list/board name?
   - Multiple locations?
   - *Store as:* `trigger.projectName`, `trigger.listName`, `trigger.multiple` (boolean)

2. **Does your system support webhooks?**
   - If yes: What events can trigger them? (task created, task updated, task moved, etc.)
   - If no: We'll need to use polling instead
   - *Store as:* `trigger.hasWebhooks`, `trigger.availableEvents` (array)

3. **For webhook configuration:**
   - Do webhooks include the full task data in the payload, or just an ID?
   - Can webhooks be filtered by project/list before sending?
   - *Store as:* `trigger.payloadType` ("full" or "id_only"), `trigger.canFilterAtSource`

4. **Do tasks get created directly in your target list, or moved there from elsewhere?**
   - This determines if we need to listen for both "create" and "update" events
   - *Store as:* `trigger.createdInPlace`, `trigger.movedIntoList`

---

### Section 3: Task Data Fields

**Goal:** Map the task fields they need for AI analysis.

**Questions to Ask:**

1. **What fields does a task in your system have?**
   - Common: Title, Description, Due Date, Assignee, Priority, Estimated Hours
   - Custom fields they use?
   - *Store as:* `task.availableFields` (array of objects with `fieldName`, `fieldType`, `fieldPath`)

2. **Which fields are essential for making assignment decisions?**
   - Examples: Task type (design vs dev), complexity, client name, skills required
   - *Store as:* `task.essentialFields` (array)

3. **How is task type/category identified?**
   - Custom field? Tag? Label? Part of the title?
   - What are the possible values? (e.g., "Design", "Development", "Marketing")
   - *Store as:* `task.categoryField`, `task.categoryValues` (array)

4. **How is priority indicated?**
   - High/Medium/Low? Urgent/Normal? Numbers 1-5?
   - *Store as:* `task.priorityField`, `task.priorityValues` (array or scale)

5. **How is estimated effort tracked?**
   - Estimated Hours field? Story points? Time tracking?
   - *Store as:* `task.effortField`, `task.effortUnit`

---

### Section 4: Team Configuration

**Goal:** Understand team structure and how to query workload.

**Questions to Ask:**

1. **How many team members need to be included in the assignment system?**
   - Names and roles?
   - *Store as:* `team.members` (array)

2. **For each team member, what do we need to know?**
   - Full name
   - Role/title
   - Skills and expertise areas
   - User ID in the project management system (for API calls)
   - Project ID or workspace ID where their tasks live
   - Any specific list/board where new assignments should go
   - *Store as:* `team.members[].name`, `team.members[].role`, `team.members[].skills`, `team.members[].userId`, `team.members[].projectId`, `team.members[].newTasksListId`

3. **How do you want to calculate workload?**
   - Time period: Next 7 days? Next 14 days? Current sprint?
   - Capacity per person: Hours per week? Story points per sprint?
   - *Store as:* `workload.timePeriod`, `workload.capacityPerPerson`, `workload.capacityUnit`

4. **Which tasks should count toward someone's workload?**
   - Only tasks with certain statuses? (e.g., "In Progress", "To Do")
   - Only tasks in certain lists/boards? (e.g., exclude "Backlog", "Done")
   - Only tasks due within the time period?
   - *Store as:* `workload.includeStatuses`, `workload.includeLists`, `workload.dueDateFilter`

5. **Should priority affect workload calculations?**
   - For example: High priority tasks count as 100% of estimate, Low priority as 50%
   - *Store as:* `workload.priorityWeighting` (object mapping priority to multiplier)

---

### Section 5: Team Skills & Expertise

**Goal:** Build a skills matrix for AI assignment decisions.

**Questions to Ask:**

1. **What skills are relevant for your team's work?**
   - Examples: JavaScript, React, Python, Graphic Design, Copywriting, SEO
   - *Store as:* `skills.availableSkills` (array)

2. **For each team member, what's their proficiency in each skill?**
   - Scale: None, Beginner, Intermediate, Advanced, Expert?
   - Or just list their top 3-5 skills?
   - *Store as:* `team.members[].skillLevels` (object mapping skill to level)

3. **Are there any hard rules about who can be assigned what?**
   - Example: "Only designers can be assigned design tasks"
   - Example: "Junior devs can't be assigned tasks over 20 hours"
   - *Store as:* `assignment.hardRules` (array of rule objects)

---

### Section 6: Slack Integration

**Goal:** Configure Slack for notifications and interactions.

**Questions to Ask:**

1. **Do you have a Slack workspace?**
   - If no: Would you like to use email, Microsoft Teams, Discord, or another platform instead?
   - *Store as:* `notification.platform` ("slack", "email", "teams", "discord", "other")

2. **For Slack users:**
   - Which channel should task notifications go to?
   - Channel name or ID?
   - *Store as:* `slack.notificationChannel`

3. **Do you have a Slack app already, or do we need to create one?**
   - If creating new: They'll need admin permissions in Slack
   - *Store as:* `slack.appExists`, `slack.appId` (if exists)

4. **What Slack features do you want?**
   - [ ] Button to trigger AI analysis
   - [ ] Button to auto-assign recommended person
   - [ ] @mention bot for ad-hoc queries
   - [ ] Thread-based assignment override ("@bot assign to John")
   - [ ] Team capacity command ("@bot team capacity")
   - *Store as:* `slack.features` (array)

---

### Section 7: AI Model Configuration

**Goal:** Determine which AI model to use and how to configure it.

**Questions to Ask:**

1. **Which AI provider do you want to use?**
   - OpenAI (GPT-4, GPT-4o)
   - Anthropic (Claude)
   - Google (Gemini)
   - Local model (Ollama, etc.)
   - *Store as:* `ai.provider`

2. **What model specifically?**
   - Example: "gpt-4o", "claude-3-5-sonnet-20241022", "gemini-1.5-pro"
   - *Store as:* `ai.model`

3. **Do you have an API key?**
   - If no: Guide them to get one
   - *Store as:* `ai.hasApiKey`

4. **What should the AI consider when making recommendations?**
   - Workload balance (spread work evenly)
   - Skill match (assign to most qualified person)
   - Availability (assign to person with most free time)
   - Context (assign to person already working on related tasks)
   - Priority weighting (how should they be ranked?)
   - *Store as:* `ai.considerations` (array with priority ranking)

---

### Section 8: Assignment Workflow Preferences

**Goal:** Understand how they want tasks to be assigned after AI recommendation.

**Questions to Ask:**

1. **After the AI recommends someone, what should happen?**
   - [ ] Just show the recommendation (manual assignment in PM system)
   - [ ] Show recommendation with a button to auto-assign
   - [ ] Automatically assign if confidence is high
   - *Store as:* `assignment.autoAssignMode` ("manual", "button", "auto_high_confidence")

2. **When a task is assigned, what actions should happen in your PM system?**
   - [ ] Assign the task to the person
   - [ ] Move the task to a specific list/board
   - [ ] Add a comment or note
   - [ ] Update a status field
   - [ ] Send a notification to the assignee
   - *Store as:* `assignment.actions` (array)

3. **Where should newly assigned tasks go?**
   - Same list? Different list per person? Specific board?
   - *Store as:* `assignment.destinationList`

---

### Section 9: Error Handling & Edge Cases

**Goal:** Plan for common edge cases.

**Questions to Ask:**

1. **What should happen if no one has capacity?**
   - Assign to person with least workload anyway?
   - Notify a manager?
   - Leave unassigned and alert the team?
   - *Store as:* `edgeCases.noCapacity`

2. **What if a task doesn't match anyone's skills?**
   - Assign to most available person?
   - Assign to a specific "generalist" team member?
   - Flag for manual review?
   - *Store as:* `edgeCases.noSkillMatch`

3. **What if required data is missing from a task?**
   - Skip the task and log an error?
   - Make a best guess?
   - Notify the task creator to add missing info?
   - *Store as:* `edgeCases.missingData`

4. **Should certain people be excluded from auto-assignment?**
   - Out of office, on vacation, managers, part-time contractors?
   - *Store as:* `team.members[].excludeFromAutoAssign` (boolean)

---

### Section 10: Testing & Validation

**Goal:** Set up test data and validation steps.

**Questions to Ask:**

1. **Do you have a test/sandbox environment?**
   - Separate project for testing?
   - Test Slack channel?
   - *Store as:* `testing.hasSandbox`, `testing.testProjectId`, `testing.testSlackChannel`

2. **Who should test this before going live?**
   - Just you? The whole team? A pilot group?
   - *Store as:* `testing.testUsers` (array)

3. **What's the rollout plan?**
   - Pilot with one project/team first?
   - Go live for everyone at once?
   - *Store as:* `rollout.plan`

---

## Post-Interview: Configuration Summary

After completing the interview, the AI should generate a configuration summary document like this:

```markdown
# Smart Task Assignment Workflow — Configuration Summary

**Team:** [Team Name]
**Created:** [Date]
**Configured by:** [User Name]

---

## System Configuration

- **Project Management System:** [system.name]
- **Integration Type:** [MCP / REST API]
- **Authentication:** [system.authType]

---

## Trigger Configuration

- **Source Project:** [trigger.projectName]
- **Source List:** [trigger.listName]
- **Trigger Method:** [Webhooks / Polling]
- **Events:** [trigger.availableEvents]

---

## Team Members

| Name | Role | Skills | User ID | Project ID | New Tasks List ID |
|------|------|--------|---------|------------|-------------------|
| [name] | [role] | [skills] | [userId] | [projectId] | [listId] |

---

## Workload Calculation

- **Time Period:** [workload.timePeriod]
- **Capacity per Person:** [workload.capacityPerPerson] [workload.capacityUnit]
- **Include Statuses:** [workload.includeStatuses]
- **Include Lists:** [workload.includeLists]
- **Priority Weighting:** [workload.priorityWeighting]

---

## AI Configuration

- **Provider:** [ai.provider]
- **Model:** [ai.model]
- **Assignment Considerations (Priority Order):**
  1. [consideration 1]
  2. [consideration 2]
  3. [consideration 3]

---

## Notification Platform

- **Platform:** [notification.platform]
- **Channel:** [slack.notificationChannel]
- **Features Enabled:** [slack.features]

---

## Assignment Workflow

- **Mode:** [assignment.autoAssignMode]
- **Actions on Assignment:** [assignment.actions]
- **Destination:** [assignment.destinationList]

---

## Edge Case Handling

- **No Capacity:** [edgeCases.noCapacity]
- **No Skill Match:** [edgeCases.noSkillMatch]
- **Missing Data:** [edgeCases.missingData]

---

## Next Steps

1. Set up credentials in n8n
2. Build Workflow 1: Task Notification
3. Build Workflow 2: AI Analysis
4. Build Workflow 3: Auto-Assignment
5. Build Workflow 4: Interactive Bot (if Slack features enabled)
6. Test in sandbox environment
7. Pilot rollout with [testing.testUsers]
8. Full rollout

```

---

## Generating Customized Guides (Instructions for AI Agent)

After collecting all configuration data:

1. **Read the base workflow guides** from the `n8n-task-assignment-guides` folder
2. **Create a new folder** called `customized-guides-[TeamName]`
3. **For each guide file**, replace the hardcoded values with the user's configuration:
   - Replace TeamworkFX references with their system name
   - Replace field paths (e.g., `$json.body.event.result.content`) with their system's field paths
   - Replace team member names, IDs, and skills with their actual team
   - Replace Slack channel with their channel
   - Replace MCP client calls with REST API calls if they don't have MCP
   - Adjust workload calculation logic based on their preferences
4. **Generate a build checklist** specific to their setup
5. **Walk through the build** one node at a time, waiting for confirmation before proceeding

---

## Platform-Specific Adaptations

### If Using REST API Instead of MCP

When the user's system doesn't have MCP support:

1. Ask for API documentation URL
2. Identify equivalent API endpoints for:
   - Get single task details
   - Get tasks for a user/project (for workload calculation)
   - Move task to different list
   - Assign task to user
   - Add comment to task (optional)
3. Replace MCP Client nodes with HTTP Request nodes
4. Adjust authentication headers/parameters
5. Update field path references based on API response structure

### If Using Platforms Other Than Slack

**For Microsoft Teams:**
- Replace Slack nodes with HTTP Request nodes calling Teams Incoming Webhook or Bot API
- Use Adaptive Cards instead of Slack Block Kit
- Configure Teams app if interactivity is needed

**For Email:**
- Replace Slack nodes with Email nodes
- Remove interactive buttons (email links to web interface instead)
- Consider a simple web form for "Analyze & Recommend" trigger

**For Discord:**
- Replace Slack nodes with Discord Webhook nodes
- Use Discord embeds instead of Block Kit
- Configure Discord bot if interactivity is needed

---

## Common System Mappings

### Asana
- Hierarchy: Workspaces → Projects → Sections → Tasks
- Webhooks: Yes (task created, task updated, task deleted)
- API: REST API with OAuth or Personal Access Token
- Field mapping: `name` (title), `notes` (description), `due_on` (due date), `custom_fields` (priority, etc.)

### ClickUp
- Hierarchy: Workspaces → Spaces → Folders → Lists → Tasks
- Webhooks: Yes (task created, task updated, task moved, etc.)
- API: REST API with API Token
- Field mapping: `name` (title), `description`, `due_date`, `priority`, `time_estimate` (milliseconds)

### Monday.com
- Hierarchy: Workspaces → Boards → Groups → Items
- Webhooks: Yes (via integrations)
- API: GraphQL API
- Field mapping: `name` (title), column values for custom fields

### Jira
- Hierarchy: Projects → Issues (with Issue Types)
- Webhooks: Yes (issue created, updated, transitioned)
- API: REST API v3 with API Token or OAuth
- Field mapping: `summary` (title), `description`, `duedate`, `priority.name`, `timetracking.originalEstimate`

### Trello
- Hierarchy: Boards → Lists → Cards
- Webhooks: Yes (card created, updated, moved)
- API: REST API with API Key + Token
- Field mapping: `name` (title), `desc` (description), `due` (due date), labels (for categories)

---

## Interview Tips for AI Agent

**Be conversational:** Don't make this feel like filling out a form. Ask follow-up questions naturally.

**Validate as you go:** 
- "That's a 6-person team — did I get everyone?"
- "So to confirm, tasks start in the 'Incoming Requests' project and then get moved to individual projects after assignment?"

**Offer examples:**
- "Many teams use a 2-week time window for workload calculations. Does that sound right for you, or would you prefer something different?"

**Check technical readiness:**
- "Do you have admin access to your Slack workspace to create a new app?"
- "Have you used n8n before, or is this your first automation?"

**Clarify ambiguity:**
- If they say "high priority tasks should count more," ask: "Should a high-priority 5-hour task count the same as a 7.5-hour normal task (using a 1.5x multiplier), or something different?"

**Set expectations:**
- "This setup usually takes 2-3 hours total if we go step by step. Does that work for you, or should we break it into multiple sessions?"

**Document edge cases:**
- When they mention something unusual ("Oh, we have a few contractors who are part-time"), make sure to note that and plan for it

---

## Build Session Guide (Instructions for AI Agent)

Once the interview is complete and configuration summary is generated:

1. **Validate prerequisites:**
   - Do they have n8n installed/access?
   - Do they have required credentials (API keys, tokens)?
   - Do they have access to create webhooks in their PM system?
   - Do they have Slack admin access (if using Slack)?

2. **Set up credentials first:**
   - Guide them to create each credential in n8n
   - Test authentication before building workflows

3. **Build in order:**
   - Phase 0: Connection test (verify PM system API/MCP works)
   - Workflow 1: Notification only (no buttons yet)
   - Test thoroughly before proceeding
   - Workflow 2: AI Analysis
   - Workflow 3: Auto-assignment (built on same canvas as Workflow 2)
   - Workflow 4: Interactive features (if requested)

4. **Test after each node:**
   - Execute the workflow
   - Check the output
   - Verify field paths are correct
   - Update guides if anything differs from expectations

5. **Document as you build:**
   - When you discover a field path is different than expected, update the customized guide immediately
   - Note any workarounds or adaptations needed
   - Keep the user's configuration summary up to date

6. **Provide troubleshooting help:**
   - If a node fails, check the error message together
   - Explain what each error means and how to fix it
   - Offer alternative approaches if something isn't working

---

## Success Criteria

By the end of the setup process, the user should have:

- [ ] A working webhook that detects new tasks
- [ ] Slack notifications (or email/Teams) when tasks arrive
- [ ] AI-powered assignment recommendations based on workload and skills
- [ ] (Optional) One-click auto-assignment
- [ ] (Optional) Interactive bot for ad-hoc queries
- [ ] Documentation of their specific configuration
- [ ] Test results showing it works with real data
- [ ] Confidence to maintain and adjust the system going forward

---

## Maintenance & Updates Guide

After initial setup, provide guidance on:

**Adding/Removing Team Members:**
- Where to update the team member array (in which Code node)
- What IDs they need to collect for new members
- How to update the skills matrix

**Adjusting Workload Calculations:**
- Which Code node contains the calculation logic
- How to change the time period, capacity, or weighting

**Updating AI Behavior:**
- Where the AI prompt is built
- How to adjust assignment priorities
- How to add new rules or constraints

**Troubleshooting Common Issues:**
- Webhook stopped firing → check PM system settings
- Wrong person recommended → review skills matrix and workload data
- Slack buttons not working → verify Interactivity URL and credentials

---

## End of Interview Guide

**Final message to user after completing setup:**

"Congratulations! Your Smart Task Assignment Workflow is now live. Here's what happens next:

1. **Monitor the first week:** Watch how tasks get assigned and note any patterns that seem off
2. **Gather team feedback:** Ask your team if the recommendations make sense
3. **Tune as needed:** Adjust skills, capacity settings, or AI instructions based on real-world performance
4. **Reach out if stuck:** If something breaks or you want to add features, let me know

You now have an intelligent system that will save your team hours every week and ensure work is distributed fairly based on skills and availability. Nice work!"

---

## AI Agent Skill Requirements

To successfully conduct this interview and build the workflows, the AI agent should:

- [ ] Understand n8n workflow concepts (nodes, expressions, triggers)
- [ ] Know how to read API documentation and map endpoints
- [ ] Understand webhook vs polling trade-offs
- [ ] Know how to construct HTTP requests with various auth methods
- [ ] Understand Slack app configuration (for Slack integrations)
- [ ] Be able to parse JSON responses and extract field paths
- [ ] Know how to write JavaScript for n8n Code nodes
- [ ] Understand AI prompt engineering for task assignment use cases
- [ ] Be able to troubleshoot errors and adapt when things don't work as expected
- [ ] Be patient and communicative — this is a collaborative build process

---

**Version:** 1.0  
**Last Updated:** March 5, 2026  
**Maintained By:** Danelle Wright
