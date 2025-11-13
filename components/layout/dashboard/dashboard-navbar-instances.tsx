"use client";

import { ChevronDownIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Instance } from "@/types";

export default function DashboardNavbarInstances({
  instances,
}: {
  instances: Instance[];
}) {
  const [selectedInstance, setSelectedInstance] = useQueryState(
    "instance",
    parseAsString.withDefault("all")
  );

  return (
    <Select onValueChange={setSelectedInstance} value={selectedInstance}>
      <SelectTrigger className="text-foreground dark:bg-transparent dark:hover:bg-accent/50">
        <SelectValue placeholder="Theme" />
        <ChevronDownIcon className="size-4" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="all">All Instances</SelectItem>
        {instances.map((instance) => (
          <SelectItem key={instance.id} value={instance.id}>
            {instance.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
