import type { Execution } from "@/types";
import { formatDuration } from "@/utils/time";

export default function ExecutionsPageHeader({
  executions,
}: {
  executions: Execution[];
}) {
  const totalExecutions = executions.length;
  const failedExecutions = executions.filter(
    (execution) => execution.status === "error"
  ).length;
  const avgDuration =
    executions.reduce((acc, execution) => acc + execution.duration_ms, 0) /
    executions.length;
  const successRate =
    executions.filter((execution) => execution.status === "success").length /
    executions.length;

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Total Executions</p>
        <p className="font-semibold text-lg tracking-tight">
          {totalExecutions}
        </p>
      </div>
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Failed Executions</p>
        <p className="font-semibold text-lg tracking-tight">
          {failedExecutions}
        </p>
      </div>
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Avg Duration</p>
        <p className="font-semibold text-lg tracking-tight">
          {formatDuration(avgDuration)}
        </p>
      </div>
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Success Rate</p>
        <p className="font-semibold text-lg tracking-tight">
          {Math.round(successRate * 100)}%
        </p>
      </div>
    </div>
  );
}
