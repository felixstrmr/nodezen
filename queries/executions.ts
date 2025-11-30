import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutions(workspaceId: string, from = 0, to = 100) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceId}`);

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
      workspace!inner(id), retry_of`
    )
    .range(from, to)
    .order("started_at", { ascending: false })
    .eq("workspace", workspaceId);

  if (error) {
    return { executions: [], error };
  }

  return { executions: data, error: null };
}
