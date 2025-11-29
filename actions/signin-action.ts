"use server";

import { updateTag } from "next/cache";
import { actionClient } from "@/lib/clients/action-client";
import { signinSchema } from "@/schemas/signin-schema";

export const signinAction = actionClient
  .metadata({ name: "signinAction" })
  .inputSchema(signinSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { email, password } = parsedInput;
    const { supabase } = ctx;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle()
      .throwOnError();

    if (!user) {
      throw new Error("User not found");
    }

    updateTag(`user:${user.id}`);

    return {
      workspaceId: user.active_workspace,
    };
  });
