import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkflows(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflows:${workspaceId}`);

  const supabase = await supabaseClient();

const { data } = await supabase
  .from("workflows")
  .select(`
    *,
    instance(id, name),
    last_execution:executions(
      id,
      status,
      started_at,
      stopped_at
    )
  `)
  .eq("workspace", workspaceId)
  .limit(1, { foreignTable: "last_execution" })
  .order("started_at", {
    referencedTable: "last_execution",
    nullsFirst: false,
    ascending: false,
  })
  .throwOnError();

  return data;
}

export async function getWorkflow(workspaceId: string, workflowId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflow:${workspaceId}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("workflows")
    .select("*, instance(id, name, url)")
    .eq("workspace", workspaceId)
    .eq("id", workflowId)
    .maybeSingle()
    .throwOnError();

  return data;
}
