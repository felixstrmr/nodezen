"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExecutionsParams } from "@/hooks/use-executions-params";
import { EXECUTION_MODES, EXECUTION_STATUSES } from "@/lib/constants";
import type { Instance, Workflow } from "@/types";

export default function ExecutionsFilters({
  instances,
  workflows,
}: {
  instances: Instance[];
  workflows: Workflow[];
}) {
  const { params, setParams } = useExecutionsParams();

  return (
    <div className="flex size-full flex-col gap-3 p-3">
      <FieldGroup>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Instance</FieldLabel>
            {params.instanceId ? (
              <button
                className="cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground"
                onClick={() => setParams({ instanceId: null })}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
          <Select
            key={params.instanceId || "instance-select"}
            onValueChange={(value) => setParams({ instanceId: value })}
            value={params.instanceId || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose instance" />
            </SelectTrigger>
            <SelectContent align="start">
              {instances.map((instance) => (
                <SelectItem key={instance.id} value={instance.id}>
                  {instance.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Workflow</FieldLabel>
            {params.workflowId ? (
              <button
                className="cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground"
                onClick={() => setParams({ workflowId: null })}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
          <Select
            key={params.workflowId || "workflow-select"}
            onValueChange={(value) => setParams({ workflowId: value })}
            value={params.workflowId || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose workflow" />
            </SelectTrigger>
            <SelectContent align="start" className="max-w-58">
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  <span className="truncate">{workflow.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <FieldSet className="gap-1.5">
          <div className="flex items-center justify-between">
            <FieldLegend variant="label">Status</FieldLegend>
            {Array.isArray(params.status) && params.status.length > 0 ? (
              <button
                className="cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground"
                onClick={() => setParams({ status: null })}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
          <FieldGroup className="gap-0 overflow-hidden rounded-md border">
            {EXECUTION_STATUSES.map((status) => (
              <Field
                className="cursor-pointer border-b p-1.5 transition-colors last:border-b-0 hover:bg-muted/50"
                key={status}
                onClick={() => {
                  if (params.status?.includes(status)) {
                    const filtered = params.status.filter((s) => s !== status);
                    if (filtered.length === 0) {
                      setParams({ status: null });
                    } else {
                      setParams({ status: filtered });
                    }
                  } else {
                    setParams({
                      status: [...(params.status || []), status],
                    });
                  }
                }}
                orientation="horizontal"
              >
                <Checkbox
                  checked={params.status?.includes(status) ?? false}
                  id={status}
                />
                <span className="text-sm capitalize" key={status}>
                  {status}
                </span>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
        <FieldSet className="gap-1.5">
          <div className="flex items-center justify-between">
            <FieldLegend variant="label">Mode</FieldLegend>
            {Array.isArray(params.mode) && params.mode.length > 0 ? (
              <button
                className="cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground"
                onClick={() => setParams({ mode: null })}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
          <FieldGroup className="gap-0 overflow-hidden rounded-md border">
            {EXECUTION_MODES.map((mode) => (
              <Field
                className="cursor-pointer border-b p-1.5 transition-colors last:border-b-0 hover:bg-muted/50"
                key={mode}
                onClick={() => {
                  if (params.mode?.includes(mode)) {
                    const filtered = params.mode.filter((m) => m !== mode);
                    if (filtered.length === 0) {
                      setParams({ mode: null });
                    } else {
                      setParams({ mode: filtered });
                    }
                  } else {
                    setParams({
                      mode: [...(params.mode || []), mode],
                    });
                  }
                }}
                orientation="horizontal"
              >
                <Checkbox
                  checked={params.mode?.includes(mode) ?? false}
                  id={mode}
                />
                <span className="text-sm capitalize" key={mode}>
                  {mode}
                </span>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
