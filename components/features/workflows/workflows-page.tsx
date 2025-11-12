import WorkflowCards from "@/components/features/workflows/workflows-cards";
import WorkflowsHeader from "@/components/features/workflows/workflows-header";
import { getInstances } from "@/queries/instance";
import { getWorkflows } from "@/queries/workflow";

export default async function WorkflowsPage() {
  const [workflows, instances] = await Promise.all([
    getWorkflows(),
    getInstances(),
  ]);

  return (
    <div className="flex size-full flex-col space-y-3 overflow-hidden">
      <WorkflowsHeader instances={instances} />
      <WorkflowCards workflows={workflows} />
    </div>
  );
}
