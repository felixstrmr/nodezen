import AlertsNavbarNavigation from "@/components/layout/alerts/alerts-navbar-navigation";

export default async function AlertsNavbar({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return (
    <div className="flex items-center gap-1 border-b">
      <AlertsNavbarNavigation workspaceSlug={workspaceSlug} />
    </div>
  );
}
