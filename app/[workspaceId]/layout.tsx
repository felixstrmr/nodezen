import { Suspense } from "react";
import DashboardNavbar from "@/components/layout/dashboard/dashboard-navbar";
import DashboardNavbarSkeleton from "@/components/layout/dashboard/dashboard-navbar-skeleton";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Suspense fallback={<DashboardNavbarSkeleton />}>
        <DashboardNavbar params={params} />
      </Suspense>
      {children}
    </div>
  );
}
