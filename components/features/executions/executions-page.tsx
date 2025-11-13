import ExecutionCards from "@/components/features/executions/executions-cards";
import { getExecutionsByWorkflowId } from "@/queries/execution";

export default async function ExecutionsPage({
  params,
}: {
  params: Promise<{ instanceId: string }>;
}) {
  const { instanceId } = await params;

  const executions = await getExecutionsByWorkflowId(instanceId);

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <ExecutionCards executions={executions} />
    </div>
  );
}
