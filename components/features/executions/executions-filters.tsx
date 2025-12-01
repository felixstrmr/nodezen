"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExecutionsFilterParams } from "@/hooks/use-executions-filter-params";
import type { Instance, Workflow } from "@/types";

export default function ExecutionsFilters({
  instances,
  workflows,
}: {
  instances: Instance[];
  workflows: Workflow[];
}) {
  const { filter, setFilter } = useExecutionsFilterParams();

  return (
    <div className="flex size-full flex-col gap-3 p-3">
      <FieldGroup>
        <Field>
          <FieldLabel>Instance</FieldLabel>
          <Select
            onValueChange={(value) => setFilter({ instanceId: value })}
            value={filter.instanceId ?? undefined}
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
          <FieldLabel>Workflow</FieldLabel>
          <Select
            onValueChange={(value) => setFilter({ workflowId: value })}
            value={filter.workflowId ?? undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose workflow" />
            </SelectTrigger>
            <SelectContent align="start">
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    </div>
  );
}
