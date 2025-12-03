import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

type Execution = {
  id: string;
  n8n_execution_id: string;
  mode: string;
  status: string;
  started_at: string;
  stopped_at: string | null;
  error_node: string | null;
  error_message: string | null;
  duration_ms: number | null;
  workflow: {
    id: string;
    name: string;
    instance: {
      id: string;
      name: string;
    };
  };
};

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

  return { executions: data ?? [], error: null };
}
