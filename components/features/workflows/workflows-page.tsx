import WorkflowCards from "@/components/features/workflows/workflows-cards";
import WorkflowsHeader from "@/components/features/workflows/workflows-header";
import { getWorkflows } from "@/queries/workflow";

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ instanceId: string }>;
}) {
  const { instanceId } = await params;

  const workflows = await getWorkflows(instanceId);

  return (
    <div className="flex size-full flex-col gap-3">
      <WorkflowsHeader workflows={workflows} />
      <WorkflowCards workflows={workflows} />
    </div>
  );
}
