# 🤖 Interactive Task Assignment Bot — User Guide

Welcome to the **#interactive-task-assignment** channel! This is your command center for getting AI-powered task recommendations, checking team capacity, and assigning work intelligently.

---

## 📍 What This Channel Does

When a new interactive request lands in TeamworkFX, you'll get an instant notification here with all the key details. From there, you can:

- ✨ **Get AI recommendations** on who should handle the task
- 📊 **Check team capacity** to see who's available
- ✅ **Auto-assign tasks** with one click
- 🔄 **Override assignments** if the AI got it wrong

No more guessing. No more manually checking everyone's workload. Just smart, data-driven task routing.

---

## 🔔 How Notifications Work

Every time a task is added to the **"📥 New Interactive Requests"** list in TeamworkFX, you'll see a message like this:

> **🆕 New Interactive Request**
> 
> **Task:** Build an ROI calculator for HVAC services  
> **Channel:** Development  
> **Priority:** 🔥 High  
> **Due Date:** Mar 15, 2026  
> **Estimated Hours:** 8h  
> **POC:** Danelle Wright  
> **Brand:** climatecontrolexperts.com
> 
> [**Analyze & Recommend**] [**Open Task in TWFX**]

**What you can do:**

- Click **"Analyze & Recommend"** to get an AI-powered assignment recommendation
- Click **"Open Task in TWFX"** to view the full task details and assign manually

---

## 🧠 Getting AI Recommendations

Click the **"Analyze & Recommend"** button on any task notification, and the bot will:

1. 🔍 Pull the full task details from TeamworkFX
2. 📊 Query everyone's current workload (next 2 weeks)
3. 🤖 Run a GPT-4o analysis based on:
   - Task type (Design vs Development)
   - Task complexity and requirements
   - Team members' skills and expertise
   - Everyone's current capacity
   - Priority weighting (Urgent/High tasks count more than Low priority)
4. 💬 Reply in the thread with a recommendation

**Example AI Response:**

> **Assignment Recommendation**
> 
> **SUGGESTED ASSIGNEE:** Erron
> 
> **Reasoning:**
> Erron is the best fit for this calculator tool. He's an expert in tools development and interactive components, has strong CSS/styling skills so he can handle it without a designer, and currently has the most availability on the dev team at 34h available (43% utilized).
> 
> **TEAM CAPACITY (Next 2 Weeks):**
> Giancarlo: 44h available (45% utilized)  
> Sid: 28h available (65% utilized)  
> !! Erron: 34h available (43% utilized)  
> Edmund: 52h available (35% utilized)  
> Jesslyn: 60h available (25% utilized)  
> Elika: 48h available (40% utilized)
> 
> **Timeline:** Should be completable within the 2-week deadline given 8h estimate and Erron's current workload.
> 
> [**Auto-Assign to Erron**] [**Open Task in TWFX**]

---

## ✅ Auto-Assigning Tasks

If you agree with the AI's recommendation, just click **"Auto-Assign to [Name]"**. The bot will:

1. ✅ Move the task to the assignee's **"New Tasks"** list in their personal project
2. 👤 Assign it to them in TeamworkFX
3. 💬 Post a confirmation message

**Example Confirmation:**

> ✅ **Task Assigned**
> 
> **"Build an ROI calculator for HVAC services"** has been assigned to **Erron**.
> 
> The task has been moved to Erron's New Tasks list in TeamworkFX.
> 
> [**Open Task in TWFX**]

---

## 🔄 Overriding the AI (Thread Assignment)

If you want to assign the task to someone else, just reply in the thread and @mention the bot:

```
@TaskAssignmentBot assign to Giancarlo
```

The bot will move and assign the task, then confirm:

> ✅ **Task Assigned**
> 
> **"Build an ROI calculator for HVAC services"** has been assigned to **Giancarlo**.

**Valid names:**
- Giancarlo
- Sid
- Erron
- Edmund
- Jesslyn
- Elika

---

## 📊 Checking Team Capacity

Want to see who's swamped and who's free? Just @mention the bot anywhere in the channel:

```
@TaskAssignmentBot team capacity
```

You'll get a beautifully formatted overview like this:

