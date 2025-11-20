"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/ui";

export default function AlertsNavbarNavigation({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const pathname = usePathname();

  const items = [
    {
      name: "All Alerts",
      href: `/${workspaceId}/alerts`,
      isActive: pathname === `/${workspaceId}/alerts`,
    },
    {
      name: "Rules",
      href: `/${workspaceId}/alerts/rules`,
      isActive: pathname.startsWith(`/${workspaceId}/alerts/rules`),
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
    <div className="flex flex-col gap-1">
      <Link
        className={cn(
          "flex h-7 items-center justify-center rounded-md px-2 hover:bg-accent",
          item.isActive ? "text-foreground" : "text-muted-foreground"
        )}
        href={item.href}
      >
        <span className="text-sm">{item.name}</span>
      </Link>
      <div
        className={cn(
          "h-px w-full",
          item.isActive ? "bg-primary" : "bg-transparent"
        )}
      />
    </div>
  );
}
