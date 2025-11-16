"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/ui";

export default function DashboardNavbarNavigation({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const pathname = usePathname();

  const items = [
    {
      name: "Dashboard",
      href: `/${workspaceSlug}`,
      isActive: pathname === `/${workspaceSlug}`,
    },
    {
      name: "Instances",
      href: `/${workspaceSlug}/instances`,
      isActive: pathname.startsWith(`/${workspaceSlug}/instances`),
    },
    {
      name: "Workflows",
      href: `/${workspaceSlug}/workflows`,
      isActive: pathname.startsWith(`/${workspaceSlug}/workflows`),
    },
    {
      name: "Executions",
      href: `/${workspaceSlug}/executions`,
      isActive: pathname.startsWith(`/${workspaceSlug}/executions`),
    },
    {
      name: "Alerts",
      href: `/${workspaceSlug}/alerts`,
      isActive: pathname.startsWith(`/${workspaceSlug}/alerts`),
    },
    {
      name: "Events",
      href: `/${workspaceSlug}/events`,
      isActive: pathname.startsWith(`/${workspaceSlug}/events`),
    },
    {
      name: "Backups",
      href: `/${workspaceSlug}/backups`,
      isActive: pathname.startsWith(`/${workspaceSlug}/backups`),
    },
    {
      name: "Settings",
      href: `/${workspaceSlug}/settings`,
      isActive: pathname.startsWith(`/${workspaceSlug}/settings`),
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
          ? "bg-accent/50 text-foreground"
          : "text-muted-foreground hover:bg-accent/50"
      )}
      href={item.href}
    >
      <span className="text-sm">{item.name}</span>
    </Link>
  );
}
