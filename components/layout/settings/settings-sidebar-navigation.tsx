"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/ui";

export default function SettingsSidebarNavigation({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const pathname = usePathname();

  const items = [
    {
      name: "General",
      href: `/${workspaceSlug}/settings`,
      isActive: pathname === `/${workspaceSlug}/settings`,
    },
  ];

  return (
    <div className="flex flex-col gap-1">
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
        "flex h-8 items-center rounded-md px-2",
        item.isActive
          ? "bg-accent/30 text-foreground"
          : "text-muted-foreground hover:bg-accent/30"
      )}
      href={item.href}
    >
      <span className="text-sm">{item.name}</span>
    </Link>
  );
}
