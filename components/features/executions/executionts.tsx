import type { SearchParams } from "nuqs/server";
import ExecutionsTable from "@/components/features/executions/executions-table";
import { ExecutionIcon } from "@/components/icons";
import { loadExecutionsParams } from "@/hooks/use-executions-params";
import { getExecutions } from "@/queries/executions";

export default async function Executions({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { workspaceId } = await params;
  const { start, end } = await loadExecutionsParams(searchParams);

  const { executions, error } = await getExecutions(workspaceId, start, end);

  if (error) {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <ExecutionIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">Executions</h1>
          <span className="text-muted-foreground text-sm">
            Showing {executions.length} of {executions.length}
          </span>
        </div>
      </div>
      <ExecutionsTable executions={executions} />
    </div>
  );
}
