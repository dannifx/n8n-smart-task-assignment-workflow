# 🚀 TeamworkFX Users — Quick Setup Guide

**For teams already using TeamworkFX who want to implement this workflow**

---

## 🤖 Recommended: Let AI Guide You (Easiest!)

**Instead of doing this manually, let AI walk you through everything:**

1. **Copy this entire prompt:**

```
I want to set up the Smart Task Assignment Workflow for my TeamworkFX team.

I have the complete documentation. Please:

1. Read TEAMWORKFX-USERS-setup-guide.md
2. Ask me the interview questions ONE SECTION AT A TIME
3. Validate my responses after each section
4. Once we finish the interview, guide me through building each workflow 
   NODE BY NODE in n8n
5. Help me test and troubleshoot as we go

Start by asking me the questions from "Your TeamworkFX Setup" section 
and wait for my answers.
```

2. **Paste it into Claude, ChatGPT, or your AI assistant**

3. **Answer the questions as the AI asks them**

4. **Let AI guide you through building node-by-node**

**Time: 2-3 hours total** — AI handles all the complexity!

**See AI-GUIDED-SETUP-prompts.md for the full detailed prompt.**

---

## OR: Do It Manually (More Work)

If you prefer to do this without AI assistance:

1. Fill out the interview questions below
2. Customize the team member data
3. Build the workflows (copy/paste the code)
4. Test and go live

**Estimated time: 3-4 hours total** (more trial and error)

---

## What You'll Be Building

**4 Workflows:**
1. **New Task Notification** — Post to Slack when task arrives (20 min)
2. **AI Analysis** — Recommend assignee based on workload + skills (45 min)
3. **Auto-Assignment** — One-click assign and move (15 min)
4. **Interactive Bot** — @mention commands for capacity and overrides (20 min)

**End result:** Smart, automated task routing that saves 5-15 minutes per assignment.

---

## Before You Start — Quick Interview

Answer these questions before building. You'll need this info during setup.

### Your TeamworkFX Setup

**Q1: What's your TeamworkFX installation URL?**
- Example: `https://yourcompany.teamwork.com` or `https://app.webfx.com`
- Your answer: ________________________________

**Q2: Do you have access to TeamworkFX MCP (Model Context Protocol)?**
- If yes: What's your MCP API key?
- If no: Do you have a TeamworkFX API token instead?
- Your answer: ________________________________

**Q3: What's the project where new tasks arrive?**
- Project name: ________________________________
- Project ID (found in URL): ________________________________

**Q4: What's the tasklist where unassigned tasks land?**
- List name: ________________________________
- Example: "📥 New Interactive Requests", "Incoming Tasks", "Unassigned"
- Your answer: ________________________________

**Q5: Where should assigned tasks be moved?**
- Same for everyone? Different list per person?
- If different: Each person has their own project? Or lists within one project?
- Your answer: ________________________________

---

### Your Team Members

**Q6: How many people will be included in auto-assignment?**
- Number: ________________________________

**Q7: For each person, gather this info:**

Copy this template for each team member:

```
NAME: _______________________
ROLE: _______________________ (e.g., "Full-Stack Developer", "Lead Designer")
SKILLS: _____________________ (e.g., "JavaScript (Expert), React (Expert), Design (Beginner)")

TEAMWORKFX IDs:
- User ID: _________________ (Find in TeamworkFX: Settings → Team → Click person → ID in URL)
- Project ID: ______________ (Where their personal tasks live)
- "New Tasks" List ID: _____ (The list where new assignments should go)

EXPERTISE AREAS (for AI matching):
- Primary: _________________ (e.g., "Front-end development", "Graphic design")
- Secondary: _______________ (e.g., "Tools development", "Branding")
- Notable: _________________ (e.g., "Expert in CSS animations", "Copywriting")
```

**Repeat for all team members.**

---

### Your Slack Setup

**Q8: Which Slack channel should receive notifications?**
- Channel name: ________________________________
- Example: `#task-assignment`, `#interactive-requests`, `#dev-team`

**Q9: Do you have a Slack app already, or need to create one?**
- [ ] I have one (Bot Token: xoxb-________________)
- [ ] I need to create one (I have Slack admin access)
- [ ] I need someone else to create it for me

