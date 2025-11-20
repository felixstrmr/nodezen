import SettingsSidebarNavigation from "@/components/layout/settings/settings-sidebar-navigation";

export default async function SettingsSidebar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <aside className="min-w-64 max-w-64">
      <SettingsSidebarNavigation workspaceId={workspaceId} />
    </aside>
  );
}
