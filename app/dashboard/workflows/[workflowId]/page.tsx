import { Suspense } from "react";
import WorkflowPage from "@/components/features/workflow/workflow-page";
import WorkflowPageSkeleton from "@/components/features/workflow/workflow-page-skeleton";

export default function Page({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  return (
    <div className="mx-auto flex size-full max-w-7xl overflow-hidden py-6">
      <Suspense fallback={<WorkflowPageSkeleton />}>
        <WorkflowPage params={params} />
      </Suspense>
    </div>
  );
}
