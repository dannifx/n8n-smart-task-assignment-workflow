# 🤖 AI-Guided Setup — Copy/Paste Prompts

**The easiest way to set up this workflow: Let AI guide you through everything!**

---

## Why Use AI Guidance?

✅ **Interview assistance** — AI asks questions one at a time, validates answers  
✅ **Step-by-step building** — Guides you node-by-node through n8n workflows  
✅ **Real-time troubleshooting** — Helps debug errors as they happen  
✅ **Customization help** — Adapts code samples to your team's data  
✅ **Testing guidance** — Walks through test checklists with you

**You don't need to figure this out alone!**

---

## 🎯 Choose Your Prompt Based on Your Platform

### Option 1: TeamworkFX Users (Fastest — 2-3 hours)

**Copy everything below and paste into Claude, ChatGPT, or your AI assistant:**

```
I want to set up the Smart Task Assignment Workflow for my TeamworkFX team.

CONTEXT:
I have the complete documentation in this folder, including:
- TEAMWORKFX-USERS-setup-guide.md (interview questions and setup checklist)
- n8n-task-assignment-guides/ folder (detailed workflow build instructions)
- All supporting documentation

YOUR ROLE:
You are my setup assistant. Guide me through the ENTIRE process from start to finish.

WHAT TO DO:

1. INTERVIEW PHASE:
   - Read TEAMWORKFX-USERS-setup-guide.md
   - Ask me the interview questions ONE SECTION AT A TIME
   - Sections: TeamworkFX Setup, Team Members, Slack Setup, OpenAI Setup, 
     Task Types, Workload Calculation, AI Assignment Preferences
   - After I answer each section, validate my responses
   - Ask clarifying questions if anything is unclear
   - Keep track of all my answers

2. PREPARATION PHASE:
   - Help me gather any IDs or credentials I'm missing
   - Review the Prerequisites checklist with me
   - Make sure I have everything before we start building

3. BUILD PHASE:
   - Guide me through building Workflow 1 (New Task Notification)
     - Read n8n-task-assignment-guides/01-workflow1-new-task-notification.md
     - Walk me through each node, ONE AT A TIME
     - Wait for me to confirm each node is added before moving to next
     - Help me customize the code with MY team's data
   - Guide me through testing Workflow 1 thoroughly
   - ONLY move to Workflow 2 after Workflow 1 is tested and working
   - Repeat this process for Workflows 2, 3, and 4

4. TESTING PHASE:
   - Guide me through each testing checklist
   - Help troubleshoot any errors
   - Make sure everything works before we finish

5. GO-LIVE PHASE:
   - Help me announce it to my team
   - Review maintenance tasks

IMPORTANT RULES:
- Only ask questions from ONE section at a time, then WAIT for my answers
- Only guide me through ONE node at a time, then WAIT for confirmation
- If I encounter an error, help me debug it before moving on
- Be patient and thorough - don't rush through steps
- Remind me to test after each workflow is built

Let's start! Ask me the questions from the FIRST section of the interview 
(TeamworkFX Setup) and wait for my answers.
```

---

### Option 2: Other Platforms (Asana, ClickUp, Jira, etc. — 3-5 hours)

**Copy everything below and paste into Claude, ChatGPT, or your AI assistant:**

