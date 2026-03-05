# 🤔 Which File Do I Need?

**Quick decision tree to find the right file for your situation**

---

## Start Here: What Do You Want To Do?

### 🤖 "I want to set this up (ANY PLATFORM)" ⭐ EASIEST WAY

→ Open **AI-GUIDED-SETUP-prompts.md**

→ Copy the prompt for your platform (TeamworkFX or Other)

→ Paste into Claude/ChatGPT

→ Let AI guide you through EVERYTHING (interview + building + testing)

**Time needed:** 2-3 hours (TeamworkFX) or 3-5 hours (other platforms)

**Why this is best:** AI walks you through step-by-step, validates answers, troubleshoots with you, and you never get stuck!

---

### 📖 "I want to understand what this system does first"

→ Read **README.md** (5 min overview)

Then optionally: **SYSTEM-ARCHITECTURE-diagram.md** (deep dive)

---

### 📋 "I want to do it manually without AI help"

**For TeamworkFX:**
→ Read **TEAMWORKFX-USERS-setup-guide.md** (manual setup)

→ Keep **QUICK-REFERENCE-card.md** handy

**For other platforms:**
→ Read **ai-guided-setup-interview.md** to understand what's needed

→ Read **n8n-task-assignment-guides/** to see how to build

**Time needed:** 3-6 hours (more trial and error without AI help)

---

### 📤 "I want to share this with a coworker"

→ Read **SHARE-WITH-COWORKER-checklist.md**

**It tells you:**
- Which files to send them
- What message template to use
- What they'll need before starting

**Time needed:** 5 min to prepare + share

---

### 🏗️ "I want to understand how the workflows work"

→ Read **SYSTEM-ARCHITECTURE-diagram.md**

**Shows you:**
- High-level flow
- Data structures
- How components connect
- Performance characteristics

**Time needed:** 15-20 min

---

### 📋 "I'm in the middle of building and need quick reference"

→ Use **QUICK-REFERENCE-card.md**

**Has:**
- Common issues & fixes
- Customization cheat sheet
- Testing checklist
- Bot commands
- File locations

**Print this or keep it open in another tab**

---

### 👥 "I need to train my team on how to use the bot"

→ Give them **interactive-task-assignment-bot-guide.md**

**End-user documentation with:**
- How notifications work
- How to get AI recommendations
- Bot commands
- Pro tips

**Time needed:** 5 min to read, lifetime of use

---

### 🔍 "I need the detailed workflow build instructions"

→ Open the **n8n-task-assignment-guides/** folder

**Then read:**
- `00-overview.md` — System overview and prerequisites
- `01-workflow1-new-task-notification.md` — Build Workflow 1
- `02-workflow2-ai-analysis.md` — Build Workflow 2
- `03-workflow3-auto-assignment.md` — Build Workflow 3
- `04-workflow4-interactive-bot.md` — Build Workflow 4

**These have:**
- Node-by-node instructions
- Copy/paste code for every Code node
- Testing checklists

---

### 📊 "I want to see what was created (summary)"

→ Read **SETUP-COMPLETE-summary.md**

**Explains:**
- All files created
- How they work together
- Two setup paths
- What makes this shareable
- How to share with coworkers

**Time needed:** 10 min

---

### ✅ "I finished setup, what's next?"

1. Test thoroughly (use checklists in workflow guides)
2. Train your team (give them interactive-task-assignment-bot-guide.md)
3. Monitor first week (tune settings as needed)
4. Share improvements back (optional)

---

## File Dependency Map

```
START HERE
    │
    ├─→ [Want overview?]
    │   └─→ README.md
    │       └─→ SYSTEM-ARCHITECTURE-diagram.md (optional deep dive)
    │
    ├─→ [Setting up for TeamworkFX?]
    │   └─→ START-HERE-setup-guide.md
    │       └─→ TEAMWORKFX-USERS-setup-guide.md
    │           ├─→ QUICK-REFERENCE-card.md (during build)
    │           └─→ n8n-task-assignment-guides/ (detailed instructions)
    │
    ├─→ [Setting up for other platform?]
    │   └─→ START-HERE-setup-guide.md
    │       └─→ AGENT-PROMPT-copy-paste-this.md
    │           └─→ [AI reads] ai-guided-setup-interview.md
    │               └─→ QUICK-REFERENCE-card.md (during build)
    │
    ├─→ [Sharing with coworker?]
    │   └─→ SHARE-WITH-COWORKER-checklist.md
    │
    └─→ [Training team on bot?]
        └─→ interactive-task-assignment-bot-guide.md
```

---

## Files by Role

### 👤 If You're Setting Up (First Time)

**Read first:**
1. README.md (understand what it does)
2. START-HERE-setup-guide.md (choose your path)

**Then use:**
- TEAMWORKFX-USERS-setup-guide.md (if TeamworkFX)
- OR AGENT-PROMPT-copy-paste-this.md (if other platform)

**Keep handy:**
- QUICK-REFERENCE-card.md

**For details:**
- n8n-task-assignment-guides/ folder

---

### 📤 If You're Sharing With Someone

**Read:**
- SHARE-WITH-COWORKER-checklist.md

**Send them:**
- START-HERE-setup-guide.md (entry point)
- TEAMWORKFX-USERS-setup-guide.md (if they use TeamworkFX)
- OR full package (if they use other platform)

---

### 👥 If You're an End User (Team Member)

**Read:**
- interactive-task-assignment-bot-guide.md

**That's it!** You don't need the setup files.

---

### 🤖 If You're an AI Assistant Helping Someone

**Read:**
- ai-guided-setup-interview.md (if they use other platform)
- OR guide them through TEAMWORKFX-USERS-setup-guide.md (if TeamworkFX)

**Reference:**
- n8n-task-assignment-guides/ for detailed implementation
- SYSTEM-ARCHITECTURE-diagram.md for architecture questions

---

## Quick Answers to Common Questions

**Q: "Where do I start?"**  
A: START-HERE-setup-guide.md

**Q: "Which setup path should I use?"**  
A: TeamworkFX users → Path 1 (TEAMWORKFX-USERS-setup-guide.md)  
    Other platforms → Path 2 (AGENT-PROMPT-copy-paste-this.md)

**Q: "How do I share this?"**  
A: SHARE-WITH-COWORKER-checklist.md

**Q: "Where's the code?"**  
A: n8n-task-assignment-guides/ folder (each guide has copy/paste code)

**Q: "How does it work?"**  
A: SYSTEM-ARCHITECTURE-diagram.md

**Q: "What do I do if I get stuck?"**  
A: QUICK-REFERENCE-card.md (common issues section)

**Q: "How do I train my team?"**  
A: Share interactive-task-assignment-bot-guide.md with them

**Q: "Can I customize it?"**  
A: Yes! QUICK-REFERENCE-card.md has customization cheat sheet

**Q: "What if my platform is different?"**  
A: Use AGENT-PROMPT-copy-paste-this.md to start AI-guided setup

**Q: "How long will this take?"**  
A: 2-3 hours (TeamworkFX) or 3-5 hours (other platforms)

---

## Summary Table

| I Want To... | Use This File | Time |
|-------------|---------------|------|
| Understand the system | README.md | 5 min |
| Set up (TeamworkFX) | TEAMWORKFX-USERS-setup-guide.md | 2-3 hours |
| Set up (other platform) | AGENT-PROMPT-copy-paste-this.md | 3-5 hours |
| Share with coworker | SHARE-WITH-COWORKER-checklist.md | 5 min |
| See architecture | SYSTEM-ARCHITECTURE-diagram.md | 15 min |
| Quick reference during build | QUICK-REFERENCE-card.md | As needed |
| Train my team | interactive-task-assignment-bot-guide.md | 5 min |
| Build workflows (detailed) | n8n-task-assignment-guides/ | 2-3 hours |
| See what was created | SETUP-COMPLETE-summary.md | 10 min |

---

**Still not sure?** Start with **README.md** — it will point you in the right direction!
