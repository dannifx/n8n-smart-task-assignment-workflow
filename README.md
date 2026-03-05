# 🤖 Smart Task Assignment Workflow

**Intelligent, AI-powered task routing based on team workload and skills**

---

## What This Is

An automated workflow system that:
- ✅ Detects new tasks in your project management system
- ✅ Notifies your team in Slack (or Teams/Email)
- ✅ Uses AI to analyze team capacity and skills
- ✅ Recommends the best person for each task
- ✅ Auto-assigns with one click
- ✅ Provides on-demand team capacity reports

**Built with:** n8n, OpenAI GPT-4o, Slack API, and your PM system's API/MCP

**Originally created for:** WebFX Interactivities team using TeamworkFX + Slack

**Adaptable for:** Any team using Asana, ClickUp, Jira, Monday, Trello, or similar + any notification platform

---

## Who This Is For

✅ **Project managers** tired of manually checking who's available before assigning tasks

✅ **Team leads** who want data-driven workload balancing

✅ **Operations teams** looking to automate routine task routing

✅ **Small-to-medium teams** (5-20 people) with clear roles and task types

✅ **Anyone familiar with n8n** (or willing to learn) who wants to save hours per week

---

## Quick Start

### For TeamworkFX Users ⭐ FASTEST PATH

**Goal:** Implement this for your TeamworkFX + Slack team

1. Open **TEAMWORKFX-USERS-setup-guide.md**
2. Fill out the interview questions (your team, IDs, preferences)
3. Follow the setup checklist to build all 4 workflows
4. Estimated time: **2-3 hours total**

**Why this is fastest:** The workflows are already built for TeamworkFX. You just customize team names and IDs!

### For Other Platforms (Asana, ClickUp, Jira, etc.)

**Goal:** Adapt this to your platform and team

1. Open **START-HERE-setup-guide.md**
2. Copy the prompt from **AGENT-PROMPT-copy-paste-this.md**
3. Paste it into a chat with your AI assistant (Claude, ChatGPT, etc.)
4. Answer questions about your team, tools, and preferences (~30-45 minutes)
5. The AI will generate customized guides and walk you through building the workflows (~3-5 hours)

---

## What's Included

