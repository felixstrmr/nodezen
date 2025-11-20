"use server";

import { actionClient } from "@/lib/clients/action-client";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { getWorkspace } from "@/queries/workspace";
import { signinSchema } from "@/schemas/signin-schema";

export const signinAction = actionClient
  .metadata({ name: "signinAction" })
  .inputSchema(signinSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;

    const supabase = await supabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const userId = data.user?.id;

    if (userId) {
      const user = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle()
        .throwOnError();

      if (user?.data?.active_workspace) {
        const workspace = await getWorkspace(user.data.active_workspace);

        return { active_workspace: workspace?.id ?? null };
      }
    }

    return { active_workspace: null };
  });
