import type { Metadata } from "next";
import { Suspense } from "react";
import SettingsSidebar from "@/components/layout/settings/settings-sidebar";
import SettingsSidebarSkeleton from "@/components/layout/settings/settings-sidebar-skeleton";

export const metadata: Metadata = {
  title: "Nodezen • Settings",
};

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="mx-auto flex size-full max-w-7xl flex-col gap-6 overflow-hidden py-6">
      <div className="flex h-8 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Settings</h1>
      </div>
      <div className="flex size-full gap-6">
        <Suspense fallback={<SettingsSidebarSkeleton />}>
          <SettingsSidebar params={params} />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
