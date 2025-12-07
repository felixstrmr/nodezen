import { Suspense } from "react";
import ExecutionsSidebar from "@/components/features/executions/executions-sidebar";
import ExecutionsSidebarSkeleton from "@/components/features/executions/executions-sidebar-skeleton";
import ExecutionsSkeleton from "@/components/features/executions/executions-skeleton";
import Executions from "@/components/features/executions/executionts";

async function ExecutionsWrapper({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return <Executions workspaceId={workspaceId} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full gap-1 overflow-hidden">
      <Suspense fallback={<ExecutionsSidebarSkeleton />}>
        <ExecutionsSidebar params={params} />
      </Suspense>
      <div className="flex size-full flex-col overflow-hidden rounded-lg bg-background">
        <Suspense fallback={<ExecutionsSkeleton />}>
          <ExecutionsWrapper params={params} />
        </Suspense>
      </div>
    </div>
  );
}