**Q10: What features do you want?**
- [ ] Basic notifications when tasks arrive
- [ ] AI-powered assignment recommendations
- [ ] One-click auto-assignment
- [ ] @mention bot for team capacity reports
- [ ] @mention bot for ad-hoc task analysis
- [ ] Thread-based assignment overrides

*(Recommended: Enable all — takes the same amount of time)*

---

### Your OpenAI Setup

**Q11: Do you have an OpenAI API key?**
- [ ] Yes (Key: sk-________________)
- [ ] No, but I can get one (Go to platform.openai.com → API Keys)
- [ ] No, and I want to use a different AI provider

**Q12: Which model do you want to use?**
- [x] **GPT-4o** (recommended — best balance of cost and quality)
- [ ] GPT-4 Turbo (more expensive, slightly better reasoning)
- [ ] GPT-3.5 Turbo (cheaper, but less reliable for complex analysis)
- [ ] Claude 3.5 Sonnet (Anthropic — different API key required)

---

### Your Task Types & Workflow

**Q13: How do you categorize tasks?**
- Is there a "Channel" or "Task Type" custom field?
- What are the possible values? (e.g., "Design", "Development", "CRO")
- Custom Field ID in TeamworkFX: ________________________________

**Q14: How is priority indicated?**
- [ ] Priority field (High/Medium/Low)
- [ ] Custom field
- [ ] Not tracked
- Your answer: ________________________________

**Q15: Do you track estimated hours?**
- [ ] Yes, in the "Estimated Hours" field
- [ ] Yes, in a custom field called: ________________________________
- [ ] No, we don't estimate

**Q16: How many hours should we assume per 2-week period for capacity?**
- Standard: 80 hours (full-time, 40h/week × 2 weeks)
- Part-time example: 40 hours (20h/week × 2 weeks)
- Your answer per person: ________________________________

---

### Workload Calculation Preferences

**Q17: Which task lists should COUNT toward someone's workload?**

Check all that apply:
- [ ] Daily lists (Monday, Tuesday, Wednesday, Thursday, Friday)
- [ ] "Next Week" list
- [ ] "This Week" list
- [ ] "New Tasks" list
- [ ] "Larger/Cycle Projects" list
- [ ] "Backlog" list *(usually NO)*
- [ ] "Done" / "Completed" lists *(usually NO)*
- [ ] Other: ________________________________

**Q18: Should priority affect workload calculations?**

Example: A 10-hour High priority task counts as 10 hours, but a 10-hour Low priority task counts as only 5 hours (because low priority work can be postponed).

- [ ] Yes, use priority weighting (High=100%, Medium=75%, Low=50%)
- [ ] No, all hours count equally
- [ ] Custom weighting: High=___%, Medium=___%, Low=___%

**Q19: How far ahead should we look for due dates?**
- [ ] 2 weeks (recommended — matches capacity period)
- [ ] 1 week
- [ ] 1 month
- [ ] Don't filter by due date (count everything)

---

### AI Assignment Preferences

**Q20: What should the AI prioritize when recommending assignees?**

Rank these from 1 (most important) to 4 (least important):

- [ ] _____ **Skill match** — Assign to person with best skills for the task
- [ ] _____ **Availability** — Assign to person with most free capacity
- [ ] _____ **Workload balance** — Spread work evenly across the team
- [ ] _____ **Context continuity** — Favor person already working on related tasks

**Q21: Are there any hard rules?**

Examples:
- "Design tasks MUST go to designers only"
- "Development tasks MUST go to developers only"
- "Junior team members can't handle tasks over 20 hours"
- "Certain clients always go to the same person"

Your rules:
1. ________________________________
2. ________________________________
3. ________________________________

---

## Setup Checklist

Once you've answered the questions above, follow this sequence:

### Phase 0: Prerequisites (15-30 min)

- [ ] **Get n8n access**
  - Sign up at n8n.io (Cloud) or set up self-hosted
  - Confirm you can create workflows

- [ ] **Configure TeamworkFX credential in n8n**
  - Type: Header Auth
  - Name: `TeamworkFX MCP` (or your preference)
  - Header Name: `x-twfx-api-key`
  - Header Value: [Your MCP API key from Q2]

