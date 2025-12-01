import { notFound } from "next/navigation";
import { SettingsIcon } from "@/components/icons";
import SettingsSidebarNavigation from "@/components/layout/settings-sidebar-navigation";
import { getWorkspaceUser } from "@/queries/workspace-users";

export default async function SettingsSidebar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { workspaceUser, error } = await getWorkspaceUser(workspaceId);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!workspaceUser) {
    notFound();
  }

  const isManager =
    workspaceUser.role === "manager" || workspaceUser.role === "owner";

  return (
    <div className="flex min-w-64 max-w-64 flex-col rounded-lg bg-background">
      <div className="border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <SettingsIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">Settings</h1>
        </div>
      </div>
      <SettingsSidebarNavigation
        isManager={isManager}
        workspaceId={workspaceId}
      />
    </div>
  );
}
