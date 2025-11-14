import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { getUser } from "@/queries/user";

export async function getWorkflows() {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  cacheTag(`workflows:${user.id}`);

  const { data } = await supabase
    .from("workflows")
    .select("*, instance:instances!inner(name)")
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
}

export async function getWorkflow(workflowId: string) {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  cacheTag(`workflow:${workflowId}`);

  const { data } = await supabase
    .from("workflows")
    .select("*, instance:instances!inner(name, user_id)")
    .eq("id", workflowId)
    .eq("instance.user_id", user.id)
    .maybeSingle()
    .throwOnError();

  return data;
}
