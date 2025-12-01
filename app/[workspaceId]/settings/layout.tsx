import { Suspense } from "react";
import SettingsSidebar from "@/components/layout/settings-sidebar";
import SettingsSidebarSkeleton from "@/components/layout/settings-sidebar-skeleton";

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full gap-1 overflow-hidden">
      <Suspense fallback={<SettingsSidebarSkeleton />}>
        <SettingsSidebar params={params} />
      </Suspense>
      {children}
    </div>
  );
}
