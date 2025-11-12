"use client";

import { ListFilterIcon, ServerIcon } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Instance } from "@/types";

export default function WorkflowsHeader({
  instances,
}: {
  instances: Instance[];
}) {
  const [filters, setFilters] = useQueryStates({
    instanceId: parseAsString.withDefault(""),
    sort: parseAsString,
  });

  return (
    <div className="flex items-center justify-between">
      <h2 className="font-bold text-xl tracking-tight">Workflows</h2>
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => setFilters({ sort: value })}
          value={filters.sort ?? undefined}
        >
          <SelectTrigger>
            <ListFilterIcon className="size-3.5" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="created">Created</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setFilters({ instanceId: value })}
          value={filters.instanceId}
        >
          <SelectTrigger>
            <ServerIcon className="size-3.5" />
            <SelectValue placeholder="Instance" />
          </SelectTrigger>
          <SelectContent align="end">
            {instances.map((instance) => (
              <SelectItem key={instance.id} value={instance.id}>
                {instance.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
