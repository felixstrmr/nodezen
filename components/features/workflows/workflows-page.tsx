import WorkflowsHeader from "@/components/features/workflows/workflows-header";
import { getInstances } from "@/queries/instance";
import { getWorkflows } from "@/queries/workflow";
import { WorkflowsTable } from "./workflows-table";
import { workflowsTableColumns } from "./workflows-table-columns";

export default async function WorkflowsPage() {
  const [workflows, instances] = await Promise.all([
    getWorkflows(),
    getInstances(),
  ]);

  return (
    <div className="flex size-full flex-col gap-3">
      <WorkflowsHeader instances={instances} />
      <WorkflowsTable columns={workflowsTableColumns} data={workflows} />
    </div>
  );
}
