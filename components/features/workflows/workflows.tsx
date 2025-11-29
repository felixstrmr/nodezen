import WorkflowsTable from "@/components/features/workflows/workflows-table";
import { WorkflowIcon } from "@/components/icons";
import { getWorkflows } from "@/queries/workflows";

export default async function Workflows({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { workflows, error } = await getWorkflows(workspaceId);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <WorkflowIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">Workflows</h1>
        </div>
      </div>
      <WorkflowsTable workflows={workflows} />
    </div>
  );
}
