import type { Metadata } from "next/types";
import { Suspense } from "react";
import ExecutionsPage from "@/components/features/executions/executions-page";
import ExecutionsPageSkeleton from "@/components/features/executions/executions-page-skeleton";

export const metadata: Metadata = {
  title: "Nodezen • Executions",
};

export default function Page({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 overflow-hidden py-6">
      <div className="flex h-8 shrink-0 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Executions</h1>
      </div>
      <Suspense fallback={<ExecutionsPageSkeleton />}>
        <ExecutionsPage params={params} />
      </Suspense>
    </div>
  );
}
