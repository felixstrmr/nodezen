import AppNavbarNavigation from "@/components/layout/app/app-navbar-navigation";

export default function InstancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden">
      <AppNavbarNavigation />
      {children}
    </div>
  );
}
