"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/ui";

export default function HomeNavbarNavigation() {
  const pathname = usePathname();

  const items = [
    {
      name: "Help",
      href: "/help",
      isActive: pathname.startsWith("/help"),
      isExternal: false,
    },
    {
      name: "Pricing",
      href: "/pricing",
      isActive: pathname.startsWith("/pricing"),
      isExternal: false,
    },
    {
      name: "Roadmap",
      href: "https://nodezen.userjot.com/roadmap",
      isActive: false,
      isExternal: true,
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
  isExternal: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-2 hover:bg-accent",
        item.isActive ? "bg-accent text-foreground" : "text-muted-foreground"
      )}
      href={item.href}
      target={item.isExternal ? "_blank" : "_self"}
    >
      <span className="text-sm">{item.name}</span>
      {item.isExternal && (
        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
      )}
    </Link>
  );
}
