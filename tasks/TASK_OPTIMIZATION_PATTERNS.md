# Task Optimization Patterns & Fetching Strategy

## Current Task Overview

### Task Execution Schedule
- **Every 5 minutes** (`trigger-5m-data-cycle`): 
  - `check-instances-status` (Pro workspaces)
  - `sync-workflows-task` (Pro workspaces)
  - `sync-executions-task` (Pro workspaces)
- **Daily** (`trigger-daily-backups`): 
  - `create-workflow-backups-task` (Pro workspaces)
- **Hourly** (`trigger-hourly-backups`): 
  - `create-workflow-backups-task` (Premium workspaces)

---

## Current Fetching Patterns

### Pattern 1: Instance Fetching
**Used by:** All tasks
```typescript
// Repeated in: check-instances-status, sync-workflows-task, sync-executions-task, create-workflow-backups-task
const { data: instances } = await supabase
  .from("instances")
  .select("*")
  .eq("workspace", workspaceId)
  .eq("status", "connected")  // Some tasks filter, some don't
  .throwOnError();
```

**Issues:**
- ❌ Same query executed 3 times in 5-minute cycle
- ❌ Redundant database calls
- ❌ No caching between tasks

### Pattern 2: Workflow Fetching (Database)
**Used by:** `sync-executions-task`, `create-workflow-backups-task`
```typescript
// Repeated pattern
const { data: workflows } = await supabase
  .from("workflows")
  .select("id, n8n_workflow_id")
  .eq("instance", instance.id)
  .throwOnError();
```

**Issues:**
- ❌ `sync-executions-task` fetches from DB
- ❌ `create-workflow-backups-task` fetches from DB
- ❌ `sync-workflows-task` fetches from n8n API (different source)

### Pattern 3: Workflow Fetching (n8n API)
**Used by:** `sync-workflows-task`, `create-workflow-backups-task`
```typescript
// In sync-workflows-task
const workflows = await client.getWorkflows();

// In create-workflow-backups-task
const workflowData = await client.getWorkflowById(workflow.n8n_workflow_id);
```

**Issues:**
- ❌ `sync-workflows-task` gets all workflows from n8n
- ❌ `create-workflow-backups-task` gets individual workflows one-by-one
- ❌ No coordination between tasks

### Pattern 4: API Key Decryption
**Used by:** All tasks that interact with n8n
```typescript
// Repeated in every task
const decryptedApiKey = await decrypt(
  instance.api_key,
  process.env.ENCRYPTION_SECRET as string
);
const client = new n8nClient(instance.url, decryptedApiKey);
```

**Issues:**
- ❌ Decryption happens multiple times for same instance
- ❌ No caching of decrypted keys (within task execution)
- ❌ Client recreated for each workflow/operation

---

## Optimal Fetching Patterns

### Strategy 1: Shared Data Fetching Layer

Create a shared helper that fetches and caches data within a single execution context:

```typescript
// lib/task-helpers/workspace-data.ts
export async function getWorkspaceData(workspaceId: string) {
  // Fetch once, use many times
  const { data: instances } = await supabase
    .from("instances")
    .select("*")
    .eq("workspace", workspaceId)
    .throwOnError();

  // Pre-decrypt and create clients
  const instancesWithClients = await Promise.all(
    instances.map(async (instance) => ({
      ...instance,
      decryptedApiKey: await decrypt(instance.api_key, process.env.ENCRYPTION_SECRET),
      client: null as n8nClient | null, // Lazy init
    }))
  );

  return { instances: instancesWithClients };
}
```

### Strategy 2: Sequential Task Execution with Data Passing

Instead of triggering 3 separate tasks in `trigger-5m-data-cycle`, create a single orchestration task:

```typescript
// tasks/sync-workspace-data.ts
export const syncWorkspaceDataTask = schemaTask({
  id: "sync-workspace-data",
  schema: z.object({ workspaceId: z.uuid() }),
  run: async (payload) => {
    const { workspaceId } = payload;
    
    // Fetch once
    const { instances } = await getWorkspaceData(workspaceId);
    
    // Execute sequentially with shared data
    const statusResults = await checkInstancesStatus(instances);
    const workflows = await syncWorkflows(instances);
    const executions = await syncExecutions(instances, workflows);
    
    return { statusResults, workflows, executions };
  },
});
```

### Strategy 3: Batch Operations

**Current:** Individual API calls per workflow
```typescript
// ❌ BAD: One call per workflow
for (const workflow of workflows) {
  const workflowData = await client.getWorkflowById(workflow.n8n_workflow_id);
  // ...
}
```

**Optimal:** Batch fetch when possible
```typescript
// ✅ GOOD: Fetch all workflows once
const allWorkflows = await client.getWorkflows();
const workflowMap = new Map(allWorkflows.map(w => [w.id, w]));

for (const workflow of workflows) {
  const workflowData = workflowMap.get(workflow.n8n_workflow_id);
  // ...
}
```

---

## Task Organization Recommendations

