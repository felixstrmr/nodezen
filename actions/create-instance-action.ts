"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { n8nClient } from "@/lib/clients/n8n-client";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { createInstanceSchema } from "@/schemas/create-instance-schema";

export const createInstanceAction = authActionClient
  .metadata({ name: "create-instance-action" })
  .inputSchema(createInstanceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, description, url, api_key } = parsedInput;
    const { user } = ctx;

    const supabase = await supabaseClient();

    const client = new n8nClient(url, api_key);

    const isConnected = await client.testConnection();

    if (!isConnected) {
      throw new Error("Failed to connect to Instance");
    }

    await supabase
      .from("instances")
      .insert({
        user_id: user.id,
        name,
        url,
        api_key,
        description,
        last_status_check_at: new Date().toISOString(),
        status: isConnected ? "connected" : "disconnected",
      })
      .throwOnError();

    updateTag(`instances:${user.id}`);
  });
