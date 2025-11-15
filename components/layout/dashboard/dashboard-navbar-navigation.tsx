"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/utils/ui";

export default function DashboardNavbarNavigation({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const segment = useSelectedLayoutSegment();

  const items = [
    {
      name: "Dashboard",
      href: `/${workspaceSlug}`,
      isActive: segment === "(dashboard)",
    },
    {
      name: "Instances",
      href: `/${workspaceSlug}/instances`,
      isActive: segment === "instances",
    },
    {
      name: "Workflows",
      href: `/${workspaceSlug}/workflows`,
      isActive: segment === "workflows",
    },
    {
      name: "Executions",
      href: `/${workspaceSlug}/executions`,
      isActive: segment === "executions",
    },
    {
      name: "Events",
      href: `/${workspaceSlug}/events`,
      isActive: segment === "events",
    },
    {
      name: "Alerts",
      href: `/${workspaceSlug}/alerts`,
      isActive: segment === "alerts",
    },
    {
      name: "Settings",
      href: `/${workspaceSlug}/settings`,
      isActive: segment === "settings",
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