```
I want to set up the Smart Task Assignment Workflow for my team.

CONTEXT:
I'm using [YOUR PLATFORM NAME HERE - e.g., Asana, ClickUp, Jira, Monday.com] 
for project management.

I have the complete documentation including:
- ai-guided-setup-interview.md (comprehensive interview for all platforms)
- n8n-task-assignment-guides/ folder (reference implementation for TeamworkFX)
- All supporting documentation

YOUR ROLE:
You are my setup assistant. You'll adapt this TeamworkFX workflow to MY 
platform and team, then guide me through building it.

WHAT TO DO:

1. INTERVIEW PHASE (30-45 minutes):
   - Read ai-guided-setup-interview.md completely
   - Conduct the interview with me section by section (10 sections total)
   - Be conversational - don't make it feel like filling out a form
   - Validate my answers as we go
   - Ask clarifying follow-up questions when needed
   - Keep track of all my configuration details

   SECTIONS TO COVER:
   1. Project Management System (my platform's API, authentication)
   2. Workflow Trigger Configuration (webhooks or polling)
   3. Task Data Fields (field mappings for my platform)
   4. Team Configuration (my team members, IDs, workload settings)
   5. Team Skills & Expertise (skills matrix)
   6. Slack/Teams/Email Integration (notification platform)
   7. AI Model Configuration (OpenAI/Claude/Gemini)
   8. Assignment Workflow Preferences (auto-assign behavior)
   9. Error Handling & Edge Cases (what happens when...)
   10. Testing & Validation (sandbox environment, rollout plan)

2. CONFIGURATION SUMMARY:
   - After completing all 10 sections, generate a Configuration Summary 
     document with all my answers organized
   - Show me the summary and ask if anything needs correction

3. ADAPTATION PHASE:
   - Read the TeamworkFX guides in n8n-task-assignment-guides/
   - Create CUSTOMIZED guides adapted to MY platform:
     - Replace TeamworkFX API calls with MY platform's API
     - Update field paths to match MY platform's data structure
     - Adjust authentication to MY platform's method
     - Adapt webhook/polling to MY platform's capabilities
   - Show me the key differences and customizations

4. BUILD PHASE:
   - Guide me through building each workflow ONE NODE AT A TIME
   - For each node:
     - Explain what it does
     - Show me the customized code/configuration for MY platform
     - Wait for me to add it in n8n
     - Ask me to confirm before moving to next node
   - Help me test each workflow thoroughly before moving to the next

5. TROUBLESHOOTING:
   - When errors occur, help me debug
   - Update guides with fixes we discover
   - Document platform-specific quirks

6. GO-LIVE:
   - Guide me through final testing
   - Help me train my team
   - Review maintenance procedures

IMPORTANT RULES:
- Only work on ONE section/node at a time
- ALWAYS wait for my response before continuing
- Be patient and thorough
- If my platform doesn't support something, suggest alternatives
- Keep me updated on progress (e.g., "We're 3/10 through the interview")

Let's start! Ask me the questions from Section 1: Project Management System, 
and wait for my answers before moving on.
```

---

## 🎓 How This Works

### Step 1: Copy the Prompt
Choose the prompt above that matches your situation (TeamworkFX or Other Platform)

### Step 2: Paste into AI Assistant
Open Claude, ChatGPT, or your preferred AI assistant and paste the entire prompt

### Step 3: Answer Questions
The AI will ask questions one section at a time. Answer them based on your team's setup.

### Step 4: Build Together
The AI will guide you through building each workflow, node by node, in n8n.

### Step 5: Test Together
The AI will walk you through testing checklists to make sure everything works.

### Step 6: Go Live!
The AI helps you announce to your team and set up maintenance procedures.

---

## 💡 Tips for Best Results

**✅ DO:**
- Answer questions thoroughly — more detail = better customization
- Ask the AI to clarify if you don't understand something
- Tell the AI when you encounter errors — it will help debug
- Test each workflow before moving to the next
- Take breaks between workflows (you can resume later)

**❌ DON'T:**
- Rush through the interview — take time to get your answers right
- Skip testing phases — catch problems early
- Move to the next node before confirming the current one works
- Hesitate to ask the AI for help or clarification

---

## 📋 What You'll Need Before Starting

Have these ready (or the AI will help you gather them):

**For TeamworkFX Users:**
- [ ] TeamworkFX MCP API key (or TeamworkFX API token)
- [ ] Slack workspace with admin access (or bot token if app already exists)
- [ ] OpenAI API key (or Anthropic/Google key)
- [ ] n8n account (Cloud or self-hosted)
- [ ] List of team members who will be included
- [ ] Project ID and List ID where new tasks arrive

