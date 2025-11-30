import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@trigger.dev/sdk";
import type { N8nError, Execution as N8nExecution } from "@/types/n8n";
import type { Database, TablesInsert, TablesUpdate } from "@/types/supabase";
import {
  executeSyncOperation,
  mergeSyncOptions,
  updateLastSyncTimestamp,
} from "./sync-base";
import type { SyncContext, SyncResult } from "./types";

type Execution = {
  id: string;
  n8n_execution_id: string;
  workflow: string;
  workspace: string;
  mode: Database["public"]["Enums"]["execution_modes"];
  status: Database["public"]["Enums"]["execution_statuses"];
  started_at: string;
  stopped_at: string | null;
  duration_ms: number | null;
  retry_of: string | null;
  error_message: string | null;
  error_node: string | null;
};

/**
 * Syncs executions from n8n to database
 */
export async function syncExecutions(
  context: SyncContext,
  options?: { batchSize?: number; limit?: number }
): Promise<SyncResult> {
  return await executeSyncOperation("execution sync", context, async (ctx) => {
    const { supabase, client, instance } = ctx;
    const syncOptions = mergeSyncOptions(options);

    logger.info("Fetching executions from n8n", {
      instanceId: instance.id,
    });

    const n8nExecutions = await client.getExecutions({
      limit: options?.limit ?? 250,
      includeData: true, // Include execution data to extract error information
    });

    if (n8nExecutions.length === 0) {
      logger.info("No executions to sync", {
        instanceId: instance.id,
      });
      await updateLastSyncTimestamp(
        supabase,
        instance.id,
        "last_execution_sync_at"
      );
      return { success: true, created: 0, updated: 0, deleted: 0, errors: [] };
    }

    logger.info("Fetching workflow mappings", {
      instanceId: instance.id,
    });

    // Get workflow mappings (n8n_workflow_id -> database workflow id)
    const { data: workflows } = await supabase
      .from("workflows")
      .select("id, n8n_workflow_id")
      .eq("instance", instance.id)
      .throwOnError();

    const workflowMap = new Map(
      (workflows ?? []).map((w) => [w.n8n_workflow_id, w.id])
    );

    logger.info("Fetching existing executions from database", {
      instanceId: instance.id,
    });

    const n8nExecutionIds = n8nExecutions
      .map((e) => e.id)
      .filter((id): id is string => Boolean(id));

    // Get all workflows for this instance to filter executions
    const workflowIds = Array.from(workflowMap.values());

    const { data: existingExecutions } = await supabase
      .from("executions")
      .select(
        "id, n8n_execution_id, workflow, status, stopped_at, error_message, error_node"
      )
      .in("n8n_execution_id", n8nExecutionIds)
      .in("workflow", workflowIds)
      .throwOnError();

    const existingExecutionMap = new Map(
      (existingExecutions ?? []).map((e) => [e.n8n_execution_id, e])
    );

    const { toCreate, toUpdate } = calculateExecutionDiff(
      n8nExecutions,
      existingExecutionMap,
      workflowMap,
      instance.workspace.id
    );

    if (toCreate.length === 0 && toUpdate.length === 0) {
      logger.info("No execution changes detected", {
        instanceId: instance.id,
      });
      await updateLastSyncTimestamp(
        supabase,
        instance.id,
        "last_execution_sync_at"
      );
      return { success: true, created: 0, updated: 0, deleted: 0, errors: [] };
    }

    logger.info("Processing execution changes", {
      instanceId: instance.id,
      toCreate: toCreate.length,
      toUpdate: toUpdate.length,
    });

    const errors: Array<{ message: string; error: unknown }> = [];

    const [createResult, updateResult] = await Promise.allSettled([
      createExecutions(supabase, toCreate, syncOptions.batchSize, instance.id),
      updateExecutions(supabase, toUpdate, syncOptions.batchSize, instance.id),
    ]);

    if (createResult.status === "rejected") {
      const error = createResult.reason;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({
        message: `Failed to create ${toCreate.length} execution(s) for instance ${instance.id}: ${errorMessage}`,
        error,
      });
    }
    if (updateResult.status === "rejected") {
      const error = updateResult.reason;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({
        message: `Failed to update ${toUpdate.length} execution(s) for instance ${instance.id}: ${errorMessage}`,
        error,
      });
    }

    await updateLastSyncTimestamp(
      supabase,
      instance.id,
      "last_execution_sync_at"
    );

    const result: SyncResult = {
      success: errors.length === 0,
      created: toCreate.length,
      updated: toUpdate.length,
      deleted: 0, // We don't delete executions
      errors,
    };

    logger.info("Execution sync completed", {
      instanceId: instance.id,
      ...result,
    });

    return result;
  });
}

