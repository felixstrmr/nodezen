"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { addAlertRuleSchema } from "@/schemas/add-alert-rule-schema";

export const addAlertRuleAction = authActionClient
  .metadata({ name: "addAlertRuleAction" })
  .inputSchema(addAlertRuleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, description, isActive, conditions, channelIds } = parsedInput;
    const { supabase, workspace } = ctx;

    if (!workspace) {
      throw new Error("Active workspace not found");
    }

    await supabase
      .from("alert_rules")
      .insert({
        name,
        description: description || null,
        is_active: isActive,
        workspace,
        conditions: {
          conditions,
          channelIds,
        },
      })
      .throwOnError();

    updateTag(`rules:${workspace}`);
  });

