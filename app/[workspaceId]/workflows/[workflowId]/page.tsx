import { Suspense } from "react";
import Workflow from "@/components/features/workflow/workflow";
import WorkflowSkeleton from "@/components/features/workflow/workflow-skeleton";

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  return (
    <div className="flex size-full flex-col rounded-lg bg-background">
      <Suspense fallback={<WorkflowSkeleton />}>
        <Workflow params={params} />
      </Suspense>
    </div>
  );
}
