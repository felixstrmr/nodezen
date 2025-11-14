import WorkflowsHeader from "@/components/features/workflows/workflows-header";
import { getWorkflows } from "@/queries/workflow";
import { WorkflowsTable } from "./workflows-table";
import { workflowsTableColumns } from "./workflows-table-columns";

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();

  const filteredWorkflows = workflows.filter(
    (workflow) => !workflow.is_archived
  );

  return (
    <div className="flex size-full flex-col gap-3">
      <WorkflowsHeader workflows={filteredWorkflows} />
      <WorkflowsTable
        columns={workflowsTableColumns}
        data={filteredWorkflows}
      />
    </div>
  );
}
