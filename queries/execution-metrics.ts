import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutionMetricsHourly(
  workspaceSlug: string,
  workflowId: string
) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`execution-metrics-hourly:${workspaceSlug}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("execution_metrics_hourly")
    .select("*, workspace!inner(slug)")
    .eq("workspace.slug", workspaceSlug)
    .eq("workflow", workflowId);

  return data;
}