**For Other Platform Users:**
- [ ] API documentation for your platform (or just the platform name)
- [ ] API credentials for your platform
- [ ] Notification platform access (Slack/Teams/Email)
- [ ] OpenAI/Anthropic/Google API key
- [ ] n8n account
- [ ] List of team members
- [ ] Understanding of your task workflow (where do new tasks go?)

**Don't worry if you don't have everything yet** — the AI will help you figure out what you need and where to get it!

---

## ⏱️ Time Expectations

**TeamworkFX Users (with AI guidance):**
- Interview: 20-30 minutes
- Building Workflow 1: 30 minutes
- Building Workflow 2: 60 minutes
- Building Workflow 3: 20 minutes
- Building Workflow 4: 30 minutes
- Testing: 30 minutes
- **Total: 2-3 hours** (can split across multiple sessions)

**Other Platforms (with AI guidance):**
- Interview: 30-45 minutes
- AI adaptation: 15-30 minutes
- Building all workflows: 2-3 hours
- Testing: 30-60 minutes
- **Total: 3-5 hours** (can split across multiple sessions)

---

## 🔄 Resuming After a Break

If you need to take a break and come back later, just tell your AI:

```
I need to take a break. When I return, can you summarize where we left off 
and what we need to do next?
```

When you return:
```
I'm back! Can you remind me where we were and what's next?
```

The AI will recap your progress and continue from where you stopped.

---

## 🆘 If You Get Stuck

If something isn't working or you're confused:

1. **Tell the AI immediately:** "I'm getting an error..." or "I don't understand..."
2. **Share the error message:** Copy/paste any error messages from n8n
3. **Describe what you see:** "The node shows..." or "When I test it..."
4. **Ask for alternatives:** "Is there another way to do this?"

The AI can:
- Debug errors with you
- Explain concepts in different ways
- Suggest workarounds
- Point you to relevant documentation
- Simplify complex steps

**Don't struggle alone — that's what the AI is there for!**

---

## 🎯 Success Indicators

You'll know you're on the right track when:

✅ The AI asks questions one at a time and waits for your answers  
✅ You feel confident about what each node does  
✅ Workflows execute successfully in n8n  
✅ Test tasks trigger the expected notifications  
✅ AI recommendations make sense for your team  
✅ You understand how to maintain and update the system

---

## 📚 Additional Resources

While the AI is guiding you, you can also reference:

- **QUICK-REFERENCE-card.md** — One-page cheat sheet for quick lookups
- **WHICH-FILE-DO-I-NEED.md** — Navigate the documentation
- **SYSTEM-ARCHITECTURE-diagram.md** — Understand how components connect
- **n8n-task-assignment-guides/** — Detailed node-by-node instructions

The AI can reference these files too if needed!

---

## 🤝 Community Support

After you get it working:

- Share your experience (what worked, what was confusing)
- Contribute improvements back to the project
- Help others who are setting it up
- Report bugs or edge cases you discover

---

## 🚀 Ready to Start?

1. **Choose your prompt above** (TeamworkFX or Other Platform)
2. **Copy the entire prompt**
3. **Open your AI assistant** (Claude, ChatGPT, etc.)
4. **Paste and press Enter**
5. **Let the AI guide you through everything!**

**You've got this!** The AI will walk you through every step. 🎉

---

## 📝 Example of How It Works

**You paste the prompt into Claude/ChatGPT:**

**AI responds:**
> Great! Let's get started on setting up your Smart Task Assignment Workflow.
> 
> I've read the setup guide. Let's begin with Section 1: Your TeamworkFX Setup.
> 
> **Question 1:** What's your TeamworkFX installation URL?
> (Example: https://yourcompany.teamwork.com or https://app.webfx.com)

**You answer:**
> Our URL is https://webfx.teamwork.com

**AI responds:**
> Perfect! 
> 
> **Question 2:** Do you have access to TeamworkFX MCP (Model Context Protocol)?
> If yes, what's your MCP API key? If no, do you have a TeamworkFX API token instead?

**...and so on through the entire process!**

The AI keeps track of everything and guides you step-by-step.

---

**Ready? Copy your prompt and let's go!** 🚀
