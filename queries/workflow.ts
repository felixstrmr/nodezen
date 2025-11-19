import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkflows(workspaceSlug: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflows:${workspaceSlug}`);

  const supabase = await supabaseClient();

const { data } = await supabase
  .from("workflows")
  .select(`
    *,
    workspace!inner(slug),
    instance(id, name),
    last_execution:executions(
      id,
      status,
      started_at,
      stopped_at
    )
  `)
  .eq("workspace.slug", workspaceSlug)
  .limit(1, { foreignTable: "last_execution" })
  .order("started_at", {
    referencedTable: "last_execution",
    nullsFirst: false,
    ascending: false,
  })
  .throwOnError();

  return data;
}

export async function getWorkflow(workspaceSlug: string, workflowId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflow:${workspaceSlug}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("workflows")
    .select("*, workspace!inner(slug), instance(id, name, url)")
    .eq("workspace.slug", workspaceSlug)
    .eq("id", workflowId)
    .maybeSingle()
    .throwOnError();

  return data;
}