### ✅ KEEP SEPARATE

1. **`check-instances-status`** - Should remain separate
   - **Reason:** Needs to run even when instances are disconnected
   - **Frequency:** Can run independently of other syncs
   - **Dependency:** None (doesn't need workflows)

2. **`trigger-daily-backups`** and `trigger-hourly-backups`** - Keep separate triggers
   - **Reason:** Different subscription tiers, different frequencies
   - **Note:** But they call the same task, which is good

### 🔄 COMBINE / OPTIMIZE

1. **5-Minute Cycle Tasks** → Combine into single orchestration task
   - **Current:** 3 separate tasks triggered independently
   - **Proposed:** 1 orchestration task that:
     - Fetches instances once
     - Checks status
     - Syncs workflows (gets fresh data from n8n)
     - Syncs executions (uses workflows from previous step)
   - **Benefits:**
     - Single instance fetch
     - Shared workflow data
     - Better error handling
     - Atomic operation

2. **`sync-workflows-task` + `create-workflow-backups-task`** → Share workflow data
   - **Current:** Both fetch workflows independently
   - **Proposed:** 
     - Option A: Run backups immediately after workflow sync (in same task)
     - Option B: Pass workflow data between tasks (if keeping separate)
   - **Benefits:**
     - Avoid duplicate n8n API calls
     - Faster execution

---

## Recommended Task Structure

### Option A: Orchestrated Tasks (Recommended)

```
trigger-5m-data-cycle
  └─> sync-workspace-data-task (orchestrator)
       ├─> Fetch instances (once)
       ├─> Check instances status
       ├─> Sync workflows from n8n
       ├─> Sync executions (uses workflows from step above)
       └─> Return combined results

trigger-daily-backups
  └─> create-workflow-backups-task
       └─> Fetch instances + workflows (optimized)

trigger-hourly-backups
  └─> create-workflow-backups-task
       └─> Fetch instances + workflows (optimized)
```

### Option B: Shared Data Layer (Alternative)

Keep tasks separate but add shared data fetching:

```
trigger-5m-data-cycle
  ├─> check-instances-status (uses shared data helper)
  ├─> sync-workflows-task (uses shared data helper)
  └─> sync-executions-task (uses shared data helper + workflows from sync-workflows-task)
```

---

## Implementation Priority

### High Priority (Immediate Impact)

1. **Combine 5-minute cycle tasks** into single orchestration task
   - Eliminates 2 redundant instance fetches
   - Enables workflow data sharing
   - Reduces database load by ~66%

2. **Batch workflow fetching** in `create-workflow-backups-task`
   - Use `getWorkflows()` instead of `getWorkflowById()` per workflow
   - Reduces n8n API calls from N to 1 per instance

### Medium Priority (Performance Gains)

3. **Cache decrypted API keys** within task execution
   - Decrypt once per instance, reuse client
   - Reduces encryption overhead

4. **Optimize workflow queries**
   - Fetch workflows once, filter in memory
   - Use joins where possible

### Low Priority (Nice to Have)

5. **Add request deduplication** for concurrent runs
6. **Implement incremental sync** for executions (cursor-based)
7. **Add workflow change detection** before full sync

---

## Fetching Decision Tree

```
When to fetch instances?
├─> At task start (if task needs instances)
└─> Cache within execution context

When to fetch workflows?
├─> From n8n API: When syncing workflows or creating backups
│   └─> Use getWorkflows() batch method when possible
├─> From database: When you only need IDs/metadata
│   └─> Use after workflows are synced
└─> Share between tasks: Pass as parameter or use shared helper

When to decrypt API keys?
├─> Once per instance per execution
└─> Cache decrypted key in memory (not persisted)

When to create n8nClient?
├─> Once per instance per execution
└─> Reuse client for multiple operations
```

---

## Example: Optimized 5-Minute Cycle Task

```typescript
export const syncWorkspaceDataTask = schemaTask({
  id: "sync-workspace-data",
  schema: z.object({ workspaceId: z.uuid() }),
  run: async (payload) => {
    const { workspaceId } = payload;
    
    // STEP 1: Fetch instances once
    const { data: instances } = await supabase
      .from("instances")
      .select("*")
      .eq("workspace", workspaceId)
      .throwOnError();
    
    // STEP 2: Check status (needs all instances, even disconnected)
    const statusResults = await checkInstancesStatus(instances);
    
    // STEP 3: Filter to connected instances
    const connectedInstances = instances.filter(i => i.status === "connected");
    
    // STEP 4: Sync workflows (fetches from n8n, updates DB)
    const workflowsByInstance = await syncWorkflows(connectedInstances);
    
    // STEP 5: Sync executions (uses workflows from step 4)
    const executionResults = await syncExecutions(
      connectedInstances,
      workflowsByInstance
    );
    
    return { statusResults, executionResults };
  },
});
```

---

## Metrics to Track

After optimization, monitor:
- Database query count per cycle
- n8n API call count per cycle
- Task execution duration
- Memory usage (for caching)
- Error rates

