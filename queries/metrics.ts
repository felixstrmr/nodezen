import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkflowTotalMetrics(workspaceId: string) {
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
