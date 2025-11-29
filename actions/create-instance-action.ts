"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { createInstanceSchema } from "@/schemas/create-instance-schema";

export const createInstanceAction = authActionClient
  .metadata({ name: "createInstanceAction" })
  .inputSchema(createInstanceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, description, n8nUrl, n8nApiKey, workspaceId } = parsedInput;
    const { supabase } = ctx;

    await supabase
      .from("instances")
      .insert({
        name,
        description,
        n8n_url: n8nUrl,
        n8n_api_key: n8nApiKey,
        workspace: workspaceId,
      })
      .throwOnError();

    updateTag(`instances:${workspaceId}`);
  });
