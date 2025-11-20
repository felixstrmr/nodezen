"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/ui";

export default function DashboardNavbarNavigation({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const pathname = usePathname();

  const items = [
    {
      name: "Dashboard",
      href: `/${workspaceId}`,
      isActive: pathname === `/${workspaceId}`,
    },
    {
      name: "Instances",
      href: `/${workspaceId}/instances`,
      isActive: pathname.startsWith(`/${workspaceId}/instances`),
    },
    {
      name: "Workflows",
      href: `/${workspaceId}/workflows`,
      isActive: pathname.startsWith(`/${workspaceId}/workflows`),
    },
    {
      name: "Executions",
      href: `/${workspaceId}/executions`,
      isActive: pathname.startsWith(`/${workspaceId}/executions`),
    },
    {
      name: "Alerts",
      href: `/${workspaceId}/alerts`,
      isActive: pathname.startsWith(`/${workspaceId}/alerts`),
    },
    {
      name: "Backups",
      href: `/${workspaceId}/backups`,
      isActive: pathname.startsWith(`/${workspaceId}/backups`),
    },
    {
      name: "Settings",
      href: `/${workspaceId}/settings`,
      isActive: pathname.startsWith(`/${workspaceId}/settings`),
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {items.map((item) => (
        <NavigationItem key={item.href} {...item} />
      ))}
    </div>
  );
}

function NavigationItem(item: {
  name: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link
      className={cn(
        "flex h-8 items-center justify-center rounded-md px-2",
        item.isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent"
      )}
      href={item.href}
    >
      <span className="text-sm">{item.name}</span>
    </Link>
  );
}
