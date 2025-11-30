import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getInstancesTotalMetrics(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`metrics:instances:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("total_instance_metrics")
    .select(`
      instance,
      total_executions,
      successful_executions,
      failed_executions,
      running_executions,
      waiting_executions,
      canceled_executions,
      success_rate,
      failure_rate,
      last_execution_at,
      last_execution_status,
      avg_duration_ms,
      min_duration_ms,
      max_duration_ms,
      total_workflows
    `)
    .eq("workspace", workspaceId);

  if (error) {
    return { metrics: [], error };
  }

  return { metrics: data, error: null };
}

export async function getWorkflowsTotalMetrics(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`metrics:workflows:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("total_workflow_metrics")
    .select(`
      workflow,
      total_executions,
      successful_executions,
      failed_executions,
      running_executions,
      waiting_executions,
      canceled_executions,
      success_rate,
      failure_rate,
      last_execution_at,
      last_execution_status,
      avg_duration_ms,
      min_duration_ms,
      max_duration_ms
    `)
    .eq("workspace", workspaceId);

  if (error) {
    return { metrics: [], error };
  }

  return { metrics: data, error: null };
}

export async function getWorkflowTotalMetrics(
  workspaceId: string,
  workflowId: string
) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`metrics:workflow:${workflowId}`);
  cacheTag(`metrics:workflows:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("total_workflow_metrics")
    .select(`
      workflow,
      total_executions,
      successful_executions,
      failed_executions,
      running_executions,
      waiting_executions,
      canceled_executions,
      success_rate,
      failure_rate,
      last_execution_at,
      last_execution_status,
      avg_duration_ms,
      min_duration_ms,
      max_duration_ms
    `)
    .eq("workspace", workspaceId)
    .eq("workflow", workflowId)
    .maybeSingle();

  if (error) {
    return { metrics: [], error };
  }

  return { metrics: data, error: null };
}
