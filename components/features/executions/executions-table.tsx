"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import { useExecutionsParams } from "@/hooks/use-executions-params";
import type { Execution } from "@/types";
import { formatDuration } from "@/utils/time";

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
            className="grid grid-cols-8 border-b p-3 text-sm"
            key={execution.id}
          >
            <p className="col-span-2">{format(execution.started_at, "PPp")}</p>
            <p className="col-span-3">{execution.workflow.name}</p>
            <p className="col-span-1 capitalize">{execution.status}</p>
            <p className="col-span-1 capitalize">{execution.mode}</p>
            <p className="col-span-1 font-mono">
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
