"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/utils/ui";

export default function InstancesNavbarNavigation() {
  const segment = useSelectedLayoutSegment();

  const items = [
    {
      name: "Instances",
      href: "/app",
      isActive: segment === null,
    },
  ];

  return (
    <div className="border-b">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex gap-1">
          {items.map((item) => (
            <NavigationItem key={item.name} {...item} />
          ))}
        </div>
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
