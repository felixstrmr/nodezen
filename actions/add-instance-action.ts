"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { n8nClient } from "@/lib/clients/n8n-client";
import { env } from "@/lib/env";
import { addInstanceSchema } from "@/schemas/add-instance-schema";
import { encrypt } from "@/utils/encryption";

export const addInstanceAction = authActionClient
  .metadata({ name: "addInstanceAction" })
  .inputSchema(addInstanceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, description, url, api_key } = parsedInput;
    const { supabase, workspace } = ctx;

    if (!workspace) {
      throw new Error("Active workspace not found");
    }

    const encryptedApiKey = await encrypt(api_key, env.ENCRYPTION_SECRET);
    const client = new n8nClient(url, api_key);

    const isConnected = await client.testConnection();
    const status = isConnected ? "connected" : "disconnected";

    await supabase
      .from("instances")
      .insert({
        name,
        description,
        url,
        workspace,
        status,
        api_key: encryptedApiKey,
        last_sync_at: new Date().toISOString(),
      })
      .throwOnError();

    updateTag(`instances:${workspace}`);
  });
