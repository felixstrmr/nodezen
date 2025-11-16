import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkflows(workspaceSlug: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflows:${workspaceSlug}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("workflows")
    .select("*, workspace!inner(slug), instance(id, name)")
    .eq("workspace.slug", workspaceSlug)
    .order("last_execution_at", { ascending: false, nullsFirst: false })
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
    .select("*, workspace!inner(slug), instance(id, name)")
    .eq("workspace.slug", workspaceSlug)
    .eq("id", workflowId)
    .maybeSingle()
    .throwOnError();

  return data;
}