/**
 * Calculates the difference between n8n executions and existing executions
 */
function calculateExecutionDiff(
  n8nExecutions: N8nExecution[],
  existingExecutionMap: Map<
    string,
    {
      id: string;
      status: string;
      stopped_at: string | null;
      error_message: string | null;
      error_node: string | null;
    }
  >,
  workflowMap: Map<string, string>,
  workspaceId: string
) {
  const toCreate: Execution[] = [];
  const toUpdate: Execution[] = [];

  for (const n8nExecution of n8nExecutions) {
    if (!(n8nExecution.id && n8nExecution.workflowId)) {
      continue;
    }

    const workflowId = workflowMap.get(n8nExecution.workflowId);
    if (!workflowId) {
      logger.warn("Workflow not found for execution", {
        n8nWorkflowId: n8nExecution.workflowId,
        n8nExecutionId: n8nExecution.id,
      });
      continue;
    }

    const existing = existingExecutionMap.get(n8nExecution.id);
    const execution = mapN8nExecutionToDb(
      n8nExecution,
      workflowId,
      workspaceId,
      existing?.id
    );

    if (existing) {
      // Update if execution status changed, stopped_at changed, or error fields changed
      const statusChanged = existing.status !== execution.status;

      // Normalize stopped_at for comparison (handle null and ISO string differences)
      const existingStoppedAt = existing.stopped_at
        ? new Date(existing.stopped_at).toISOString()
        : null;
      const executionStoppedAt = execution.stopped_at
        ? new Date(execution.stopped_at).toISOString()
        : null;
      const stoppedAtChanged = existingStoppedAt !== executionStoppedAt;

      // Compare error fields (handle null/undefined/empty string properly)
      const normalizeString = (
        value: string | null | undefined
      ): string | null =>
        value === null || value === undefined || value === "" ? null : value;
      const errorMessageChanged =
        normalizeString(existing.error_message) !==
        normalizeString(execution.error_message);
      const errorNodeChanged =
        normalizeString(existing.error_node) !==
        normalizeString(execution.error_node);

      if (
        statusChanged ||
        stoppedAtChanged ||
        errorMessageChanged ||
        errorNodeChanged
      ) {
        toUpdate.push(execution);
      }
    } else {
      toCreate.push(execution);
    }
  }

  return { toCreate, toUpdate };
}

/**
 * Maps n8n execution to database execution format
 */
function mapN8nExecutionToDb(
  n8nExecution: N8nExecution,
  workflowId: string,
  workspaceId: string,
  existingId?: string
): Execution {
  const startedAt = new Date(n8nExecution.startedAt);
  const stoppedAt = n8nExecution.stoppedAt
    ? new Date(n8nExecution.stoppedAt)
    : null;

  let errorMessage: string | null = null;
  let errorNode: string | null = null;

  if (n8nExecution.data?.resultData?.runData) {
    for (const [nodeName, nodeData] of Object.entries(
      n8nExecution.data.resultData.runData
    )) {
      const nodeErrors = nodeData
        .flatMap((run) => run.error)
        .filter((error): error is N8nError => Boolean(error));

      if (nodeErrors.length > 0) {
        errorMessage = nodeErrors[0].message ?? "Unknown error";
        errorNode = nodeName;
        break;
      }
    }
  }

  let retryOf: string | null = null;
  if (n8nExecution.retryOf) {
    // We'll need to look this up later, but for now store the n8n execution ID
    // This would need to be resolved to a database ID
    retryOf = null; // TODO: Resolve retry relationship
  }

  return {
    id: existingId ?? crypto.randomUUID(),
    n8n_execution_id: n8nExecution.id,
    workflow: workflowId,
    workspace: workspaceId,
    mode: n8nExecution.mode,
    status:
      n8nExecution.status ?? (n8nExecution.finished ? "success" : "running"),
    started_at: startedAt.toISOString(),
    stopped_at: stoppedAt?.toISOString() ?? null,
    duration_ms: 0, // Calculated by database
    retry_of: retryOf,
    error_message: errorMessage,
    error_node: errorNode,
  };
}