- [ ] **Configure Slack credential in n8n**
  - Type: Slack API (OAuth)
  - Bot Token: [Your token from Q9]
  - Required scopes: `chat:write`, `chat:write.customize`, `reactions:write`, `channels:read`, `app_mentions:read`

- [ ] **Configure OpenAI credential in n8n**
  - Type: OpenAI
  - API Key: [Your key from Q11]

- [ ] **Test MCP connection** (optional but recommended)
  - Follow guide: `n8n-task-assignment-guides/00-phase0-mcp-test.md`
  - Confirms TeamworkFX MCP is accessible from n8n

---

### Phase 1: Build Workflow 1 — Notification (20-30 min)

- [ ] **Read the guide**: `n8n-task-assignment-guides/01-workflow1-new-task-notification.md`

- [ ] **Customize before building:**
  - Node 2 (Filter): Update `TARGET_LIST` to your list name from Q4
  - Node 3 (Set): Update `customFields["41"]` if your Channel field ID is different (from Q13)
  - Node 5 (Slack): Update channel to your answer from Q8

- [ ] **Build the workflow** (5 nodes total)
  - Follow the guide step by step
  - Copy/paste the code from each node section

- [ ] **Get webhook URL and configure TeamworkFX**
  - Copy the Production webhook URL from n8n
  - In TeamworkFX: Settings → Webhooks → Add webhook
  - Paste URL, enable "Task Created" and "Task Updated" events
  - Select your project from Q3

- [ ] **Test it**
  - Create a test task in your target list (from Q4)
  - Check Slack channel (from Q8) for notification
  - Verify all fields appear correctly
  - Edit the task → should NOT trigger a new notification
  - Move a task into the list → SHOULD trigger a notification

---

### Phase 2: Build Workflow 2 — AI Analysis (45-60 min)

- [ ] **Read the guide**: `n8n-task-assignment-guides/02-workflow2-ai-analysis.md`

- [ ] **Customize the team member array:**
  - Open the guide and find Node 7: "Code: Build Team Member Array"
  - Replace the example team members with YOUR team from Q7
  - Update each member's: name, role, skills, userId, projectId, newTasksListId

- [ ] **Customize the skills matrix:**
  - In Node 10: "Code: Build OpenAI Prompt"
  - Update the `teamSkills` object with your team's actual skills from Q7

- [ ] **Customize the AI instructions:**
  - In Node 10: "Code: Build OpenAI Prompt"
  - Update the hard rules section based on your answers from Q21
  - Update the priority ranking based on your answer from Q20

- [ ] **Customize workload calculation:**
  - In Node 9: "Code: Calculate Workload"
  - Update `ACTIVE_LISTS` array based on your answer from Q17
  - Update priority weighting based on your answer from Q18
  - Update `DUE_DATE_WINDOW_DAYS` based on your answer from Q19
  - Update `CAPACITY_HOURS` based on your answer from Q16

- [ ] **Build the workflow** (13 nodes total)
  - Follow the guide node by node
  - Copy/paste code, replacing team data as noted above

- [ ] **Configure Slack app Interactivity URL**
  - Copy the webhook URL from Workflow 2
  - Go to api.slack.com → Your App → Interactivity & Shortcuts
  - Enable Interactivity
  - Paste the n8n webhook URL as Request URL
  - Save

- [ ] **Test it**
  - Go to a Workflow 1 notification in Slack
  - Click "Analyze & Recommend"
  - Wait 10-15 seconds
  - Check thread for AI recommendation
  - Verify workload numbers look accurate (spot-check against actual tasks)
  - Verify recommended person makes sense

---

### Phase 3: Build Workflow 3 — Auto-Assignment (15-20 min)

- [ ] **Read the guide**: `n8n-task-assignment-guides/03-workflow3-auto-assignment.md`

- [ ] **Build on Workflow 2 canvas**
  - This shares the same webhook trigger as Workflow 2
  - Add the nodes to the "False" branch of the IF node

- [ ] **No team customization needed**
  - This workflow uses the button value which already has the member info

- [ ] **Test it**
  - Run an AI analysis (Workflow 2)
  - Click the "Auto-Assign to [Name]" button
  - Check TeamworkFX: task should be moved to that person's project/list
  - Check TeamworkFX: task should be assigned to that person
  - Check Slack: confirmation message should appear

