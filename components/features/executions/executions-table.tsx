"use client";

import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useExecutionsParams } from "@/hooks/use-executions-params";
import type { Execution } from "@/types";
import { formatDuration } from "@/utils/time";
import { cn } from "@/utils/ui";

export default function ExecutionsTable({
  executions,
}: {
  executions: Execution[];
}) {
  const { params } = useExecutionsParams();

  const filteredExecutions = useMemo(
    () =>
      executions?.filter((execution) => {
        if (params.workflowId) {
          return execution.workflow.id === params.workflowId;
        }
        if (params.instanceId) {
          return execution.workflow.instance?.id === params.instanceId;
        }
        if (params.status) {
          return params.status.includes(execution.status);
        }
        if (params.mode) {
          return params.mode.includes(execution.mode);
        }
        return true;
      }) ?? [],
    [executions, params]
  );

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="grid grid-cols-8 border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p className="col-span-2">Started at</p>
        <p className="col-span-3">Workflow</p>
        <p className="col-span-1">Status</p>
        <p className="col-span-1">Mode</p>
        <p className="col-span-1">Duration</p>
      </div>
      <div className="flex flex-col overflow-y-auto">
        {filteredExecutions.map((execution) => (
          <div
            className={cn(
              "grid grid-cols-8 items-center border-b p-2 text-sm",
              execution.status === "error" && "bg-red-50"
            )}
            key={execution.id}
          >
            <div className="col-span-2 flex items-center gap-2">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-md",
                  execution.status === "success"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                )}
              >
                {execution.status === "success" ? (
                  <CheckIcon className="size-3.5 text-green-600" />
                ) : (
                  <XIcon className="size-3.5 text-red-600" />
                )}
              </div>
              <p className="col-span-2">
                {format(execution.started_at, "PPp")}
              </p>
            </div>
            <p className="col-span-3">{execution.workflow.name}</p>
            <Badge
              className="gap-1.5 rounded-sm bg-background px-1.5 capitalize"
              variant="outline"
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  execution.status === "success" ? "bg-green-500" : "bg-red-500"
                )}
              />
              {execution.status}
            </Badge>
            <p className="col-span-1 text-muted-foreground capitalize">
              {execution.mode}
            </p>
            <p className="col-span-1 font-mono text-muted-foreground">
              {execution.duration_ms
                ? formatDuration(execution.duration_ms)
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
