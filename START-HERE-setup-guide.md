# 🚀 Smart Task Assignment Workflow — Setup Guide

**Welcome!** This folder contains everything needed to build an AI-powered task assignment system for your team.

---

## What This System Does

When a new task arrives in your project management system:
1. 📬 **Instant notification** in Slack (or email/Teams) with task details
2. 🤖 **AI analyzes** team workload and skills to recommend the best person
3. ✅ **One-click assignment** moves and assigns the task automatically
4. 📊 **On-demand queries** like "@bot team capacity" or "@bot analyze this task"

**Result:** No more manual workload checking. No more guessing who's available. Smart, data-driven task routing.

---

## Quick Start: Three Paths

### Path 1: TeamworkFX Users with AI Guidance ⭐ RECOMMENDED

If you're using **TeamworkFX** like the original implementation:

**Step 1:** Copy this prompt and paste it into your AI assistant (Claude, ChatGPT, etc.):

```
I want to set up the Smart Task Assignment Workflow for my TeamworkFX team.

I have the complete documentation in this folder. Please:

1. Read TEAMWORKFX-USERS-setup-guide.md
2. Guide me through the interview questions ONE SECTION AT A TIME
3. After I answer each section, validate my responses
4. Once we complete the interview, guide me through building each workflow 
   NODE BY NODE in n8n
5. Help me test and troubleshoot as we go

Start by asking me the questions from "Section 1: Your TeamworkFX Setup" 
and wait for my answers before moving to the next section.
```

**Why this works:** The AI will walk you through the entire process, validate your answers, and guide you node-by-node through building the workflows. Much easier than doing it alone!

**Time:** 2-3 hours total with AI assistance

---

### Path 2: Other Platforms with AI Guidance

If you're using Asana, ClickUp, Jira, Monday, Trello, or another platform:

**Copy this prompt and paste it into your AI assistant (Claude, ChatGPT, etc.):**

```
I want to set up the Smart Task Assignment Workflow for my team.

I'm using [YOUR PLATFORM NAME] for project management.

Please:

1. Read the file "ai-guided-setup-interview.md" completely
2. Conduct the interview with me section by section (10 sections total)
3. Be conversational - don't make it feel like filling out a form
4. Validate my answers and ask clarifying follow-up questions
5. After completing all sections, generate a Configuration Summary
6. Create customized n8n workflow guides adapted to MY specific platform and team
7. Then guide me step-by-step through building each workflow in n8n, 
   NODE BY NODE, testing as we go

Start by asking me the questions from Section 1: Project Management System.
Wait for my answers before moving to the next section.
```

**Why this works:** The AI will adapt the entire workflow to your specific platform, team structure, and preferences. Then it guides you through building everything step-by-step.

**Time:** 3-5 hours total (includes platform adaptation + building)

---

### Path 3: Use the Original Guides As-Is

If you use TeamworkFX, Slack, and have a similar team structure to the original implementation:

**Step 1:** Review the prerequisites and existing guides:
- Open `n8n-task-assignment-guides/00-overview.md`
- Check that you have the required credentials (TeamworkFX MCP, Slack, OpenAI)
- Read `project-progress.md` to understand what's already been built

**Step 2:** Start building:
- Follow the guides in numbered order (00, 01, 02, 03, 04)
- Each guide has step-by-step instructions with code to copy/paste
- Test each workflow before moving to the next one

**Step 3:** Customize for your team:
- Update the team member arrays in Code nodes with your actual team
- Update the skills matrix with your team's expertise
- Change the Slack channel, project IDs, and list names to match your setup

---

## What's Included in This Folder

| File/Folder | Purpose |
|-------------|---------|
| `TEAMWORKFX-USERS-setup-guide.md` | **⭐ Quick setup for TeamworkFX users** — Fill-in-the-blanks interview + checklist |
| `ai-guided-setup-interview.md` | **Interview guide for AI agents** — Questions to ask when configuring for other platforms |
| `START-HERE-setup-guide.md` | **This file** — Quick start instructions |
| `n8n-task-assignment-guides/` | **Original workflow guides** — Built for TeamworkFX + Slack |
| `n8n-task-assignment-guides/00-overview.md` | **System overview** — Architecture, prerequisites, build progress |
| `n8n-task-assignment-guides/project-progress.md` | **Session log** — Detailed history of what was built and learned |
| `n8n-task-assignment-guides/01-workflow1-new-task-notification.md` | **Workflow 1 guide** — Webhook → Filter → Slack notification |
| `n8n-task-assignment-guides/02-workflow2-ai-analysis.md` | **Workflow 2 guide** — AI analysis with workload + skills |
| `n8n-task-assignment-guides/03-workflow3-auto-assignment.md` | **Workflow 3 guide** — Auto-assign and move task |
| `n8n-task-assignment-guides/04-workflow4-interactive-bot.md` | **Workflow 4 guide** — @mention bot for ad-hoc queries |
| `interactive-task-assignment-bot-guide.md` | **End-user documentation** — How team members use the bot |

---

## System Requirements

### For n8n
- n8n Cloud account OR self-hosted n8n instance (v1.0+)
- Basic familiarity with n8n workflows (helpful but not required)

### For Your Project Management System
- API access (either REST API or MCP server)
- Ability to create webhooks OR permission to poll the API
- API credentials (key, token, or OAuth)

### For Notifications (Pick One)
- **Slack:** Admin access to create a Slack app, or existing app credentials
- **Microsoft Teams:** Incoming webhook URL or bot credentials
- **Email:** SMTP server access
- **Discord:** Webhook URL or bot token

### For AI Analysis
- API key for one of:
  - OpenAI (GPT-4, GPT-4o)
  - Anthropic (Claude)
  - Google (Gemini)
  - Local model (Ollama, LM Studio, etc.)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT MANAGEMENT SYSTEM                │
