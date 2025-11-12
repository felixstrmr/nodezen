import InstanceNavbarNavigation from "@/components/layout/instance/instance-navbar-navigation";

export default async function InstanceNavbar({
  params,
}: {
  params: Promise<{ instanceId: string }>;
}) {
  const { instanceId } = await params;

  return <InstanceNavbarNavigation instanceId={instanceId} />;
}
