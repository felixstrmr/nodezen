import { WorkflowsTable } from "@/components/features/workflows/workflows-table";
import { WorkflowsTableColumns } from "@/components/features/workflows/workflows-table-columns";
import { getWorkflows } from "@/queries/workflow";

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const workflows = await getWorkflows(workspaceSlug);

  return (
    <WorkflowsTable
      columns={WorkflowsTableColumns}
      data={workflows}
      workspaceSlug={workspaceSlug}
    />
  );
}
