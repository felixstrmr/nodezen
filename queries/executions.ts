import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutions(workspaceId: string, start = 0, end = 100) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceId}:${start}:${end}`);

  const supabase = await supabaseClient();

  const query = supabase
    .from("executions")
    .select(
      `id,
      n8n_execution_id,
      mode,
      status,
      started_at,
      stopped_at,
      error_node,
      error_message,
      duration_ms,
      workflow(id, name, instance(id, name)),
      workspace!inner(id),
      retry_of`
    )
    .range(start, end - 1)
    .order("started_at", { ascending: false })
    .eq("workspace", workspaceId);

  const { data, error } = await query;

  if (error) {
    return { executions: [], error };
  }

  return { executions: data, error: null };
}

export async function getExecutionsByWorkflowId(
  workspaceId: string,
  workflowId: string
) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:workflow:${workspaceId}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("executions")
    .select(
      `id,
      n8n_execution_id,
      mode,
      status,
      started_at,
      stopped_at,
      error_node,
      error_message,
      duration_ms,
      workflow(id, name, instance(id, name)),
      workspace!inner(id),
      retry_of`
    )
    .eq("workspace", workspaceId)
    .eq("workflow", workflowId)
    .order("started_at", { ascending: false });

  if (error) {
    return { executions: [], error };
  }

  return { executions: data, error: null };
}
