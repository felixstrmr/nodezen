"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { addAlertChannelSchema } from "@/schemas/add-alert-channel-schema";

export const addAlertChannelAction = authActionClient
  .metadata({ name: "addChannelAction" })
  .inputSchema(addAlertChannelSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, type, recipients, workspaceId } = parsedInput;
    const { supabase } = ctx;

    await supabase
      .from("alert_channels")
      .insert({
        name,
        type,
        config: {
          recipients,
        },
        workspace: workspaceId,
      })
      .throwOnError();

    updateTag(`alert-channels:${workspaceId}`);
  });
