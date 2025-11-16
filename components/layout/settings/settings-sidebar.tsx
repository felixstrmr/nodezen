import SettingsSidebarNavigation from "@/components/layout/settings/settings-sidebar-navigation";

export default async function SettingsSidebar({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return (
    <aside className="min-w-64 max-w-64">
      <SettingsSidebarNavigation workspaceSlug={workspaceSlug} />
    </aside>
  );
}
