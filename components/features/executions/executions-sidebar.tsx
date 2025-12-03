import { getInstances } from "@/queries/instances";
import { getWorkspaceTotalMetrics } from "@/queries/metrics";
import { getWorkflows } from "@/queries/workflows";
import ExecutionsFilters from "./executions-filters";

export default async function ExecutionsSidebar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const [{ instances }, { workflows }, { metrics }] = await Promise.all([
    getInstances(workspaceId),
    getWorkflows(workspaceId),
    getWorkspaceTotalMetrics(workspaceId),
  ]);

  return (
    <div className="flex min-w-64 max-w-64 flex-col rounded-lg bg-background">
      <div className="border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <h1 className="font-semibold text-xl tracking-tight">Filters</h1>
        </div>
      </div>
      <ExecutionsFilters
        instances={instances}
        metrics={metrics}
        workflows={workflows}
      />
    </div>
  );
}
