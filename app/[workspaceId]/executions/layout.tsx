import { Suspense } from "react";
import ExecutionsSidebar from "@/components/features/executions/executions-sidebar";
import ExecutionsSidebarSkeleton from "@/components/features/executions/executions-sidebar-skeleton";

export default function ExecutionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full gap-1 overflow-hidden">
      <Suspense fallback={<ExecutionsSidebarSkeleton />}>
        <ExecutionsSidebar params={params} />
      </Suspense>
      {children}
    </div>
  );
}
