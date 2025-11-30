"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { n8nClient } from "@/lib/clients/n8n-client";
import { createInstanceSchema } from "@/schemas/create-instance-schema";
import { encrypt } from "@/utils/encryption";

export const createInstanceAction = authActionClient
  .metadata({ name: "createInstanceAction" })
  .inputSchema(createInstanceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, description, n8nUrl, n8nApiKey, workspaceId } = parsedInput;
    const { supabase } = ctx;

    const client = new n8nClient(n8nUrl, n8nApiKey);
    const status = await client.getStatus();

    if (status !== "connected") {
      throw new Error("Failed to connect to Instance");
    }

    const encryptedApiKey = await encrypt(n8nApiKey);

    const id = crypto.randomUUID();
    await supabase
      .from("instances")
      .insert({
        id,
        name,
        description,
        status,
        last_status_check_at: new Date().toISOString(),
        n8n_url: n8nUrl,
        n8n_api_key: encryptedApiKey,
        workspace: workspaceId,
      })
      .throwOnError();

    updateTag(`instances:${workspaceId}`);
  });
