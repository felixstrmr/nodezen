"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { authActionClient } from "@/lib/clients/action-client";
import { addAlertRuleSchema } from "@/schemas/add-alert-rule-schema";

export const addAlertRuleAction = authActionClient
  .metadata({ name: "addAlertRuleAction" })
  .inputSchema(addAlertRuleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      workspaceId,
      name,
      type,
      eventType,
      instanceId,
      workflowId,
      channelIds,
    } = parsedInput;
    const { supabase } = ctx;

    const config =
      type === "event" && eventType ? { event_type: eventType } : {};

    const ruleId = randomUUID();

    const instance = instanceId === "all" ? null : instanceId || null;
    const workflow = workflowId === "all" ? null : workflowId || null;

    await supabase
      .from("alert_rules")
      .insert({
        id: ruleId,
        workspace: workspaceId,
        name,
        type,
        config,
        instance,
        workflow,
        cooldown_seconds: 300,
        is_active: true,
      })
      .throwOnError();

    await supabase
      .from("alert_rule_channels")
      .insert(
        channelIds.map((channelId) => ({
          channel: channelId,
          rule: ruleId,
        }))
      )
      .throwOnError();

    updateTag(`alert-rules:${workspaceId}`);
  });
