import { WorkflowIcon } from "@/components/icons";
import { getWorkflowTotalMetrics } from "@/queries/metrics";
import { getWorkflow } from "@/queries/workflows";
import WorkflowMetricsHeader from "./workflow-metrics-header";

export default async function Workflow({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  const { workspaceId, workflowId } = await params;
  const [{ workflow, error }, { metrics, error: totalMetricsError }] =
    await Promise.all([
      getWorkflow(workspaceId, workflowId),
      getWorkflowTotalMetrics(workspaceId, workflowId),
    ]);

  if (error || totalMetricsError) {
    return <p>Error: {error?.message || totalMetricsError?.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <WorkflowIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">
            {workflow?.name}
          </h1>
          <span className="text-muted-foreground text-sm">
            {workflow?.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div className="flex size-full flex-col p-3">
        <WorkflowMetricsHeader metrics={metrics} />
      </div>
    </div>
  );
}