/**
 * Creates executions in batches
 */
async function createExecutions(
  supabase: SupabaseClient<Database>,
  executions: Execution[],
  batchSize: number,
  instanceId: string
) {
  if (executions.length === 0) {
    return;
  }

  const inserts = executions.map((execution) => ({
    id: execution.id,
    n8n_execution_id: execution.n8n_execution_id,
    workflow: execution.workflow,
    workspace: execution.workspace,
    mode: execution.mode,
    status: execution.status,
    started_at: execution.started_at,
    stopped_at: execution.stopped_at,
    // duration_ms is calculated by database, do not include in insert
    retry_of: execution.retry_of,
    error_message: execution.error_message,
    error_node: execution.error_node,
  })) as TablesInsert<"executions">[];

  for (let i = 0; i < inserts.length; i += batchSize) {
    const batch = inserts.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(inserts.length / batchSize);

    try {
      await supabase.from("executions").insert(batch).throwOnError();
      logger.info(`Created batch ${batchNumber}/${totalBatches}`, {
        instanceId,
        batchSize: batch.length,
        executionIds: batch.map((e) => e.n8n_execution_id),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Failed to create batch ${batchNumber}/${totalBatches}`, {
        instanceId,
        batchSize: batch.length,
        executionIds: batch.map((e) => e.n8n_execution_id),
        error: errorMessage,
      });
      throw new Error(
        `Failed to create execution batch ${batchNumber}/${totalBatches} (${batch.length} execution(s)): ${errorMessage}`
      );
    }
  }

  logger.info(`Created ${inserts.length} executions`, {
    instanceId,
    totalBatches: Math.ceil(inserts.length / batchSize),
  });
}

/**
 * Updates executions in batches
 */
async function updateExecutions(
  supabase: SupabaseClient<Database>,
  executions: Execution[],
  batchSize: number,
  instanceId: string
) {
  if (executions.length === 0) {
    return;
  }

  const updates = executions.map((execution) => ({
    id: execution.id,
    status: execution.status,
    stopped_at: execution.stopped_at,
    // duration_ms is calculated by database, do not include in update
    error_message: execution.error_message,
    error_node: execution.error_node,
  })) as TablesUpdate<"executions">[];

  const batchErrors: Array<{ executionId: string; error: unknown }> = [];

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(updates.length / batchSize);

    const results = await Promise.allSettled(
      batch.map((update) => {
        if (!update.id) {
          return Promise.resolve();
        }
        return supabase
          .from("executions")
          .update(update)
          .eq("id", update.id)
          .throwOnError();
      })
    );

    // Collect errors from this batch
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const executionId = batch[index]?.id;
        batchErrors.push({
          executionId: executionId ?? "unknown",
          error: result.reason,
        });
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        logger.error(`Failed to update execution in batch ${batchNumber}`, {
          instanceId,
          executionId,
          error: errorMessage,
        });
      }
    });

    if (batchErrors.length > 0) {
      const errorSummary = batchErrors
        .map((e) => {
          const errorMessage =
            e.error instanceof Error ? e.error.message : String(e.error);
          return `${e.executionId}: ${errorMessage}`;
        })
        .join("; ");
      throw new Error(
        `Failed to update ${batchErrors.length} execution(s) in batch ${batchNumber}/${totalBatches}: ${errorSummary}`
      );
    }

    logger.info(`Updated batch ${batchNumber}/${totalBatches}`, {
      instanceId,
      batchSize: batch.length,
      executionIds: batch.map((e) => e.id).filter(Boolean),
    });
  }

  logger.info(`Updated ${updates.length} executions`, {
    instanceId,
    totalBatches: Math.ceil(updates.length / batchSize),
  });
}
