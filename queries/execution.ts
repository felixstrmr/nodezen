import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutions(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("executions")
    .select("*, workflow(name)")
    .eq("workspace", workspaceId)
    .order("started_at", { ascending: false })
    .throwOnError();

  return data;
}

export async function getExecutionsByWorkflowId(
  workspaceId: string,
  workflowId: string
) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceId}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("executions")
    .select("*, workflow(name)")
    .eq("workspace", workspaceId)
    .eq("workflow", workflowId)
    .order("started_at", { ascending: false })
    .throwOnError();

  return data;
}

export async function getLastExecutionByWorkflowId(
  workspaceId: string,
  workflowId: string
) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceId}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("executions")
    .select("*, workflow(name)")
    .eq("workspace", workspaceId)
    .eq("workflow", workflowId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .throwOnError();

  return data;
}
