import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutionMetricsHourly(
  workspaceId: string,
  workflowId: string
) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`execution-metrics-hourly:${workspaceId}:${workflowId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("execution_metrics_hourly")
    .select("*")
    .eq("workspace", workspaceId)
    .eq("workflow", workflowId);

  return data;
}
