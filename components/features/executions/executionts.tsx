"use client";

import { useEffect, useMemo, useRef } from "react";
import ExecutionsTable from "@/components/features/executions/executions-table";
import { ExecutionIcon } from "@/components/icons";
import { useExecutionsParams } from "@/hooks/use-executions-params";
import {
  type SupabaseQueryHandler,
  useInfiniteQuery,
} from "@/hooks/use-infinite-query";
import type { Database } from "@/types/supabase";

type ExecutionRow = Database["public"]["Tables"]["executions"]["Row"] & {
  workflow: {
    id: string;
    name: string;
    instance: {
      id: string;
      name: string;
    } | null;
  } | null;
};

export default function Executions({ workspaceId }: { workspaceId: string }) {
  const { params } = useExecutionsParams();

  const trailingQuery: SupabaseQueryHandler<"executions"> = useMemo(
    () => (query) => {
      let q = query
        .eq("workspace", workspaceId)
        .order("started_at", { ascending: false });

      if (params.workflowId) {
        q = q.eq("workflow", params.workflowId);
      }

      if (params.instanceId) {
        q = q.eq("workflow.instance", params.instanceId);
      }

      if (
        params.status &&
        Array.isArray(params.status) &&
        params.status.length > 0
      ) {
        q = q.in(
          "status",
          params.status as unknown as readonly Database["public"]["Enums"]["execution_statuses"][]
        );
      }

      if (params.mode && Array.isArray(params.mode) && params.mode.length > 0) {
        q = q.in(
          "mode",
          params.mode as unknown as readonly Database["public"]["Enums"]["execution_modes"][]
        );
      }

      return q;
    },
    [
      workspaceId,
      params.workflowId,
      params.instanceId,
      params.status,
      params.mode,
    ]
  );

  const columns = useMemo(
    () =>
      `id,
      n8n_execution_id,
      mode,
      status,
      started_at,
      stopped_at,
      error_node,
      error_message,
      duration_ms,
      ${params.instanceId ? "workflow!inner" : "workflow"}(id, name, instance(id, name)),
      workspace!inner(id),
      retry_of`,
    [params.instanceId]
  );

  const {
    data,
    count,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
    reset,
  } = useInfiniteQuery<ExecutionRow, "executions">({
    tableName: "executions",
    columns,
    pageSize: 20,
    trailingQuery,
  });

  const filterDeps = JSON.stringify({
    workspaceId,
    workflowId: params.workflowId,
    instanceId: params.instanceId,
    status: params.status,
    mode: params.mode,
  });

  const prevFilterDepsRef = useRef(filterDeps);

  useEffect(() => {
    if (prevFilterDepsRef.current !== filterDeps) {
      if (!isLoading) {
        reset();
      }
      prevFilterDepsRef.current = filterDeps;
    }
  }, [filterDeps, reset, isLoading]);

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
            {isLoading ? "Loading..." : `Showing ${data.length} of ${count}`}
          </span>
        </div>
      </div>
      <ExecutionsTable
        executions={data}
        fetchNextPage={fetchNextPage}
        hasMore={hasMore}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </div>
  );
}