│                 (TeamworkFX, Asana, ClickUp, etc.)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Webhook fires when task created/moved
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      WORKFLOW 1: NOTIFICATION               │
│  Webhook → Filter → Extract Fields → Build Message → Slack │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ User clicks "Analyze & Recommend"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     WORKFLOW 2: AI ANALYSIS                 │
│   Parse Button → Get Task → Query Workload per Member →    │
│   Calculate Capacity → Build Prompt → GPT-4o → Reply       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ User clicks "Auto-Assign to [Name]"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  WORKFLOW 3: AUTO-ASSIGNMENT                │
│      Parse Button → Move Task → Assign → Confirmation      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  WORKFLOW 4: INTERACTIVE BOT                │
│  @bot mention → Parse Intent → Route to Analysis/Capacity/ │
│  Assignment → Execute → Reply in Thread                     │
└─────────────────────────────────────────────────────────────┘
```

---

## How Long Does Setup Take?

**If you're a TeamworkFX user (Path 1):**
- Fill out interview questions: 15-20 minutes
- Credential setup: 15-30 minutes
- Building all 4 workflows: 2-3 hours (following guides with your team data)
- Testing: 30 minutes

**Total: 2-3 hours** (fastest path!)

**If using guided AI interview for other platforms (Path 2):**
- Interview: 30-45 minutes
- Credential setup: 15-30 minutes
- Building Workflow 1: 20-30 minutes
- Building Workflow 2: 45-60 minutes
- Building Workflow 3: 15-20 minutes
- Building Workflow 4: 20-30 minutes
- Testing & refinement: 30-60 minutes

**Total: 3-5 hours** (can be split across multiple sessions)

**If using the original guides as-is (Path 3):**
- Prerequisite setup: 30 minutes
- Building all 4 workflows: 2-3 hours
- Customizing for your team: 30-60 minutes
- Testing: 30 minutes

**Total: 3-4 hours**

---

## Support & Troubleshooting

### Common Issues

**Webhook not triggering:**
- Check that webhook is configured in your PM system
- Verify the webhook URL is the Production URL (not Test URL)
- Check that correct events are enabled (create + update)
- Test with the Test URL first to capture a sample payload

**Wrong field paths in n8n:**
- Execute the workflow and inspect the webhook output
- Use n8n's expression editor to browse available fields
- Update Code nodes with correct field paths

**AI recommendations seem off:**
- Review the skills matrix — is it accurate?
- Check workload calculation — are the right tasks being counted?
- Adjust the AI prompt to emphasize different factors
- Verify priority weighting matches your team's workflow

**Slack buttons not working:**
- Verify Interactivity URL is set correctly in Slack app settings
- Check that the webhook in Workflow 2 is active
- Ensure the button value encoding matches what the parse code expects

### Getting Help

If you get stuck during setup:

1. **Check the project-progress.md file** — It documents common issues encountered during the original build
2. **Read the relevant workflow guide thoroughly** — Many issues are addressed in notes
3. **Use your AI assistant for debugging** — Share the error message and ask for help
4. **Review n8n documentation** — For node-specific questions

---

## What Happens After Setup?

Once your workflows are running:

### Week 1: Monitor & Tune
- Watch the first 10-20 task assignments closely
- Check if AI recommendations make sense
- Gather feedback from your team
- Adjust skills matrix or workload settings if needed

### Week 2-4: Optimize
- Track how often people override the AI recommendations
- Look for patterns (certain task types always reassigned, certain people over/under utilized)
- Fine-tune the AI prompt, priority weights, or capacity calculations

### Month 2+: Maintain
- Update team member info when people join/leave
- Adjust skills as people grow and learn new things
- Add new features or automation as needs evolve

### Ongoing Benefits
- **Time savings:** 5-15 minutes saved per task assignment (adds up fast!)
- **Fair distribution:** Data-driven workload balancing prevents burnout
- **Skill development:** Visibility into who knows what helps with training
- **Team insights:** Capacity reports highlight when you need more resources

---

## Advanced Customization Ideas

Once your basic system is working, consider adding:

- **Historical assignment tracking** — Log all assignments to a database or spreadsheet for analytics
- **Workload forecasting** — Use AI to predict future capacity issues
- **Skills gap analysis** — Identify areas where the team needs training or hiring
- **Client/project affinity** — Favor assigning tasks to people already familiar with a client
- **Time zone awareness** — Consider work hours when assigning urgent tasks
- **Deadline urgency scoring** — Weight tasks by how soon they're due
- **Automated status updates** — Post daily capacity summaries to Slack
- **Integration with time tracking** — Use actual hours worked vs. estimates

---

## License & Sharing

This workflow system was built by Danelle Wright for the WebFX Interactivities team.

**You are free to:**
- Use this system for your own team
- Modify and customize it for your needs
- Share the guides with coworkers
- Fork and extend with new features

**Please:**
- Keep this README intact when sharing
- Share improvements back if you build something cool
- Give credit if you publish or write about it

---

## Questions?

If you're setting this up and need clarification on anything:

1. Read the `ai-guided-setup-interview.md` file — it covers most edge cases
2. Check `project-progress.md` for lessons learned during the original build
3. Use an AI assistant to help interpret the guides for your specific situation

---

## Ready to Start?

Choose your path:

👉 **[Path 1: TeamworkFX Users]** — Open `TEAMWORKFX-USERS-setup-guide.md` (fastest!)

👉 **[Path 2: Other Platforms]** — Start a chat with your AI assistant and paste the prompt from the "Quick Start" section above

👉 **[Path 3: Use Original Guides]** — Open `n8n-task-assignment-guides/00-overview.md` and start building

---

**Good luck, and happy automating!** 🚀
