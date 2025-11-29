"use server";

import { authActionClient } from "@/lib/clients/action-client";
import { createWorkspaceSchema } from "@/schemas/create-workspace-schema";

export const createWorkspaceAction = authActionClient
  .metadata({ name: "createWorkspaceAction" })
  .inputSchema(createWorkspaceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name } = parsedInput;
    const { supabase, user } = ctx;

    const workspaceId = crypto.randomUUID();
    await supabase
      .from("workspaces")
      .insert({
        id: workspaceId,
        name,
      })
      .throwOnError();

    await supabase
      .from("workspace_users")
      .insert({
        user: user.id,
        workspace: workspaceId,
        role: "owner",
      })
      .throwOnError();

    return {
      workspaceId,
    };
  });
