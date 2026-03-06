// ============================================================
// WORKFLOW 4 — Code Node: Build Team Capacity Slack Message
//
// Builds a nicely formatted Slack Block Kit message showing
// every team member's workload, available hours, and task count.
// Grouped by Developers and Designers.
//
// INPUT: workloadSummary array from Calculate Workload node
//        + channelId, threadTs from the original bot mention
//
// OUTPUT: slackBlocks (JSON string) and slackText (fallback)
// ============================================================

const data = $input.first().json;
const workloadSummary = data.workloadSummary || [];
const channelId = data.channelId;
const threadTs = data.threadTs;

// Split into developers and designers
const developers = workloadSummary.filter(m =>
  m.role.toLowerCase().includes('developer') ||
  m.role.toLowerCase().includes('full-stack') ||
  m.role.toLowerCase().includes('front-end') ||
  m.role.toLowerCase().includes('backend')
);
const designers = workloadSummary.filter(m =>
  m.role.toLowerCase().includes('designer') ||
  m.role.toLowerCase().includes('design')
);

function getStatusEmoji(percentUsed) {
  if (percentUsed >= 80) return '🔴';
  if (percentUsed >= 60) return '🟡';
  return '🟢';
}

function buildProgressBar(percentUsed) {
  const filled = Math.round(percentUsed / 10);
  const empty = 10 - filled;
  return '▓'.repeat(filled) + '░'.repeat(empty);
}

function formatMemberLine(m) {
  const emoji = getStatusEmoji(m.percentUsed);
  const bar = buildProgressBar(m.percentUsed);
  return `${emoji}  *${m.name}* — ${m.role}\n` +
    `      \`${bar}\` ${m.percentUsed}% utilized\n` +
    `      *${m.availableHours}h* available of 80h  ·  ${m.todoCount} active tasks`;
}

// Build header
const blocks = [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "📊 Team Capacity Overview",
      emoji: true
    }
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Next 2 weeks  ·  80h capacity per person  ·  Updated ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`
      }
    ]
  },
  { type: "divider" }
];

// Developers section
if (developers.length > 0) {
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*👨‍💻 Developers*"
    }
  });

  for (const dev of developers) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: formatMemberLine(dev)
      }
    });
  }
}

// Divider between groups
if (developers.length > 0 && designers.length > 0) {
  blocks.push({ type: "divider" });
}

// Designers section
if (designers.length > 0) {
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*🎨 Designers*"
    }
  });

  for (const des of designers) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: formatMemberLine(des)
      }
    });
  }
}

// Summary footer
const totalAvailable = workloadSummary.reduce((sum, m) => sum + m.availableHours, 0);
const totalAllocated = workloadSummary.reduce((sum, m) => sum + m.allocatedHours, 0);
const totalCapacity = workloadSummary.length * 80;
const teamPercent = Math.round((totalAllocated / totalCapacity) * 100);

const overloaded = workloadSummary.filter(m => m.percentUsed >= 80);
const available = workloadSummary.filter(m => m.percentUsed < 60);

let summaryText = `*Team Total:* ${totalAvailable}h available of ${totalCapacity}h (${teamPercent}% utilized)`;

if (overloaded.length > 0) {
  summaryText += `\n🔴 *At capacity:* ${overloaded.map(m => m.name).join(', ')}`;
}
if (available.length > 0) {
  summaryText += `\n🟢 *Most available:* ${available.sort((a, b) => a.percentUsed - b.percentUsed).map(m => `${m.name} (${m.availableHours}h)`).join(', ')}`;
}

blocks.push(
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: summaryText
    }
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: "💡 _Capacity is based on estimated hours of active tasks on whitelisted lists. Priority weighting: Urgent/High = 100%, Medium = 75%, Low = 50%._"
      }
    ]
  }
);

const fallbackText = `Team Capacity: ${totalAvailable}h available across ${workloadSummary.length} members (${teamPercent}% utilized)`;

return [{
  json: {
    channelId,
    threadTs,
    slackBlocks: JSON.stringify(blocks),
    slackText: fallbackText
  }
}];
