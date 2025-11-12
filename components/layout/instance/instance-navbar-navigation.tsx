"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/utils/ui";

export default function InstanceNavbarNavigation({
  instanceId,
}: {
  instanceId: string;
}) {
  const segment = useSelectedLayoutSegment();

  const items = [
    {
      name: "Dashboard",
      href: `/app/${instanceId}`,
      isActive: segment === "(dashboard)",
    },
    {
      name: "Workflows",
      href: `/app/${instanceId}/workflows`,
      isActive: segment === "workflows",
    },
    {
      name: "Executions",
      href: `/app/${instanceId}/executions`,
      isActive: segment === "executions",
    },
    {
      name: "Events",
      href: `/app/${instanceId}/events`,
      isActive: segment === "events",
    },
    {
      name: "Alerts",
      href: `/app/${instanceId}/alerts`,
      isActive: segment === "alerts",
    },
    {
      name: "Settings",
      href: `/app/${instanceId}/settings`,
      isActive: segment === "settings",
    },
  ];

  return (
    <div className="border-b">
      <div className="mx-auto flex w-full max-w-6xl gap-1">
        {items.map((item) => (
          <NavigationItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

function NavigationItem({
  name,
  href,
  isActive,
}: {
  name: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Link
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-md px-2 transition-colors hover:bg-muted",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
        href={href}
      >
        <span className="text-sm">{name}</span>
      </Link>
      <div
        className={cn("h-px", isActive ? "bg-foreground" : "bg-transparent")}
      />
    </div>
  );
}
