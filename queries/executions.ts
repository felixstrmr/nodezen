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

export async function getExecutions(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceId}`);

  const supabase = await supabaseClient();

  const PAGE_SIZE = 1000;
  const executions: Execution[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

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
      .range(start, end)
      .order("started_at", { ascending: false })
      .eq("workspace", workspaceId);

    const { data, error } = await query;

    if (error) {
      return { executions: [], error };
    }

    if (data && data.length > 0) {
      executions.push(...data);
      hasMore = data.length === PAGE_SIZE;
      page += 1;
    } else {
      hasMore = false;
    }
  }

  return { executions, error: null };
}
