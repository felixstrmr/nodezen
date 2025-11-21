import z from "zod";

export const conditionMetricSchema = z.enum([
  "failed_executions",
  "successful_executions",
  "total_executions",
  "avg_duration_ms",
  "p50_duration_ms",
  "p95_duration_ms",
  "p99_duration_ms",
]);

export const conditionOperatorSchema = z.enum([
  "greater_than",
  "less_than",
  "greater_than_or_equal",
  "less_than_or_equal",
  "equals",
  "not_equals",
]);

export const conditionSchema = z.object({
  metric: conditionMetricSchema,
  operator: conditionOperatorSchema,
  threshold: z.number().min(0, "Threshold must be a positive number"),
  workflowId: z.uuid().optional(),
  instanceId: z.uuid().optional(),
  timeWindow: z.enum(["1h", "6h", "24h", "7d"]),
});

export const addAlertRuleSchema = z.object({
  workspaceId: z.uuid().min(1, "Workspace is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  cooldownPeriod: z
    .number({
      message: "Cooldown period must be a number",
    })
    .int("Cooldown period must be a whole number")
    .min(1, "Cooldown must be at least 1 minute")
    .max(10_080, "Cooldown cannot exceed 7 days"),
  conditions: z
    .array(conditionSchema)
    .min(1, "At least one condition is required"),
  channelIds: z.array(z.uuid()).min(1, "At least one channel is required"),
});

export type Condition = z.infer<typeof conditionSchema>;
export type AddAlertRuleInput = z.infer<typeof addAlertRuleSchema>;
