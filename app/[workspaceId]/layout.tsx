import { Suspense } from "react";
import WorkspaceHeader from "@/components/layout/workspace-header";
import WorkspaceHeaderSkeleton from "@/components/layout/workspace-header-skeleton";
import WorkspaceSidebar from "@/components/layout/workspace-sidebar";
import WorkspaceSidebarSkeleton from "@/components/layout/workspace-sidebar-skeleton";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full gap-1 bg-neutral-900/75 p-1">
      <Suspense fallback={<WorkspaceSidebarSkeleton />}>
        <WorkspaceSidebar params={params} />
      </Suspense>
      <div className="flex size-full flex-col gap-1">
        <Suspense fallback={<WorkspaceHeaderSkeleton />}>
          <WorkspaceHeader params={params} />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
