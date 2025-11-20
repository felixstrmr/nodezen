import AlertsNavbarNavigation from "@/components/layout/alerts/alerts-navbar-navigation";

export default async function AlertsNavbar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="flex items-center gap-1 border-b">
      <AlertsNavbarNavigation workspaceId={workspaceId} />
    </div>
  );
}
