"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { addAlertRuleAction } from "@/actions/add-alert-rule-action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  addAlertRuleSchema,
  type Condition,
} from "@/schemas/add-alert-rule-schema";
import type { Database } from "@/types/supabase";

type AlertChannel = Database["public"]["Tables"]["alert_channels"]["Row"];
type WorkflowOption = { id: string; name: string; instanceId: string };
type InstanceOption = { id: string; name: string };

const METRIC_LABELS: Record<Condition["metric"], string> = {
  failed_executions: "Failed Executions",
  successful_executions: "Successful Executions",
  total_executions: "Total Executions",
  avg_duration_ms: "Average Duration (ms)",
  p50_duration_ms: "P50 Duration (ms)",
  p95_duration_ms: "P95 Duration (ms)",
  p99_duration_ms: "P99 Duration (ms)",
};

const OPERATOR_LABELS: Record<Condition["operator"], string> = {
  greater_than: ">",
  less_than: "<",
  greater_than_or_equal: "≥",
  less_than_or_equal: "≤",
  equals: "=",
  not_equals: "≠",
};

const ALL_INSTANCES_VALUE = "all-instances";
const ALL_WORKFLOWS_VALUE = "all-workflows";

export default function AddAlertRuleForm(props: {
  workspaceId: string;
  onOpenChangeAction: (open: boolean) => void;
  channels: AlertChannel[];
  workflows: WorkflowOption[];
  instances: InstanceOption[];
}) {
  const { workspaceId, onOpenChangeAction, channels, workflows, instances } =
    props;

  const form = useForm<z.output<typeof addAlertRuleSchema>>({
    resolver: zodResolver(addAlertRuleSchema),
    defaultValues: {
      workspaceId,
      name: "",
      description: "",
      isActive: true,
      cooldownPeriod: 15,
      conditions: [
        {
          metric: "failed_executions",
          operator: "greater_than",
          threshold: 0,
          timeWindow: "24h",
          workflowId: undefined,
          instanceId: undefined,
        },
      ],
      channelIds: [],
    },
  });

  const [conditionIds, setConditionIds] = useState<string[]>(() => [
    crypto.randomUUID(),
  ]);

  const { execute, isExecuting } = useAction(addAlertRuleAction, {
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "add-alert-rule-form",
      });
    },
    onSuccess: () => {
      onOpenChangeAction(false);
      toast.success("Alert rule created successfully", {
        id: "add-alert-rule-form",
      });
      form.reset({
        name: "",
        description: "",
        isActive: true,
        cooldownPeriod: 15,
        conditions: [
          {
            metric: "failed_executions",
            operator: "greater_than",
            threshold: 0,
            timeWindow: "24h",
            workflowId: undefined,
            instanceId: undefined,
          },
        ],
        channelIds: [],
      });
      setConditionIds([crypto.randomUUID()]);
    },
  });

  const workflowLookup = useMemo(
    () =>
      workflows.reduce<Record<string, WorkflowOption>>((acc, workflow) => {
        acc[workflow.id] = workflow;
        return acc;
      }, {}),
    [workflows]
  );

  const instanceLookup = useMemo(
    () =>
      instances.reduce<Record<string, InstanceOption>>((acc, instance) => {
        acc[instance.id] = instance;
        return acc;
      }, {}),
    [instances]
  );

  const conditions = form.watch("conditions");
  const channelIds = form.watch("channelIds");

  const addCondition = () => {
    form.setValue("conditions", [
      ...conditions,
      {
        metric: "failed_executions",
        operator: "greater_than",
        threshold: 0,
        timeWindow: "24h",
        workflowId: undefined,
        instanceId: undefined,
      },
    ]);
    setConditionIds([...conditionIds, crypto.randomUUID()]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length <= 1) {
      toast.error("At least one condition is required", {
        id: "add-alert-rule-form",
      });
      return;
    }
    form.setValue(
      "conditions",
      conditions.filter((_, i) => i !== index)
    );
    setConditionIds(conditionIds.filter((_, i) => i !== index));
  };

  const toggleChannel = (channelId: string) => {
    const isSelected = channelIds.includes(channelId);
    if (isSelected) {
      form.setValue(
        "channelIds",
        channelIds.filter((id) => id !== channelId)
      );
    } else {
      form.setValue("channelIds", [...channelIds, channelId]);
    }
  };

  return (
    <form className="h-full" onSubmit={form.handleSubmit(execute)}>
      <FieldGroup className="h-full">
        <div className="space-y-8 px-4">
          <div className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    autoFocus
                    disabled={isExecuting}
                    id="name"
                    placeholder="High Failure Rate"
                    required
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    disabled={isExecuting}
                    id="description"
                    placeholder="Alert when workflow failures exceed threshold"
                    rows={3}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="cooldownPeriod"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cooldown-period">
                    Cooldown Period (minutes)
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={isExecuting}
                    id="cooldown-period"
                    max={10_080}
                    min={1}
                    onChange={(event) =>
                      field.onChange(
                        Number.parseInt(event.target.value, 10) || 0
                      )
                    }
                    placeholder="15"
                    type="number"
                  />
                  <FieldDescription>
                    Minimum wait time before the rule can trigger again.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="space-y-4">
              <Field>
                <FieldLabel>Conditions</FieldLabel>
                <div className="space-y-3">
                  {conditions.map((condition, index) => {
                    const scopedInstanceId = condition?.instanceId;
                    const availableWorkflows = scopedInstanceId
                      ? workflows.filter(
                          (workflow) => workflow.instanceId === scopedInstanceId
                        )
                      : workflows;

                    return (
                      <div
                        className="flex flex-col gap-3 rounded-lg border p-3"
                        key={conditionIds[index]}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-sm">
                            Condition {index + 1}
                          </span>
                          {conditions.length > 1 && (
                            <Button
                              className="size-6"
                              disabled={isExecuting}
                              onClick={() => removeCondition(index)}
                              size="icon-sm"
                              type="button"
                              variant="outline"
                            >
                              <XIcon className="size-3.5 text-red-600" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Controller
                            control={form.control}
                            name={`conditions.${index}.metric`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldContent>
                                  <FieldLabel>Metric</FieldLabel>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </FieldContent>
                                <Select
                                  name={field.name}
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    aria-invalid={fieldState.invalid}
                                    disabled={isExecuting}
                                  >
                                    <SelectValue placeholder="Select metric" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(METRIC_LABELS).map(
                                      ([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                          {label}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name={`conditions.${index}.operator`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldContent>
                                  <FieldLabel>Operator</FieldLabel>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </FieldContent>
                                <Select
                                  name={field.name}
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    aria-invalid={fieldState.invalid}
                                    disabled={isExecuting}
                                  >
                                    <SelectValue placeholder="Select operator" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(OPERATOR_LABELS).map(
                                      ([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                          {label}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </Field>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Controller
                            control={form.control}
                            name={`conditions.${index}.threshold`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`threshold-${index}`}>
                                  Threshold
                                </FieldLabel>
                                <Input
                                  {...field}
                                  disabled={isExecuting}
                                  id={`threshold-${index}`}
                                  min={0}
                                  onChange={(event) =>
                                    field.onChange(
                                      Number.parseFloat(event.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  type="number"
                                  value={field.value}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name={`conditions.${index}.timeWindow`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldContent>
                                  <FieldLabel>Time Window</FieldLabel>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </FieldContent>
                                <Select
                                  name={field.name}
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    aria-invalid={fieldState.invalid}
                                    disabled={isExecuting}
                                  >
                                    <SelectValue placeholder="Select window" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1h">
                                      Last Hour
                                    </SelectItem>
                                    <SelectItem value="6h">
                                      Last 6 Hours
                                    </SelectItem>
                                    <SelectItem value="24h">
                                      Last 24 Hours
                                    </SelectItem>
                                    <SelectItem value="7d">
                                      Last 7 Days
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Controller
                            control={form.control}
                            name={`conditions.${index}.instanceId`}
                            render={({ field, fieldState }) => {
                              const value = field.value ?? ALL_INSTANCES_VALUE;

                              return (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldContent>
                                    <FieldLabel>Instance</FieldLabel>
                                    {fieldState.invalid && (
                                      <FieldError
                                        className="mt-0"
                                        errors={[fieldState.error]}
                                      />
                                    )}
                                  </FieldContent>
                                  <Select
                                    name={field.name}
                                    onValueChange={(nextValue) => {
                                      if (nextValue === ALL_INSTANCES_VALUE) {
                                        field.onChange(undefined);
                                        form.setValue(
                                          `conditions.${index}.workflowId`,
                                          undefined
                                        );
                                        return;
                                      }

                                      field.onChange(nextValue);
                                      const currentWorkflowId = form.getValues(
                                        `conditions.${index}.workflowId`
                                      );
                                      if (currentWorkflowId) {
                                        const workflow =
                                          workflowLookup[currentWorkflowId];
                                        if (
                                          workflow &&
                                          workflow.instanceId !== nextValue
                                        ) {
                                          form.setValue(
                                            `conditions.${index}.workflowId`,
                                            undefined
                                          );
                                        }
                                      }
                                    }}
                                    value={value}
                                  >
                                    <SelectTrigger
                                      aria-invalid={fieldState.invalid}
                                      disabled={isExecuting}
                                    >
                                      <SelectValue placeholder="All instances" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={ALL_INSTANCES_VALUE}>
                                        All instances
                                      </SelectItem>
                                      {instances.map((instance) => (
                                        <SelectItem
                                          key={instance.id}
                                          value={instance.id}
                                        >
                                          {instance.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </Field>
                              );
                            }}
                          />
                          <Controller
                            control={form.control}
                            name={`conditions.${index}.workflowId`}
                            render={({ field, fieldState }) => {
                              const value = field.value ?? ALL_WORKFLOWS_VALUE;
                              const hasWorkflows =
                                availableWorkflows.length > 0;

                              return (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldContent>
                                    <FieldLabel>Workflow</FieldLabel>
                                    {fieldState.invalid && (
                                      <FieldError
                                        className="mt-0"
                                        errors={[fieldState.error]}
                                      />
                                    )}
                                  </FieldContent>
                                  <Select
                                    disabled={isExecuting || !hasWorkflows}
                                    name={field.name}
                                    onValueChange={(nextValue) => {
                                      if (nextValue === ALL_WORKFLOWS_VALUE) {
                                        field.onChange(undefined);
                                        return;
                                      }

                                      field.onChange(nextValue);

                                      const workflow =
                                        workflowLookup[nextValue];
                                      if (workflow) {
                                        form.setValue(
                                          `conditions.${index}.instanceId`,
                                          workflow.instanceId
                                        );
                                      }
                                    }}
                                    value={value}
                                  >
                                    <SelectTrigger
                                      aria-invalid={fieldState.invalid}
                                      disabled={isExecuting || !hasWorkflows}
                                    >
                                      <SelectValue placeholder="All workflows" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={ALL_WORKFLOWS_VALUE}>
                                        All workflows
                                      </SelectItem>
                                      {availableWorkflows.map((workflow) => {
                                        const instanceName =
                                          instanceLookup[workflow.instanceId]
                                            ?.name;

                                        return (
                                          <SelectItem
                                            key={workflow.id}
                                            value={workflow.id}
                                          >
                                            {instanceName
                                              ? `${workflow.name} · ${instanceName}`
                                              : workflow.name}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </Field>
                              );
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  disabled={isExecuting}
                  onClick={addCondition}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <PlusIcon className="size-4" />
                  Add Condition
                </Button>
              </Field>
            </div>
            <Controller
              control={form.control}
              name="channelIds"
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Notification Channels</FieldLabel>
                  <div className="space-y-2">
                    {channels.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No channels available. Create a channel first.
                      </p>
                    ) : (
                      channels.map((channel) => {
                        const isSelected = channelIds.includes(channel.id);
                        return (
                          <button
                            className="flex w-full items-center justify-between rounded-md border p-3 text-left transition-colors hover:bg-accent"
                            disabled={isExecuting}
                            key={channel.id}
                            onClick={() => toggleChannel(channel.id)}
                            type="button"
                          >
                            <span className="font-medium text-sm">
                              {channel.name}
                            </span>
                            <input
                              checked={isSelected}
                              className="size-4"
                              disabled={isExecuting}
                              readOnly
                              type="checkbox"
                            />
                          </button>
                        );
                      })
                    )}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={() => onOpenChangeAction(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button isLoading={isExecuting} type="submit">
            Create Rule
          </Button>
        </SheetFooter>
      </FieldGroup>
    </form>
  );
}
