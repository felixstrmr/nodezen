import { Suspense } from "react";
import DashboardNavbar from "@/components/layout/dashboard-navbar";
import DashboardNavbarSkeleton from "@/components/layout/dashboard-navbar-skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-col">
      <Suspense fallback={<DashboardNavbarSkeleton />}>
        <DashboardNavbar />
      </Suspense>
      {children}
    </div>
  );
}