---

### Phase 4: Build Workflow 4 — Interactive Bot (20-30 min)

- [ ] **Read the guide**: `n8n-task-assignment-guides/04-workflow4-interactive-bot.md`

- [ ] **Customize the team member array** (again — same as Workflow 2)
  - Node 5a: "Code: Build Team Array"
  - Use the same team member data from Q7

- [ ] **Customize workload calculation** (again — same as Workflow 2)
  - Node 5c: "Code: Calculate Workload1"
  - Use the same settings from Q16-Q19

- [ ] **Build the workflow** (separate workflow with new webhook)
  - Follow the guide to build all branches

- [ ] **Configure Slack app Event Subscriptions**
  - Copy the webhook URL from Workflow 4
  - Go to api.slack.com → Your App → Event Subscriptions
  - Enable Events
  - Paste the n8n webhook URL as Request URL
  - Subscribe to bot event: `app_mention`
  - Save

- [ ] **Test it**
  - In Slack, @mention your bot: "@YourBot team capacity"
  - Should see formatted capacity report
  - In a thread with task analysis, type: "@YourBot assign to [Name]"
  - Should move and assign the task
  - Try: "@YourBot help" → should show command menu

---

## Customization Quick Reference

**Most common customizations** (after initial setup):

| What to Change | File | Node | Search For |
|----------------|------|------|------------|
| Add/remove team member | Workflow 2 guide | Node 7 | `const teamMembers = [` |
| Update someone's skills | Workflow 2 guide | Node 10 | `const teamSkills = {` |
| Change Slack channel | Workflow 1 guide | Node 5 | `channel: '#interactive-task-assignment'` |
| Change target tasklist | Workflow 1 guide | Node 2 | `const TARGET_LIST = ` |
| Adjust capacity hours | Workflow 2 guide | Node 9 | `const CAPACITY_HOURS = 80` |
| Change active lists | Workflow 2 guide | Node 9 | `const ACTIVE_LISTS = [` |
| Update priority weights | Workflow 2 guide | Node 9 | `const priorityWeight = ` |
| Modify AI instructions | Workflow 2 guide | Node 10 | `You are a task assignment assistant` |

---

## What's Different From the Original?

**Things you MUST customize:**
- Team member names, roles, skills (Q7)
- User IDs, Project IDs, List IDs (Q7)
- Slack channel name (Q8)
- Target project and tasklist names (Q3, Q4)
- Custom field ID for task type/channel if different (Q13)

**Things you MIGHT customize:**
- Capacity hours per person (Q16)
- Active list names (Q17)
- Priority weighting (Q18)
- AI assignment priorities (Q20, Q21)

**Things you probably DON'T need to change:**
- Webhook payload structure (same TeamworkFX format)
- MCP call syntax (same MCP server)
- Slack Block Kit formatting
- Overall workflow structure

---

## Time-Saving Tips

**Tip 1: Use find-and-replace for team names**
- The guides have example names like "Erron", "Giancarlo", "Sid"
- When you copy code, do a find-and-replace with your team member names
- Faster than retyping everything

**Tip 2: Build in order, test each workflow**
- Don't try to build all 4 at once
- Test Workflow 1 thoroughly before moving to Workflow 2
- Catch issues early before they propagate

**Tip 3: Export workflows as JSON after each completion**
- Backup in case you need to revert changes
- Easy to share with teammates who want the same setup

**Tip 4: Use the Test webhook URL first**
- Capture real payload data before going to Production
- Easier to debug field paths with real data

**Tip 5: Start with a small team subset**
- Include just 2-3 people initially
- Once it works, add the rest of the team
- Easier to verify workload calculations with fewer people

---

## Common TeamworkFX-Specific Issues

**Issue: Custom field IDs are different**
- **Fix:** Check your TeamworkFX custom field settings
- URL format: `https://app.webfx.com/admin/customfields`
- Find the field (e.g., "Channel"), note the ID number
- Update in Node 3 (Workflow 1): `customFields["YOUR_ID"]`

**Issue: Tasklist names have emojis or special characters**
- **Fix:** Use `.includes()` instead of exact match
- Already implemented in the filter code: `resultTasklist.includes(TARGET_LIST)`
- Just put the text part (e.g., "New Interactive Requests" not "📥 New Interactive Requests")

