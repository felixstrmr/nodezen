import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  ListIcon,
} from "lucide-react";
import type { TotalWorkflowMetric } from "@/types";
import { formatDuration } from "@/utils/time";

export default function WorkflowMetricsHeader({
  metrics,
}: {
  metrics: TotalWorkflowMetric | null;
}) {
  return (
    <div className="grid grid-cols-4 gap-0.5 rounded-lg border bg-muted p-0.5">
      <div className="rounded-md border bg-background p-3 shadow-xs">
        <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted">
          <ListIcon className="size-4" />
        </div>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.total_executions || 0}
        </p>
        <p className="text-muted-foreground text-sm">Total executions</p>
      </div>
      <div className="rounded-md border bg-background p-3 shadow-xs">
        <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted">
          <CircleXIcon className="size-4" />
        </div>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.failed_executions || 0}
        </p>
        <p className="text-muted-foreground text-sm">Failed executions</p>
      </div>
      <div className="rounded-md border bg-background p-3 shadow-xs">
        <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted">
          <CircleCheckIcon className="size-4" />
        </div>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.success_rate || 0}%
        </p>
        <p className="text-muted-foreground text-sm">Sucess rate</p>
      </div>
      <div className="rounded-md border bg-background p-3 shadow-xs">
        <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted">
          <ClockIcon className="size-4" />
        </div>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.avg_duration_ms
            ? formatDuration(metrics?.avg_duration_ms)
            : "N/A"}
        </p>
        <p className="text-muted-foreground text-sm">Avg. duration</p>
      </div>
    </div>
  );
}
