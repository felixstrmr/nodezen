import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@trigger.dev/sdk";
import type { Workflow as N8nWorkflow } from "@/types/n8n";
import type {
  Database,
  Json,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase";
import {
  executeSyncOperation,
  mergeSyncOptions,
  updateLastSyncTimestamp,
} from "./sync-base";
import type { SyncContext, SyncResult } from "./types";

type Workflow = {
  id: string;
  name: string;
  n8n_workflow_id: string;
  n8n_version_id: string;
  is_active: boolean;
  nodes: Json;
};

/**
 * Syncs workflows from n8n to database
 */
export function syncWorkflows(
  context: SyncContext,
  options?: { batchSize?: number }
): Promise<SyncResult> {
  return executeSyncOperation("workflow sync", context, async (ctx) => {
    const { supabase, client, instance } = ctx;
    const syncOptions = mergeSyncOptions(options);

    logger.info("Fetching workflows from n8n", {
      instanceId: instance.id,
    });

    const n8nWorkflows = await client.getWorkflows();

    logger.info("Fetching existing workflows from database", {
      instanceId: instance.id,
    });

    const { data: existingWorkflows } = await supabase
      .from("workflows")
      .select("id, name, n8n_workflow_id, n8n_version_id, is_active, nodes")
      .eq("instance", instance.id)
      .throwOnError();

    const { toCreate, toUpdate, toDelete } = calculateWorkflowDiff(
      existingWorkflows ?? [],
      n8nWorkflows
    );

    if (
      toCreate.length === 0 &&
      toUpdate.length === 0 &&
      toDelete.length === 0
    ) {
      logger.info("No workflow changes detected", {
        instanceId: instance.id,
      });
      await updateLastSyncTimestamp(
        supabase,
        instance.id,
        "last_workflow_sync_at"
      );
      return { success: true, created: 0, updated: 0, deleted: 0, errors: [] };
    }

    logger.info("Processing workflow changes", {
      instanceId: instance.id,
      toCreate: toCreate.length,
      toUpdate: toUpdate.length,
      toDelete: toDelete.length,
    });

    const errors: Array<{ message: string; error: unknown }> = [];

    const [createResult, updateResult, deleteResult] = await Promise.allSettled(
      [
        createWorkflows(
          supabase,
          toCreate,
          instance.id,
          instance.workspace.id,
          syncOptions.batchSize
        ),
        updateWorkflows(supabase, toUpdate, instance.id, syncOptions.batchSize),
        deleteWorkflows(supabase, toDelete, instance.id, syncOptions.batchSize),
      ]
    );

    if (createResult.status === "rejected") {
      const error = createResult.reason;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({
        message: `Failed to create ${toCreate.length} workflow(s) for instance ${instance.id}: ${errorMessage}`,
        error,
      });
    }
    if (updateResult.status === "rejected") {
      const error = updateResult.reason;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({
        message: `Failed to update ${toUpdate.length} workflow(s) for instance ${instance.id}: ${errorMessage}`,
        error,
      });
    }
    if (deleteResult.status === "rejected") {
      const error = deleteResult.reason;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({
        message: `Failed to delete ${toDelete.length} workflow(s) for instance ${instance.id}: ${errorMessage}`,
        error,
      });
    }

    await updateLastSyncTimestamp(
      supabase,
      instance.id,
      "last_workflow_sync_at"
    );

    const result: SyncResult = {
      success: errors.length === 0,
      created: toCreate.length,
      updated: toUpdate.length,
      deleted: toDelete.length,
      errors,
    };

    logger.info("Workflow sync completed", {
      instanceId: instance.id,
      ...result,
    });

    return result;
  });
}

/**
 * Calculates the difference between existing and n8n workflows
 */
function calculateWorkflowDiff(
  existingWorkflows: Workflow[],
  n8nWorkflows: N8nWorkflow[]
) {
  const existingWorkflowMap = new Map(
    existingWorkflows.map((w) => [w.n8n_workflow_id, w])
  );

  const n8nWorkflowIds = new Set(
    n8nWorkflows.map((w) => w.id).filter((id): id is string => Boolean(id))
  );

  const toCreate: Workflow[] = [];
  const toUpdate: Workflow[] = [];
  const toDelete = existingWorkflows.filter(
    (existing) => !n8nWorkflowIds.has(existing.n8n_workflow_id)
  );

  for (const workflow of n8nWorkflows) {
    if (!(workflow.id && workflow.versionId)) {
      continue;
    }

    const existing = existingWorkflowMap.get(workflow.id);

    if (!existing) {
      toCreate.push({
        id: crypto.randomUUID(),
        name: workflow.name,
        n8n_workflow_id: workflow.id,
        n8n_version_id: workflow.versionId,
        is_active: workflow.active,
        nodes: workflow.nodes as Json,
      });
    } else if (existing.n8n_version_id !== workflow.versionId) {
      toUpdate.push({
        id: existing.id,
        name: workflow.name,
        n8n_workflow_id: workflow.id,
        n8n_version_id: workflow.versionId,
        is_active: workflow.active,
        nodes: workflow.nodes as Json,
      });
    }
  }

  return { toCreate, toUpdate, toDelete };
}

/**
 * Creates workflows in batches
 */
async function createWorkflows(
  supabase: SupabaseClient<Database>,
  workflows: Workflow[],
  instanceId: string,
  workspaceId: string,
  batchSize: number
) {
  if (workflows.length === 0) {
    return;
  }

  const inserts = workflows.map((workflow) => ({
    id: workflow.id,
    workspace: workspaceId,
    instance: instanceId,
    is_active: workflow.is_active,
    n8n_version_id: workflow.n8n_version_id,
    n8n_workflow_id: workflow.n8n_workflow_id,
    name: workflow.name,
    nodes: workflow.nodes,
  })) as TablesInsert<"workflows">[];

  for (let i = 0; i < inserts.length; i += batchSize) {
    const batch = inserts.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(inserts.length / batchSize);

    try {
      await supabase.from("workflows").insert(batch).throwOnError();
      logger.info(`Created batch ${batchNumber}/${totalBatches}`, {
        instanceId,
        batchSize: batch.length,
        workflowIds: batch.map((w) => w.n8n_workflow_id),
        workflowNames: batch.map((w) => w.name),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Failed to create batch ${batchNumber}/${totalBatches}`, {
        instanceId,
        batchSize: batch.length,
        workflowIds: batch.map((w) => w.n8n_workflow_id),
        workflowNames: batch.map((w) => w.name),
        error: errorMessage,
      });
      throw new Error(
        `Failed to create workflow batch ${batchNumber}/${totalBatches} (${batch.length} workflow(s)): ${errorMessage}`
      );
    }
  }

  logger.info(`Created ${inserts.length} workflows`, {
    instanceId,
    totalBatches: Math.ceil(inserts.length / batchSize),
  });
}

/**
 * Updates workflows in batches
 */
async function updateWorkflows(
  supabase: SupabaseClient<Database>,
  workflows: Workflow[],
  instanceId: string,
  batchSize: number
) {
  if (workflows.length === 0) {
    return;
  }

  const updates = workflows.map((workflow) => ({
    id: workflow.id,
    is_active: workflow.is_active,
    name: workflow.name,
    n8n_version_id: workflow.n8n_version_id,
    nodes: workflow.nodes,
  })) as TablesUpdate<"workflows">[];

  const batchErrors: Array<{ workflowId: string; error: unknown }> = [];

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
          .from("workflows")
          .update(update)
          .eq("id", update.id)
          .throwOnError();
      })
    );

    // Collect errors from this batch
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const workflowId = batch[index]?.id;
        batchErrors.push({
          workflowId: workflowId ?? "unknown",
          error: result.reason,
        });
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        logger.error(`Failed to update workflow in batch ${batchNumber}`, {
          instanceId,
          workflowId,
          error: errorMessage,
        });
      }
    });

    if (batchErrors.length > 0) {
      const errorSummary = batchErrors
        .map((e) => {
          const errorMessage =
            e.error instanceof Error ? e.error.message : String(e.error);
          return `${e.workflowId}: ${errorMessage}`;
        })
        .join("; ");
      throw new Error(
        `Failed to update ${batchErrors.length} workflow(s) in batch ${batchNumber}/${totalBatches}: ${errorSummary}`
      );
    }

    logger.info(`Updated batch ${batchNumber}/${totalBatches}`, {
      instanceId,
      batchSize: batch.length,
      workflowIds: batch.map((w) => w.id).filter(Boolean),
    });
  }

  logger.info(`Updated ${updates.length} workflows`, {
    instanceId,
    totalBatches: Math.ceil(updates.length / batchSize),
  });
}

/**
 * Deletes workflows in batches
 */
async function deleteWorkflows(
  supabase: SupabaseClient<Database>,
  workflows: Workflow[],
  instanceId: string,
  batchSize: number
) {
  if (workflows.length === 0) {
    return;
  }

  const ids = workflows.map((workflow) => workflow.id);
  const workflowMap = new Map(
    workflows.map((w) => [
      w.id,
      { n8n_workflow_id: w.n8n_workflow_id, name: w.name },
    ])
  );

  const batchErrors: Array<{ workflowId: string; error: unknown }> = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(ids.length / batchSize);

    const results = await Promise.allSettled(
      batch.map((id) =>
        supabase.from("workflows").delete().eq("id", id).throwOnError()
      )
    );

    // Collect errors from this batch
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const workflowId = batch[index];
        batchErrors.push({
          workflowId: workflowId ?? "unknown",
          error: result.reason,
        });
        const workflowInfo = workflowMap.get(workflowId ?? "");
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        logger.error(`Failed to delete workflow in batch ${batchNumber}`, {
          instanceId,
          workflowId,
          n8nWorkflowId: workflowInfo?.n8n_workflow_id,
          workflowName: workflowInfo?.name,
          error: errorMessage,
        });
      }
    });

    if (batchErrors.length > 0) {
      const errorSummary = batchErrors
        .map((e) => {
          const errorMessage =
            e.error instanceof Error ? e.error.message : String(e.error);
          return `${e.workflowId}: ${errorMessage}`;
        })
        .join("; ");
      throw new Error(
        `Failed to delete ${batchErrors.length} workflow(s) in batch ${batchNumber}/${totalBatches}: ${errorSummary}`
      );
    }

    logger.info(`Deleted batch ${batchNumber}/${totalBatches}`, {
      instanceId,
      batchSize: batch.length,
      workflowIds: batch,
    });
  }

  logger.info(`Deleted ${ids.length} workflows`, {
    instanceId,
    totalBatches: Math.ceil(ids.length / batchSize),
  });
}
