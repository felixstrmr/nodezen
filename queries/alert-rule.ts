import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getAlertRules(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`alert-rules:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("alert_rules")
    .select(
      "*, instance:instances(name), workflow:workflows(name, id), channels:alert_rule_channels(channel:alert_channels(name))"
    )
    .eq("workspace", workspaceId)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
}

export async function getAlertRule(workspaceId: string, ruleId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`alert-rules:${workspaceId}`);
  cacheTag(`alert-rule:${workspaceId}:${ruleId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("alert_rules")
    .select("*")
    .eq("workspace", workspaceId)
    .eq("id", ruleId)
    .maybeSingle()
    .throwOnError();

  return data;
}
