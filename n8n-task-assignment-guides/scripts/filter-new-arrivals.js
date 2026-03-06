// ============================================================
// WORKFLOW 1 — Code Node: Filter New Arrivals Only
//
// The TWFX webhook fires on both "create" and "update" events.
// We need "update" events to catch tasks being MOVED into the
// target tasklist, but we don't want to process every random
// update (description edits, date changes, etc.).
//
// This node uses the webhook's own payload to detect first arrivals:
//   1. CREATE — task was created directly in the target list
//   2. UPDATE — task was moved INTO the target list from another list
//      (detected by comparing original.todolistId vs result.todolistId)
//
// If neither condition is met, the node returns an empty array,
// which stops execution for that item (n8n treats [] as "no output").
//
// IMPORTANT: The `original` object only contains flat fields (no
// nested todolist object), so we compare todolistId values directly
// instead of todolist.name strings.
//
// INPUT: Raw webhook payload from TWFX
//   $json.body.event.action       → "create" or "update"
//   $json.body.event.result       → current task state (includes nested todolist)
//   $json.body.event.original     → previous task state (flat fields only)
//
// OUTPUT: Passes through the full payload with a _triggerReason field,
//         or returns [] to stop processing.
// ============================================================

const body = $input.first().json.body || $input.first().json;
const event = body.event || {};
const action = event.action;
const result = event.result || {};
const original = event.original || {};

const TARGET_LIST = 'New Interactive Requests';
const resultTasklist = result.todolist?.name || '';

const isInTargetList = resultTasklist.includes(TARGET_LIST);
const isCreate = action === 'create';
const isMovedIn = action === 'update'
  && isInTargetList
  && original.todolistId !== result.todolistId;

if (isInTargetList && (isCreate || isMovedIn)) {
  return [{
    json: {
      ...$input.first().json,
      _triggerReason: isCreate ? 'new_task_created' : 'task_moved_to_list'
    }
  }];
}

return [];
