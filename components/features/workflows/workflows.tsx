import WorkflowsTable from "@/components/features/workflows/workflows-table";
import { WorkflowIcon } from "@/components/icons";
import { getWorkflowsTotalMetrics } from "@/queries/metrics";
import { getWorkflows } from "@/queries/workflows";

export default async function Workflows({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const [{ workflows, error }, { metrics, error: totalMetricsError }] =
    await Promise.all([
      getWorkflows(workspaceId),
      getWorkflowsTotalMetrics(workspaceId),
    ]);

  if (error || totalMetricsError) {
    return <p>Error: {error?.message || totalMetricsError?.message}</p>;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <WorkflowIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">Workflows</h1>
          <span className="text-muted-foreground text-sm">
            {workflows.length}
          </span>
        </div>
      </div>
      <WorkflowsTable
        metrics={metrics}
        workflows={workflows}
        workspaceId={workspaceId}
      />
    </div>
  );
}
