"use server";

import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { addAlertRuleSchema } from "@/schemas/add-alert-rule-schema";

export const addAlertRuleAction = authActionClient
  .metadata({ name: "addAlertRuleAction" })
  .inputSchema(addAlertRuleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      name,
      description,
      isActive,
      cooldownPeriod,
      conditions,
      channelIds,
      workspaceId,
    } = parsedInput;
    const { supabase } = ctx;

    await supabase
      .from("alert_rules")
      .insert({
        name,
        description: description || null,
        is_active: isActive,
        cooldown_period: cooldownPeriod,
        workspace: workspaceId,
        conditions: {
          conditions,
          channelIds,
          cooldownPeriod,
        },
      })
      .throwOnError();

    updateTag(`alert-rules:${workspaceId}`);
  });
