# 📋 Quick Reference Card — Smart Task Assignment Workflow

**Print this or keep it handy during setup**

---

## 🎯 Setup Paths

| Goal | Start Here | Time |
|------|------------|------|
| **Get AI to guide me** 🤖 ⭐ EASIEST | Copy prompt from `AI-GUIDED-SETUP-prompts.md` | 2-5 hours |
| **TeamworkFX (manual)** | Open `TEAMWORKFX-USERS-setup-guide.md` | 3-4 hours |
| **Other platform (manual)** | Read `ai-guided-setup-interview.md` | 4-6 hours |
| **Share with coworker** | Give them `AI-GUIDED-SETUP-prompts.md` + folder | n/a |
| **Understand architecture** | Read `SYSTEM-ARCHITECTURE-diagram.md` | 15 min |

---

## 🔑 Required Credentials

| Service | Type | Where to Get | What It's For |
|---------|------|--------------|---------------|
| **PM System** | API Key or MCP | System settings or admin | Fetch tasks, assign tasks |
| **AI Provider** | API Key | OpenAI/Anthropic/Google | Generate recommendations |
| **Slack** | Bot Token | api.slack.com → Your App | Post messages, buttons |
| **n8n** | Account | n8n.io (cloud) or self-hosted | Run workflows |

---

## 📊 Four Workflows

| # | Name | What It Does | Triggered By |
|---|------|--------------|--------------|
| **1** | Notification | Post Slack alert when task arrives | PM system webhook |
| **2** | AI Analysis | Recommend assignee based on workload + skills | "Analyze" button click |
| **3** | Auto-Assign | Move and assign task in one click | "Auto-Assign" button click |
| **4** | Interactive Bot | Respond to @mentions in Slack | Slack @mention |

---

## 🤖 Bot Commands (Workflow 4)

| Command | What It Does | Example |
|---------|--------------|---------|
| `@bot team capacity` | Show workload for all members | "@TaskBot team capacity" |
| `@bot [task URL]` | Analyze specific task on-demand | "@TaskBot https://app.asana.com/0/123/456" |
| `@bot assign to [Name]` | Override AI recommendation (in thread) | "@TaskBot assign to Giancarlo" |
| `@bot help` | Show available commands | "@TaskBot help" |

---

## ⏱️ Time Estimates

| Phase | Time Required | Can Be Split? |
|-------|---------------|---------------|
| AI Interview | 30-45 min | ✅ Yes (by section) |
| Credential Setup | 15-30 min | ✅ Yes |
| Build Workflow 1 | 20-30 min | ⚠️ Better to finish |
| Build Workflow 2 | 45-60 min | ✅ Yes (by node group) |
| Build Workflow 3 | 15-20 min | ⚠️ Better to finish |
| Build Workflow 4 | 20-30 min | ✅ Yes (by feature) |
| Testing | 30-60 min | ✅ Yes |
| **TOTAL** | **3-5 hours** | ✅ Can do over days |

---

## 🔧 Customization Cheat Sheet

| What to Change | Where to Find It | Difficulty |
|----------------|------------------|------------|
| Team member list | Code nodes in Workflow 2 & 4 | 🟢 Easy |
| Skills matrix | Code: Build OpenAI Prompt | 🟢 Easy |
| Slack channel | Workflow 1, Node 5 | 🟢 Easy |
| Workload time window | Code: Calculate Workload | 🟡 Medium |
| Priority weighting | Code: Calculate Workload | 🟡 Medium |
| Active list names | Code: Calculate Workload | 🟡 Medium |
| AI prompt instructions | Code: Build OpenAI Prompt | 🟡 Medium |
| Add new bot command | Workflow 4 routing logic | 🔴 Advanced |

---

## 🚨 Common Issues & Fixes