| File/Folder | Purpose |
|-------------|---------|
| **START-HERE-setup-guide.md** | Quick start instructions (read this first!) |
| **TEAMWORKFX-USERS-setup-guide.md** | ⭐ **Fastest path for TeamworkFX users** — Fill-in-the-blanks interview + setup checklist |
| **AGENT-PROMPT-copy-paste-this.md** | Ready-to-use prompt to start AI-guided setup (for non-TeamworkFX platforms) |
| **ai-guided-setup-interview.md** | Complete interview guide for AI agents (questions, config structure, platform adaptations) |
| **SHARE-WITH-COWORKER-checklist.md** | How to share this with others who want to use it |
| **SYSTEM-ARCHITECTURE-diagram.md** | Visual guide to how all the components fit together |
| **interactive-task-assignment-bot-guide.md** | End-user documentation (how team members use the bot) |
| **n8n-task-assignment-guides/** | Original workflow build guides (4 workflows) |
| **n8n-task-assignment-guides/00-overview.md** | System overview, prerequisites, build progress |
| **n8n-task-assignment-guides/project-progress.md** | Detailed session log with lessons learned |
| **n8n-task-assignment-guides/01-workflow1-new-task-notification.md** | Workflow 1 build guide |
| **n8n-task-assignment-guides/02-workflow2-ai-analysis.md** | Workflow 2 build guide |
| **n8n-task-assignment-guides/03-workflow3-auto-assignment.md** | Workflow 3 build guide |
| **n8n-task-assignment-guides/04-workflow4-interactive-bot.md** | Workflow 4 build guide |

---

## How It Works (30-Second Overview)

1. **Task arrives** in your PM system → Webhook fires → **Slack notification** posted
2. User clicks **"Analyze & Recommend"** → AI queries workload + skills → **Recommendation** posted
3. User clicks **"Auto-Assign to [Name]"** → Task moved and assigned → **Confirmation** posted
4. Anytime: **@mention bot** for capacity reports or ad-hoc task analysis

---

## Features

### Core Features (Workflow 1-3)
- ✅ Real-time task notifications in Slack
- ✅ AI-powered assignment recommendations
- ✅ Workload-based capacity analysis (looks ahead 2 weeks)
- ✅ Skills-based task matching
- ✅ Priority weighting (urgent tasks count more than low-priority)
- ✅ One-click auto-assignment
- ✅ Task moves to assignee's personal project automatically

### Interactive Features (Workflow 4)
- ✅ "@bot team capacity" — Shows who's available and who's swamped
- ✅ "@bot [task URL]" — Analyzes a specific task on-demand
- ✅ "@bot assign to [Name]" — Override AI recommendation in thread
- ✅ Help menu for unknown commands

### Smart Filtering
- ✅ Deduplicates webhook triggers (won't notify on every edit)
- ✅ Filters out headers/divider items
- ✅ Only counts active tasks (excludes backlog, done, archived)
- ✅ Daily task lists always count; other lists only if due soon

---

## Requirements

### Must Have
- n8n account (Cloud or self-hosted)
- Project management system with API access (TeamworkFX, Asana, ClickUp, Jira, etc.)
- AI API key (OpenAI, Anthropic, or Google)
- Notification platform (Slack, Teams, Email, or Discord)

### Nice to Have
- Familiarity with n8n (but not required — AI will guide you)
- Admin access to Slack workspace (for interactive features)
- Basic understanding of APIs and webhooks

---

## Time Investment

**Setup (one-time):**
- AI-guided interview: 30-45 minutes
- Credential configuration: 15-30 minutes
- Building workflows: 2-3 hours
- Testing and refinement: 30-60 minutes

**Total: 3-5 hours** (can be done in multiple sessions)

**Ongoing maintenance:**
- Add/remove team members: 5 minutes
- Update skills matrix: 5-10 minutes
- Adjust workload settings: 10-15 minutes

**Time saved:**
- 5-15 minutes per task assignment
- For a team assigning 10 tasks/week: **~90 minutes/week saved**
- Annual savings: **~75 hours/year**

---

## Use Cases

**Perfect for:**
- 👥 Development teams balancing design vs. development tasks
- 📊 Project managers routing incoming client requests
- 🏢 Operations teams distributing support tickets
- 🎨 Creative teams assigning design/content work
- 🔧 IT teams routing infrastructure tasks

**Not ideal for:**
- Very small teams (< 3 people) where manual assignment is trivial
- Teams with completely unpredictable/unique tasks every time
- Highly specialized roles where there's only one person who can do each task
- Teams without consistent task tracking in a PM system

---

## Success Stories

**WebFX Interactivities Team (Original Implementation):**
- 6-person team (4 developers + 2 designers)
- Processes 15-20 interactive requests per week
- **Time saved:** ~2 hours/week in assignment decisions
- **Fairness:** Transparent workload visibility prevents overloading individuals
- **Skill development:** Clear skills matrix helps identify training opportunities

---

## Platform Support

### Project Management Systems
**Confirmed working:** TeamworkFX (with MCP)

**Should work with minor adaptation:**
- Asana
- ClickUp
- Jira
- Monday.com
- Trello
- Any system with webhook + API support

**Adaptation required:** The AI interview guide will help you map your system's API to the workflow requirements.

### Notification Platforms
**Fully supported:** Slack (with interactive buttons)

**Adaptable:**
- Microsoft Teams (Adaptive Cards instead of Block Kit)
- Discord (webhooks + embeds)
- Email (notifications only, no interactive features)

### AI Providers
**Tested:** OpenAI GPT-4o

**Compatible:**
- Anthropic Claude (3.5 Sonnet recommended)
- Google Gemini (1.5 Pro)
- Local models via Ollama (may need prompt tuning)

---

## Architecture

```
[PM System] → Webhook → [n8n Workflow 1] → Slack Notification
                                                     ↓
                                            User clicks button
                                                     ↓
                              [n8n Workflow 2] → AI Analysis → Thread Reply
                                                     ↓
                                            User clicks assign
                                                     ↓
                              [n8n Workflow 3] → Move + Assign → Confirmation

Parallel:
[Slack @mention] → [n8n Workflow 4] → Capacity/Analysis/Override → Reply
```

**For detailed diagrams:** See SYSTEM-ARCHITECTURE-diagram.md

---

## Customization

**Easy (no coding):**
- Team member names and roles
- Skills matrix
- Workload time window (2 weeks → 1 week, etc.)
- Priority weighting multipliers
- Slack channel
- PM system project/list names

**Medium (edit Code nodes):**
- Active list whitelist
- AI prompt instructions
- Capacity calculation logic
- Message formatting

**Advanced (modify workflows):**
- Add database logging for analytics
- Integrate with time tracking systems
- Build custom dashboards
- Add approval workflows

---

## Troubleshooting

**Webhook not triggering?**
- Check webhook is configured in PM system with correct URL
- Verify webhook events include "create" and "update"
- Use n8n Test URL first to capture sample payload

**AI recommendations seem off?**
- Review skills matrix for accuracy
- Check workload calculation is counting the right tasks
- Adjust AI prompt to emphasize different factors

**Slack buttons not working?**
- Verify Interactivity URL is set in Slack app settings
- Check n8n workflow 2 webhook is active
- Ensure button value parsing matches expected format

**For more:** See project-progress.md for detailed troubleshooting from original build

---

## Sharing This Project

Want to give this to a coworker or colleague?

1. Read **SHARE-WITH-COWORKER-checklist.md**
2. Share the entire folder (or minimal 3-file set)
3. Point them to **START-HERE-setup-guide.md**
4. The AI will guide them through customizing for their team

**Don't share:** Your actual API keys, tokens, or credentials

---

## Contributing

If you build this for your team and make improvements:

**Please consider sharing back:**
- Platform adapters (e.g., "Asana version", "ClickUp version")
- Prompt templates for different team types
- New features or workflow enhancements
- Bug fixes or edge case handling

**How to contribute:**
- Fork this repository (if on GitHub)
- Document your changes clearly
- Share via pull request or direct message

---

## Support

**This is a DIY project.** The AI-guided setup is designed to work independently.

**If you get stuck:**
1. Check the troubleshooting section in project-progress.md
2. Ask your AI assistant for help (it has context from the setup interview)
3. Review n8n documentation for node-specific issues
4. Search n8n community forums for similar problems

**No formal support is provided**, but the guides are comprehensive and the AI interview process is designed to handle most edge cases.

---

## License

This workflow system was created by **Danelle Wright** for the **WebFX Interactivities team**.

**You are free to:**
- ✅ Use this for your own team
- ✅ Modify and customize for your needs
- ✅ Share with colleagues and coworkers
- ✅ Build upon and extend with new features

**Please:**
- 🙏 Keep attribution intact when sharing
- 🙏 Share improvements back to the community
- 🙏 Give credit if you write/blog about it

**Not permitted:**
- ❌ Selling this as a product or service
- ❌ Removing attribution and claiming as your own work

---

## Version History

**v1.0 — March 5, 2026**
- Initial release with AI-guided setup interview
- 4 complete workflow guides (TeamworkFX + Slack)
- Interactive bot with capacity command
- Platform adaptation guidance for Asana, ClickUp, Jira, etc.

---

## Credits

**Created by:** Danelle Wright  
**For:** WebFX Interactivities Team  
**Built with:** n8n, OpenAI GPT-4o, Slack API, TeamworkFX MCP  
**Development period:** February-March 2026

**Special thanks to:**
- The WebFX team for being the guinea pigs
- OpenAI for GPT-4o API
- n8n community for workflow inspiration

---

## Questions?

**Read these first:**
- START-HERE-setup-guide.md — Quick start instructions
- ai-guided-setup-interview.md — What the AI will ask you
- SYSTEM-ARCHITECTURE-diagram.md — How it all fits together
- n8n-task-assignment-guides/00-overview.md — System overview

**Still stuck?** Use your AI assistant to interpret the guides for your specific situation.

---

**Ready to build?** Open START-HERE-setup-guide.md and choose your path!

🚀 **Let's automate some task assignments!** 🚀
