import type { Workflow } from "@/types";

export default function WorkflowsHeader({
  workflows,
}: {
  workflows: Workflow[];
}) {
  const totalWorkflows = workflows.filter((workflow) => !workflow.is_archived);

  const activeWorkflows = workflows.filter((workflow) => workflow.is_active);
  const failedWorkflows = workflows.filter(
    (workflow) => workflow.last_execution_status === "error"
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="flex h-8 items-center font-semibold text-xl tracking-tight">
        Workflows
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="font-bold text-2xl text-foreground">
            {totalWorkflows.length}
          </p>
        </div>
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Active</p>
          <p className="font-bold text-2xl text-foreground">
            {activeWorkflows.length}
          </p>
        </div>
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Failed</p>
          <p className="font-bold text-2xl text-foreground">
            {failedWorkflows.length}
          </p>
        </div>
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Sucess Rate</p>
          <p className="font-bold text-2xl text-foreground">
            {Math.round((activeWorkflows.length / workflows.length) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
