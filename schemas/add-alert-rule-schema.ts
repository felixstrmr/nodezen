import z from "zod";

export const addAlertRuleSchema = z.object({
  workspaceId: z.uuid().min(1, "Workspace is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["event", "metric"]),
  eventType: z
    .enum([
      "execution_error",
      "execution_success",
      "instance_disconnected",
      "instance_connected",
      "workflow_activated",
      "workflow_deactivated",
    ])
    .optional(),
  instanceId: z.string().optional(),
  workflowId: z.string().optional(),
  channelIds: z.array(z.uuid()).min(1, "At least one channel is required"),
});
