import { getWorkflow } from "@/queries/workflows";

export default async function Workflow({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  const { workspaceId, workflowId } = await params;
  const { workflow, error } = await getWorkflow(workspaceId, workflowId);

  if (error) {
    return <p>Error: {error?.message}</p>;
  }

  return <div>Workflow {workflow?.name}</div>;
}