> **📊 Team Capacity Overview**
> 
> *Next 2 weeks · 80h capacity per person · Updated Tuesday, Mar 3*
> 
> **👨‍💻 Developers**
> 
> 🟢 **Giancarlo** — Lead Full-Stack Developer  
> `▓▓▓▓░░░░░░` 45% utilized  
> **44h** available of 80h · 12 active tasks
> 
> 🟡 **Sid** — Front-End Developer  
> `▓▓▓▓▓▓░░░░` 65% utilized  
> **28h** available of 80h · 18 active tasks
> 
> 🟢 **Erron** — Full-Stack Developer  
> `▓▓▓▓░░░░░░` 43% utilized  
> **34h** available of 80h · 10 active tasks
> 
> 🟢 **Edmund** — Backend Developer  
> `▓▓▓░░░░░░░` 35% utilized  
> **52h** available of 80h · 8 active tasks
> 
> ---
> 
> **🎨 Designers**
> 
> 🟢 **Jesslyn** — Lead Graphic, Web & Product Designer  
> `▓▓░░░░░░░░` 25% utilized  
> **60h** available of 80h · 6 active tasks
> 
> 🟢 **Elika** — Web & Graphic Designer  
> `▓▓▓▓░░░░░░` 40% utilized  
> **48h** available of 80h · 9 active tasks
> 
> ---
> 
> **Team Total:** 266h available of 480h (45% utilized)  
> 🟢 **Most available:** Edmund (52h), Jesslyn (60h), Elika (48h)

**Status indicators:**
- 🟢 Low utilization (< 60%) — plenty of availability
- 🟡 Medium utilization (60–79%) — getting busy
- 🔴 High utilization (80%+) — at capacity

**Other ways to ask:**
- `@bot workload`
- `@bot who's available`
- `@bot bandwidth`
- `@bot current capacity`

---

## 🔍 On-Demand Task Analysis

Already have a task in TeamworkFX and want to get a recommendation? Just @mention the bot with the task URL:

```
@TaskAssignmentBot https://app.webfx.com/projects/15004754/tasks/123456
```

The bot will run the full analysis and reply with a recommendation, just like clicking "Analyze & Recommend" on a notification.

---

## 🤔 Getting Help

If the bot doesn't understand your message, it'll reply with a help menu:

> I didn't understand that. Here's what I can do:
> 
> 📊 **Check capacity:** `@bot team capacity`  
> 🔍 **Analyze a task:** `@bot [TWFX task URL]`  
> ✅ **Assign from thread:** `@bot assign to [Name]`

---

## 💡 Pro Tips

✅ **Trust the AI, but verify** — The bot considers skills, workload, and task type, but you know your team best. Override when needed.

✅ **Check capacity before planning sprints** — Use `@bot team capacity` at the start of each week to see who can take on more work.

✅ **Use thread assignments for quick fixes** — If a task comes in and you already know who should handle it, just reply `@bot assign to [Name]` instead of opening TeamworkFX.

✅ **Priority matters** — The bot weights Urgent/High tasks at 100%, Medium at 75%, and Low at 50%. This means someone with 40h of low-priority work might be more available than someone with 20h of urgent work.

✅ **Estimated hours drive recommendations** — Make sure tasks have estimated hours in TeamworkFX for accurate capacity calculations.

---

## 🛠️ Behind the Scenes

The bot is powered by:
- **TeamworkFX MCP** — Pulls task data and workload in real-time
- **GPT-4o** — Analyzes tasks and matches them to team members based on skills and capacity
- **n8n workflows** — Orchestrates everything automatically

**Workload calculation:**
- Looks at the next **2 weeks** (80h capacity per person)
- Only counts tasks on **active lists** (Mon–Fri daily lists, Next Week, This Week, New Tasks, Larger/Cycle Projects)
- Filters out **header/divider items** (tasks with no assignee)
- Applies **priority weighting** (Urgent/High = 100%, Medium = 75%, Low = 50%)

---

## 🎯 Quick Command Reference

| What You Want | What To Type |
|---------------|--------------|
| Check team capacity | `@bot team capacity` |
| Analyze a specific task | `@bot [TWFX task URL]` |
| Assign from a thread | `@bot assign to [Name]` |
| Get help | `@bot help` (or anything else) |

---

## 🙋 Questions or Issues?

If the bot isn't working as expected or you have ideas for improvements, ping Danelle in Slack or drop a message in this channel.

Happy assigning! 🚀
