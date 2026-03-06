// ============================================================
// WORKFLOW 4 — Code Node: Handle Verification & Parse Bot Mention
//
// Detects four request types from @mentions:
//   1. URL verification challenge (Slack setup)
//   2. Capacity request ("team capacity", "workload", "who's available")
//   3. Assign command ("assign to {Name}")
//   4. Task URL (https://app.webfx.com/projects/.../tasks/...)
//
// INPUT: Raw Slack event from Webhook
// OUTPUT: Classified request with extracted data
// ============================================================

const body = $input.first().json;

// --- 1. Handle Slack URL verification ---
if (body.type === 'url_verification') {
  return [{ json: { challenge: body.challenge, requestType: 'verification' } }];
}

const event = body.event || body;
const text = (event.text || '').trim();
const channelId = event.channel || '';
const messageTs = event.ts || '';
const threadTs = event.thread_ts || messageTs;

// Strip the bot mention tag (e.g., <@U12345>) to get the actual message
const cleanText = text.replace(/<@[A-Z0-9]+>/g, '').trim().toLowerCase();

// --- 2. Detect capacity request ---
const capacityKeywords = [
  'team capacity',
  'capacity',
  'workload',
  'who\'s available',
  'whos available',
  'who is available',
  'availability',
  'team availability',
  'how busy',
  'bandwidth',
  'team workload',
  'current capacity',
  'show capacity',
  'check capacity'
];

const isCapacityRequest = capacityKeywords.some(keyword => cleanText.includes(keyword));

if (isCapacityRequest) {
  return [{
    json: {
      requestType: 'capacity',
      channelId,
      messageTs,
      threadTs,
      originalText: text
    }
  }];
}

// --- 3. Detect assign command ---
const assignPattern = /assign\s+to\s+(\w+)/i;
const assignMatch = text.match(assignPattern);

if (assignMatch) {
  return [{
    json: {
      requestType: 'assign',
      assigneeName: assignMatch[1],
      channelId,
      messageTs,
      threadTs,
      originalText: text
    }
  }];
}

// --- 4. Detect task URL ---
const urlPattern = /projects\/(\d+)\/tasks\/(\d+)/;
const urlMatch = text.match(urlPattern);

if (urlMatch) {
  return [{
    json: {
      requestType: 'task_url',
      projectId: Number(urlMatch[1]),
      taskId: Number(urlMatch[2]),
      channelId,
      messageTs,
      threadTs,
      originalText: text
    }
  }];
}

// --- 5. Unknown request ---
return [{
  json: {
    requestType: 'unknown',
    channelId,
    messageTs,
    threadTs,
    originalText: text,
    errorMessage: "I didn't understand that. Here's what I can do:\n\n" +
      "📊 *Check capacity:* `@bot team capacity`\n" +
      "🔍 *Analyze a task:* `@bot [TWFX task URL]`\n" +
      "✅ *Assign from thread:* `@bot assign to [Name]`"
  }
}];
