import { format } from "date-fns";
import ExecutionStatusIcon from "@/components/icons/execution-status-icon";
import type { Execution } from "@/types";

export default function ExecutionCards({
  executions,
}: {
  executions: Execution[];
}) {
  return (
    <div className="flex size-full flex-col gap-1.5 overflow-y-auto">
      {executions.map((execution) => (
        <ExecutionCard execution={execution} key={execution.id} />
      ))}
    </div>
  );
}

function ExecutionCard({ execution }: { execution: Execution }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border/50 bg-muted/35 p-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted">
        <ExecutionStatusIcon className="size-6" status={execution.status} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold tracking-tight">
            {format(execution.n8n_started_at, "PPp")}
          </h3>
          <p className="text-muted-foreground text-sm">
            #{execution.n8n_execution_id}
          </p>
        </div>
      </div>
    </div>
  );
}
