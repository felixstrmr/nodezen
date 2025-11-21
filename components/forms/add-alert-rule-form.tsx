"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChartLineIcon, WorkflowIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { addAlertRuleAction } from "@/actions/add-alert-rule-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addAlertRuleSchema } from "@/schemas/add-alert-rule-schema";
import type { AlertChannel, Instance, Workflow } from "@/types";

const EVENT_TYPES = {
  execution_error: "Execution Error",
  execution_success: "Execution Success",
  instance_disconnected: "Instance Disconnected",
  instance_connected: "Instance Connected",
  workflow_activated: "Workflow Activated",
  workflow_deactivated: "Workflow Deactivated",
} as const;

export default function AddAlertRuleForm({
  workspaceId,
  instances,
  workflows,
  channels,
  onOpenChangeAction,
}: {
  workspaceId: string;
  instances: Instance[];
  workflows: Workflow[];
  channels: AlertChannel[];
  onOpenChangeAction: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof addAlertRuleSchema>>({
    resolver: zodResolver(addAlertRuleSchema),
    defaultValues: {
      workspaceId,
      name: "",
      type: "event",
      eventType: undefined,
      instanceId: "all",
      workflowId: "all",
      channelIds: [],
    },
  });

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
    },
  });

  const selectedInstanceId = form.watch("instanceId");
  const selectedType = form.watch("type");

  // Group workflows by instance name
  const groupedWorkflows = useMemo(
    () =>
      workflows.reduce(
        (acc, workflow) => {
          acc[workflow.instance.name] = [
            ...(acc[workflow.instance.name] || []),
            workflow,
          ];
          return acc;
        },
        {} as Record<string, Workflow[]>
      ),
    [workflows]
  );

  // Filter workflows based on selected instance
  const filteredWorkflows = useMemo(() => {
    if (selectedInstanceId === "all" || !selectedInstanceId) {
      return groupedWorkflows;
    }
    const selectedInstance = instances.find((i) => i.id === selectedInstanceId);
    if (!selectedInstance) {
      return {};
    }
    return {
      [selectedInstance.name]: workflows.filter(
        (w) => w.instance.id === selectedInstanceId
      ),
    };
  }, [selectedInstanceId, instances, workflows, groupedWorkflows]);

  // Handle instance change - reset workflow to "all"
  const handleInstanceChange = useCallback(
    (value: string) => {
      form.setValue("instanceId", value);
      if (value !== form.getValues("workflowId")) {
        form.setValue("workflowId", "all");
      }
    },
    [form]
  );

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
                    placeholder="My Alert Rule"
                    required
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <Tabs
                onValueChange={(value) => {
                  const newType = value as "event" | "metric";
                  form.setValue("type", newType);
                  // Reset event-specific fields when switching types
                  if (newType === "metric") {
                    form.setValue("eventType", undefined);
                    form.setValue("instanceId", "all");
                    form.setValue("workflowId", "all");
                  }
                }}
                value={selectedType}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="event">
                    <WorkflowIcon className="text-muted-foreground" />
                    Event
                  </TabsTrigger>
                  <TabsTrigger disabled value="metric">
                    <ChartLineIcon className="text-muted-foreground" />
                    Metric (Soon)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
          </div>
          <div className="space-y-4">
            {form.watch("type") === "event" && (
              <div className="space-y-4">
                <Controller
                  control={form.control}
                  name="eventType"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="event_type">
                          Event Type
                          <span className="-ml-1.5 text-destructive">*</span>
                        </FieldLabel>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Select
                        disabled={isExecuting}
                        onValueChange={field.onChange}
                        required
                        value={field.value || ""}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          aria-required="true"
                          disabled={isExecuting}
                          id="event_type"
                        >
                          <SelectValue placeholder="Select Event Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(EVENT_TYPES).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="instanceId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="instance_id">Instance</FieldLabel>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Select
                        disabled={isExecuting}
                        onValueChange={handleInstanceChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          disabled={isExecuting}
                          id="instance_id"
                        >
                          <SelectValue placeholder="Select Instance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Instances</SelectItem>
                          {instances.map((instance) => (
                            <SelectItem key={instance.id} value={instance.id}>
                              {instance.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="workflowId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel htmlFor="workflow_id">Workflow</FieldLabel>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Select
                        disabled={
                          isExecuting ||
                          form.watch("eventType") === "instance_connected" ||
                          form.watch("eventType") === "instance_disconnected"
                        }
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          disabled={isExecuting}
                          id="workflow_id"
                        >
                          <SelectValue placeholder="Select Workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Workflows</SelectItem>
                          {Object.keys(filteredWorkflows).length > 0 ? (
                            Object.entries(filteredWorkflows).map(
                              ([instanceName, instanceWorkflows]) => (
                                <div key={instanceName}>
                                  <p className="mt-3 mb-0.5 ml-2 text-muted-foreground text-xs first:mt-1.5">
                                    {instanceName}
                                  </p>
                                  {instanceWorkflows.map((workflow) => (
                                    <SelectItem
                                      key={workflow.id}
                                      value={workflow.id}
                                    >
                                      {workflow.name}
                                    </SelectItem>
                                  ))}
                                </div>
                              )
                            )
                          ) : (
                            <SelectItem disabled value="">
                              No workflows available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            )}
            {form.watch("type") === "metric" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <FieldLabel htmlFor="metric">Metric</FieldLabel>
                </div>
              </div>
            )}
            <Controller
              control={form.control}
              name="channelIds"
              render={({ field, fieldState }) => {
                const selectedChannelIds = field.value || [];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="channel_ids">Channels</FieldLabel>
                      <div className="space-y-1.5">
                        {channels.length === 0 ? (
                          <p className="py-2 text-muted-foreground text-sm">
                            No channels available. Create a channel first.
                          </p>
                        ) : (
                          channels.map((channel) => {
                            const config = channel.config as {
                              recipients?: string[];
                            };
                            const recipients = config?.recipients;
                            const isChecked = selectedChannelIds.includes(
                              channel.id
                            );

                            return (
                              <Label
                                className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent"
                                htmlFor={`channel-${channel.id}`}
                                key={channel.id}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  disabled={isExecuting}
                                  id={`channel-${channel.id}`}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...selectedChannelIds, channel.id]
                                      : selectedChannelIds.filter(
                                          (id) => id !== channel.id
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                                <div className="grid gap-1.5">
                                  <p className="text-sm leading-none">
                                    {channel.name}
                                  </p>
                                  {recipients && recipients.length > 0 ? (
                                    <p className="text-muted-foreground text-xs">
                                      {recipients.join(", ")}
                                    </p>
                                  ) : (
                                    <p className="text-muted-foreground text-xs">
                                      No recipients configured
                                    </p>
                                  )}
                                </div>
                              </Label>
                            );
                          })
                        )}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                );
              }}
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
            Add Rule
          </Button>
        </SheetFooter>
      </FieldGroup>
    </form>
  );
}
