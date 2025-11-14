import { Suspense } from "react";
import WorkflowsPage from "@/components/features/workflows/workflows-page";
import WorkflowsPageSkeleton from "@/components/features/workflows/workflows-page-skeleton";

export default function Page() {
  return (
    <div className="mx-auto flex size-full max-w-7xl overflow-hidden py-6">
      <Suspense fallback={<WorkflowsPageSkeleton />}>
        <WorkflowsPage />
      </Suspense>
    </div>
  );
}
