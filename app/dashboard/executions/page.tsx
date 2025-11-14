import { Suspense } from "react";
import ExecutionsPage from "@/components/features/executions/executions-page";
import ExecutionsPageSkeleton from "@/components/features/executions/executions-page-skeleton";

export default function Page() {
  return (
    <div className="mx-auto flex size-full max-w-7xl flex-col overflow-hidden py-6">
      <Suspense fallback={<ExecutionsPageSkeleton />}>
        <ExecutionsPage />
      </Suspense>
    </div>
  );
}
