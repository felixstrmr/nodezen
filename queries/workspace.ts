import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkspaces() {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  cacheTag(`workspaces:${user.id}`);

  const { data } = await supabase
    .from("workspaces")
    .select("*, workspace_users!inner(user, role)")
    .eq("workspace_users.user", user.id)
    .throwOnError();

  return data;
}

export async function getWorkspace(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workspace:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .maybeSingle()
    .throwOnError();

  return data;
}
