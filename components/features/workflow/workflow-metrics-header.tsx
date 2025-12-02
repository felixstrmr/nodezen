import type { TotalWorkflowMetric } from "@/types";
import { formatDuration } from "@/utils/time";

export default function WorkflowMetricsHeader({
  metrics,
}: {
  metrics: TotalWorkflowMetric;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5 border bg-muted p-1.5">
      <div className="space-y-1 rounded-md border bg-background p-3 shadow-xs">
        <p className="text-muted-foreground text-sm">Total executions</p>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.total_executions || 0}
        </p>
      </div>
      <div className="space-y-1 rounded-md border bg-background p-3 shadow-xs">
        <p className="text-muted-foreground text-sm">Failed executions</p>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.failed_executions || 0}
        </p>
      </div>
      <div className="space-y-1 rounded-md border bg-background p-3 shadow-xs">
        <p className="text-muted-foreground text-sm">Sucess rate</p>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.success_rate || 0}%
        </p>
      </div>
      <div className="space-y-1 rounded-md border bg-background p-3 shadow-xs">
        <p className="text-muted-foreground text-sm">Avg. duration</p>
        <p className="font-semibold text-lg tracking-tight">
          {metrics?.avg_duration_ms
            ? formatDuration(metrics?.avg_duration_ms)
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
