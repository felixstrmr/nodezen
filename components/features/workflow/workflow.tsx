import { notFound } from "next/navigation";
import WorkflowExecutionsTable from "@/components/features/workflow/workflow-executions-table";
import WorkflowHeader from "@/components/features/workflow/workflow-header";
import { getExecutionsByWorkflowId } from "@/queries/executions";
import { getWorkflowTotalMetrics } from "@/queries/metrics";
import { getWorkflow } from "@/queries/workflows";
import WorkflowMetricsHeader from "./workflow-metrics-header";

export default async function Workflow({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  const { workspaceId, workflowId } = await params;
  const [
    { workflow, error },
    { metrics, error: totalMetricsError },
    { executions, error: executionsError },
  ] = await Promise.all([
    getWorkflow(workspaceId, workflowId),
    getWorkflowTotalMetrics(workspaceId, workflowId),
    getExecutionsByWorkflowId(workspaceId, workflowId),
  ]);

  if (error || totalMetricsError || executionsError) {
    return (
      <p>
        Error:{" "}
        {error?.message ||
          totalMetricsError?.message ||
          executionsError?.message}
      </p>
    );
  }

  if (!workflow) {
    notFound();
  }

  return (
    <div className="flex size-full flex-col">
      <WorkflowHeader workflow={workflow} />
      <div className="flex size-full flex-col gap-3 p-3">
        <WorkflowMetricsHeader metrics={metrics || null} />
        <WorkflowExecutionsTable executions={executions} />
      </div>
    </div>
  );
}
