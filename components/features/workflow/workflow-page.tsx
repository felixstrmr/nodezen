import { notFound } from "next/navigation";
import { getExecutionsByWorkflowId } from "@/queries/execution";
import { getWorkflow } from "@/queries/workflow";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; workflowId: string }>;
}) {
  const { workspaceSlug, workflowId } = await params;
  const [workflow, executions] = await Promise.all([
    getWorkflow(workspaceSlug, workflowId),
    getExecutionsByWorkflowId(workspaceSlug, workflowId),
  ]);

  if (!workflow) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-8 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">
          {workflow.name}
        </h1>
      </div>
      <pre>{JSON.stringify(workflow, null, 2)}</pre>
      <pre>{JSON.stringify(executions, null, 2)}</pre>
    </div>
  );
}
