import { Suspense } from "react";
import Workflows from "@/components/features/workflows/workflows";
import WorkflowsSkeleton from "@/components/features/workflows/workflows-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full flex-col rounded-lg bg-background">
      <Suspense fallback={<WorkflowsSkeleton />}>
        <Workflows params={params} />
      </Suspense>
    </div>
  );
}
