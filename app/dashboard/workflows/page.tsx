import { Suspense } from "react";
import WorkflowsPage from "@/components/features/workflows/workflows-page";
import WorkflowsPageSkeleton from "@/components/features/workflows/workflows-page-skeleton";

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col space-y-3 overflow-hidden py-6">
      <div className="flex h-8 items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Workflows</h2>
      </div>
      <Suspense fallback={<WorkflowsPageSkeleton />}>
        <WorkflowsPage />
      </Suspense>
    </div>
  );
}