| Problem | Check This | Fix |
|---------|------------|-----|
| Webhook not firing | PM system webhook config | Use Production URL, enable create+update events |
| Wrong field paths | n8n workflow output inspection | Update expressions with correct paths |
| Duplicate notifications | Filter node in Workflow 1 | Verify `todolistId` comparison logic |
| AI recommendation off | Skills matrix accuracy | Update team skills, check workload calc |
| Slack buttons not working | Slack app Interactivity URL | Set to Workflow 2 webhook URL |
| "Rate limit" error | API call frequency | Add delay between loop iterations |

---

## 📁 File Roadmap

```
📦 Smart Task Assignment Workflow/
│
├── 🤖 AI-GUIDED-SETUP-prompts.md ← ⭐ START HERE! Copy/paste AI prompts
├── 🎯 START-HERE-setup-guide.md ← Overview and paths
├── 📋 TEAMWORKFX-USERS-setup-guide.md ← TeamworkFX interview questions
├── 📋 ai-guided-setup-interview.md ← Other platforms interview
├── 📋 AGENT-PROMPT-copy-paste-this.md ← Alternative AI prompt
├── 📤 SHARE-WITH-COWORKER-checklist.md ← How to share
├── 🏗️ SYSTEM-ARCHITECTURE-diagram.md ← Visual architecture
├── 📖 interactive-task-assignment-bot-guide.md ← End-user docs
├── 📄 README.md ← Project overview
├── 📋 QUICK-REFERENCE-card.md ← THIS FILE
├── 🗂️ WHICH-FILE-DO-I-NEED.md ← Navigation help
│
└── 📂 n8n-task-assignment-guides/
    ├── 00-overview.md ← System overview
    ├── 00-phase0-mcp-test.md ← Test MCP connection
    ├── 01-workflow1-new-task-notification.md
    ├── 02-workflow2-ai-analysis.md
    ├── 03-workflow3-auto-assignment.md
    ├── 04-workflow4-interactive-bot.md
    └── project-progress.md ← Session log with lessons learned
```

---

## 🎓 Interview Sections (10 total)

| # | Section | Key Info to Gather |
|---|---------|-------------------|
| **1** | Project Management System | System name, API/MCP, auth type |
| **2** | Workflow Trigger Config | Webhook vs polling, events, target list |
| **3** | Task Data Fields | Essential fields, category/priority mapping |
| **4** | Team Configuration | Member names, roles, IDs, workload settings |
| **5** | Team Skills & Expertise | Skills list, proficiency levels, hard rules |
| **6** | Slack Integration | Platform choice, channel, desired features |
| **7** | AI Model Config | Provider, model, API key, considerations |
| **8** | Assignment Workflow Prefs | Auto-assign mode, actions on assignment |
| **9** | Error Handling | Edge case decisions (no capacity, no skills, etc.) |
| **10** | Testing & Validation | Sandbox env, test users, rollout plan |

---

## 📊 Workload Calculation Formula

```
FOR EACH team member:
  1. Query ALL tasks in their project
  2. Filter: Keep only tasks on ACTIVE lists
  3. Filter: Daily lists always count; others only if due ≤ 2 weeks
  4. Filter: Remove headers/dividers (no assignee)
  5. Apply priority weighting:
     • High/Urgent = 1.0x
     • Medium = 0.75x
     • Low/None = 0.5x
  6. Sum: Total Hours = Σ(estimatedHours × weight)
  7. Calculate: Available = 80h - Total Hours
  8. Calculate: Utilization = Total Hours / 80h

RESULT: { name, totalHours, availableHours, utilizationPct, taskCount }
```

---

## 🔄 Data Flow Summary

```
1. TASK CREATED
   └─> PM System Webhook
       └─> Workflow 1: Notification
           └─> Slack Message Posted

2. USER CLICKS "ANALYZE"
   └─> Slack Interactivity Webhook
       └─> Workflow 2: AI Analysis
           ├─> Get task details
           ├─> Query workload (all members)
           ├─> Calculate capacity
           ├─> Call GPT-4o
           └─> Post recommendation + button

3. USER CLICKS "AUTO-ASSIGN"
   └─> Slack Interactivity Webhook
       └─> Workflow 3: Auto-Assign
           ├─> Move task to member's project
           ├─> Assign task to member
           └─> Post confirmation

4. USER @MENTIONS BOT
   └─> Slack Events Webhook
       └─> Workflow 4: Interactive Bot
           ├─> Parse intent (capacity/URL/assign)
           ├─> Route to appropriate logic
           └─> Post reply in thread
```

