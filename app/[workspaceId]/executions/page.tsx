import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ExecutionsSidebar from "@/components/features/executions/executions-sidebar";
import ExecutionsSidebarSkeleton from "@/components/features/executions/executions-sidebar-skeleton";
import ExecutionsSkeleton from "@/components/features/executions/executions-skeleton";
import Executions from "@/components/features/executions/executionts";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="flex size-full gap-1">
      <Suspense fallback={<ExecutionsSidebarSkeleton />}>
        <ExecutionsSidebar params={params} />
      </Suspense>
      <div className="flex size-full flex-col overflow-hidden rounded-lg bg-background">
        <Suspense fallback={<ExecutionsSkeleton />}>
          <Executions params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
