import { Suspense } from "react";
import ExecutionsSkeleton from "@/components/features/executions/executions-skeleton";
import Executions from "@/components/features/executions/executionts";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden rounded-lg bg-background">
      <Suspense fallback={<ExecutionsSkeleton />}>
        <Executions params={params} />
      </Suspense>
    </div>
  );
}
