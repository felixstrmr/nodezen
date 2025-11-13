import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { getUser } from "@/queries/user";

export async function getExecutions() {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  cacheTag(`executions:${user.id}`);

  const { data } = await supabase
    .from("executions")
    .select("*, workflow:workflows!inner(id, name)")
    .order("n8n_started_at", { ascending: false })
    .throwOnError();

  return data;
}