---

## 🧪 Testing Checklist

After building each workflow:

**Workflow 1:**
- [ ] Create task in target list → notification appears
- [ ] Edit task description → no new notification
- [ ] Move task into target list → notification appears
- [ ] Buttons render and are clickable

**Workflow 2:**
- [ ] Click "Analyze" button → loading indicator (or message update)
- [ ] AI response appears in thread
- [ ] Workload numbers look accurate
- [ ] Recommended assignee makes sense
- [ ] "Auto-Assign" button appears with correct name

**Workflow 3:**
- [ ] Click "Auto-Assign" → confirmation appears
- [ ] Task moved to correct project/list in PM system
- [ ] Task assigned to correct user
- [ ] Open task link works

**Workflow 4:**
- [ ] `@bot team capacity` → capacity report appears
- [ ] `@bot [task URL]` → analysis appears (same as Workflow 2)
- [ ] `@bot assign to [Name]` → task assigned + confirmation
- [ ] `@bot random text` → help menu appears

---

## 💾 Backup & Version Control

**Before making changes:**
- [ ] Export workflows as JSON from n8n
- [ ] Save to local folder or Git repo
- [ ] Document what you're changing and why

**After successful changes:**
- [ ] Update customized guides with new field paths
- [ ] Export updated workflows
- [ ] Commit to version control

---

## 📞 Support Resources

| Need | Resource |
|------|----------|
| **Understanding the system** | README.md, SYSTEM-ARCHITECTURE-diagram.md |
| **Setup help** | START-HERE-setup-guide.md, ai-guided-setup-interview.md |
| **Troubleshooting** | project-progress.md (search for error messages) |
| **n8n node help** | n8n.io/docs |
| **Slack API help** | api.slack.com/docs |
| **AI prompt help** | Ask your AI assistant to refine prompts |

---

## ✅ Success Criteria

You're done when:
- [ ] New tasks trigger Slack notifications
- [ ] "Analyze" button returns AI recommendations
- [ ] Workload numbers match reality (spot-check)
- [ ] "Auto-Assign" moves and assigns tasks correctly
- [ ] @bot commands work in Slack
- [ ] Team is trained on how to use the bot
- [ ] You've updated the skills matrix for your team
- [ ] Test tasks went through smoothly

---

## 🎯 Week 1 Monitoring

After going live:
- [ ] Watch the first 10-20 assignments closely
- [ ] Check if AI recommendations make sense
- [ ] Note any patterns (always reassigned, certain people ignored)
- [ ] Gather team feedback
- [ ] Adjust skills matrix if needed
- [ ] Fine-tune workload settings if utilization seems off

---

## 🚀 Next Steps After Setup

**Week 1:** Monitor closely, gather feedback, tune settings

**Week 2-4:** Optimize AI prompt, adjust priority weights, update skills

**Month 2+:** Maintain team roster, track time savings, add features

**Optional enhancements:**
- Log assignments to database for analytics
- Add workload forecasting
- Build capacity dashboards
- Integrate with time tracking
- Add client/project affinity
- Automate status updates

---

## 📏 ROI Calculator

**Time saved per task:** 5-15 minutes (avg 10 min)

**Tasks assigned per week:** _____ (fill in for your team)

**Weekly time saved:** _____ tasks × 10 min = _____ hours

**Annual time saved:** _____ hours × 50 weeks = _____ hours/year

**Setup time investment:** 4 hours

**Payback period:** 4 hours ÷ _____ hours/week = _____ weeks

---

**Print this card and keep it by your desk during setup!**

**Questions?** Start with START-HERE-setup-guide.md
