import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkflowsTotalMetrics(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflows-total-metrics:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("total_workflow_metrics")
    .select("*")
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
  cacheTag(`workflow-total-metrics:${workflowId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("total_workflow_metrics")
    .select("*")
    .eq("workflow", workflowId)
    .eq("workspace", workspaceId)
    .maybeSingle();

  if (error) {
    return { metrics: null, error };
  }

  return { metrics: data, error: null };
}
