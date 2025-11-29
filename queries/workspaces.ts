import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkspaces() {
  "use cache: private";

  const supabase = await supabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { workspaces: [], error: userError };
  }

  if (!user) {
    return { workspaces: [], error: new Error("User not found") };
  }

  const { data, error: workspacesError } = await supabase
    .from("workspaces")
    .select("id, name, subscription, workspace_users!inner(user)")
    .eq("workspace_users.user", user.id);

  if (workspacesError) {
    return { workspaces: [], error: workspacesError };
  }

  return { workspaces: data, error: null };
}
