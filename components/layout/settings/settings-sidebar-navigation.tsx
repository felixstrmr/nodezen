"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/ui";

export default function SettingsSidebarNavigation({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const pathname = usePathname();

  const itemsPersonal = [
    {
      name: "General",
      href: `/${workspaceId}/settings`,
      isActive: pathname === `/${workspaceId}/settings`,
    },
    {
      name: "Notifications",
      href: `/${workspaceId}/settings/notifications`,
      isActive: pathname === `/${workspaceId}/settings/notifications`,
    },
  ];

  const itemsWorkspace = [
    {
      name: "Workspace",
      href: `/${workspaceId}/settings/workspace`,
      isActive: pathname.startsWith(`/${workspaceId}/settings/workspace`),
    },
    {
      name: "Users",
      href: `/${workspaceId}/settings/users`,
      isActive: pathname.startsWith(`/${workspaceId}/settings/users`),
    },
    {
      name: "Billing",
      href: `/${workspaceId}/settings/billing`,
      isActive: pathname.startsWith(`/${workspaceId}/settings/billing`),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        {itemsPersonal.map((item) => (
          <NavigationItem key={item.href} {...item} />
        ))}
      </div>
      <div className="space-y-1">
        {itemsWorkspace.map((item) => (
          <NavigationItem key={item.href} {...item} />
        ))}
      </div>
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
        "flex h-8 items-center rounded-md px-2",
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
