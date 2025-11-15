import { Suspense } from "react";
import WorkflowPage from "@/components/features/workflow/workflow-page";
import WorkflowPageSkeleton from "@/components/features/workflow/workflow-page-skeleton";

export default function Page({
  params,
}: {
  params: Promise<{ workspaceSlug: string; workflowId: string }>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col py-6">
      <Suspense fallback={<WorkflowPageSkeleton />}>
        <WorkflowPage params={params} />
      </Suspense>
    </div>
  );
}
