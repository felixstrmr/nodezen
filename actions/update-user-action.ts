"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { updateUserSchema } from "@/schemas/update-user-schema";

export const updateUserAction = authActionClient
  .metadata({ name: "updateUserAction" })
  .inputSchema(updateUserSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, active_workspace } = parsedInput;
    const { supabase } = ctx;

    await supabase
      .from("users")
      .update({
        active_workspace,
      })
      .eq("id", id)
      .throwOnError();

    updateTag(`user:${id}`);
  });
