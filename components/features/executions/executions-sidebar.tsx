import { getInstances } from "@/queries/instances";
import { getWorkflows } from "@/queries/workflows";
import ExecutionsFilters from "./executions-filters";

export default async function ExecutionsSidebar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const [{ instances, error }, { workflows, error: workflowsError }] =
    await Promise.all([getInstances(workspaceId), getWorkflows(workspaceId)]);

  if (error || workflowsError) {
    return <p>Error: {error?.message || workflowsError?.message}</p>;
  }

  return (
    <div className="flex min-w-64 max-w-64 flex-col rounded-lg bg-background">
      <div className="border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <h1 className="font-semibold text-xl tracking-tight">Filters</h1>
        </div>
      </div>
      <ExecutionsFilters instances={instances} workflows={workflows} />
    </div>
  );
}