**Issue: MCP returns "Unauthorized"**
- **Fix:** Check your API key in n8n credentials
- Verify it's the MCP key, not the standard TeamworkFX API token
- Contact your TeamworkFX admin if you don't have MCP access

**Issue: Task appears to move but doesn't assign**
- **Fix:** Two separate MCP calls required (move + assign)
- Verify both are in Workflow 3
- Check that `responsibleUserId` is a number, not string

**Issue: Workload numbers seem way off**
- **Fix:** Check which lists are included in `ACTIVE_LISTS`
- Verify tasks on those lists have estimated hours set
- Check if daily list tasks are being counted (should be)
- Spot-check: manually count hours for one person and compare

---

## Going Live Checklist

Before announcing to your team:

- [ ] All 4 workflows are active in n8n
- [ ] Test task went through entire flow successfully
- [ ] Slack notifications appear in correct channel
- [ ] AI recommendations make sense (asked 2-3 people for feedback)
- [ ] Auto-assignment moves to correct location
- [ ] Team capacity command shows accurate numbers
- [ ] Skills matrix is up to date for all team members
- [ ] Documented your customizations (saved this form with answers)
- [ ] Exported all workflows as JSON backups

---

## Announcing to Your Team

**Sample Slack message:**

```
Hey team! 👋

We now have an AI-powered task assignment bot in #[your-channel]. 

When new tasks land in TeamworkFX, you'll get a notification here with an 
"Analyze & Recommend" button. Click it to see who should take the task based 
on current workload and skills.

**New commands:**
• @[BotName] team capacity — See who's available
• @[BotName] assign to [Name] — Override the AI recommendation

The bot considers everyone's active tasks, skills, and capacity to make smart 
recommendations. If you disagree with a recommendation, you can always override 
it or assign manually in TeamworkFX.

Questions? Ping me or check out the user guide: [link to interactive-task-assignment-bot-guide.md]

Let's test it out with the next few tasks and see how it goes!
```

---

## Maintenance Tasks

**Weekly:**
- Spot-check a few recommendations to ensure quality
- Note any patterns (certain people always overridden, etc.)

**Monthly:**
- Update skills matrix as people learn new things
- Review and adjust AI prompt if needed
- Check if active list names have changed

**As needed:**
- Add new team member (update Workflow 2 Node 7, Workflow 4 Node 5a)
- Remove team member (remove from arrays, add to exclusion list)
- Adjust capacity for someone going part-time (update CAPACITY_HOURS in their object)
- Change target project/list (update webhook and filter settings)

---

## Getting Help

**If you get stuck:**

1. **Check the detailed guides** in `n8n-task-assignment-guides/`
   - More thorough explanations of each node
   - Code comments explain what each section does

2. **Check project-progress.md**
   - Documents all issues encountered during original build
   - Search for error messages or symptoms

3. **Test one node at a time**
   - Execute workflow and inspect each node's output
   - Use n8n's "Run Node" feature to test in isolation

4. **Common error → quick fix:**
   - "Cannot read property" → Field path is wrong, check webhook output
   - "Unauthorized" → Check credentials in n8n
   - "Rate limit" → Add delay between API calls in loop
   - "Invalid blocks" → Check JSON syntax in Slack Block Kit

5. **Ask the original implementer (Danelle)**
   - If you're a WebFX coworker
   - Provide: error message, workflow name, node number, what you were trying to do

---

## What You'll Get After Setup

✅ **Time savings:** 5-15 min per task × [number of tasks/week] = _____ hours/week

✅ **Fair distribution:** Data shows who's actually available, prevents burnout

✅ **Skill matching:** Tasks go to people with the right expertise

✅ **Transparency:** Everyone can see team capacity with `@bot team capacity`

✅ **Flexibility:** Override recommendations when you know better

✅ **Documentation:** Clear record of why assignments were made

---

**Ready to start?** 

1. Fill out the interview questions above (save your answers!)
2. Complete the Setup Checklist in order
3. Test thoroughly before going live
4. Announce to team and gather feedback

**Questions?** Check the detailed guides in `n8n-task-assignment-guides/` or the main README.md

Good luck! 🚀
