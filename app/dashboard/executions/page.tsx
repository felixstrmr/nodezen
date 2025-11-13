import { Suspense } from "react";
import ExecutionsPage from "@/components/features/executions/executions-page";
import ExecutionsPageSkeleton from "@/components/features/executions/executions-page-skeleton";

export default function Page() {
  return (
    <div className="mx-auto flex size-full max-w-6xl flex-col overflow-hidden py-6">
      <div className="flex h-8 items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Executions</h2>
      </div>
      <Suspense fallback={<ExecutionsPageSkeleton />}>
        <ExecutionsPage />
      </Suspense>
    </div>
  );
}
