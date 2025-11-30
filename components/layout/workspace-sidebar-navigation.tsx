"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BackupIcon,
  DashboardIcon,
  InstanceIcon,
  SettingsIcon,
  WorkflowIcon,
} from "@/components/icons";
import { AlertIcon } from "@/components/icons/alert-icon";
import { ExecutionIcon } from "@/components/icons/execution-icon";
import { cn } from "@/utils/ui";

export default function WorkspaceSidebarNavigation({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const pathname = usePathname();

  const itemsTop = [
    {
      name: "Dashboard",
      href: `/${workspaceId}`,
      icon: DashboardIcon,
      isActive: pathname === `/${workspaceId}`,
    },
    {
      name: "Instances",
      href: `/${workspaceId}/instances`,
      icon: InstanceIcon,
      isActive: pathname.startsWith(`/${workspaceId}/instances`),
    },
    {
      name: "Workflows",
      href: `/${workspaceId}/workflows`,
      icon: WorkflowIcon,
      isActive: pathname.startsWith(`/${workspaceId}/workflows`),
    },
    {
      name: "Executions",
      href: `/${workspaceId}/executions`,
      icon: ExecutionIcon,
      isActive: pathname.startsWith(`/${workspaceId}/executions`),
    },
    {
      name: "Alerts",
      href: `/${workspaceId}/alerts`,
      icon: AlertIcon,
      isActive: pathname.startsWith(`/${workspaceId}/alerts`),
    },
    {
      name: "Backups",
      href: `/${workspaceId}/backups`,
      icon: BackupIcon,
      isActive: pathname.startsWith(`/${workspaceId}/backups`),
    },
  ];

  const itemsBottom = [
    {
      name: "Settings",
      href: `/${workspaceId}/settings`,
      icon: SettingsIcon,
      isActive: pathname.startsWith(`/${workspaceId}/settings`),
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-1">
        {itemsTop.map((item) => (
          <NavigationItem key={item.name} {...item} />
        ))}
      </div>
      <div className="space-y-1">
        {itemsBottom.map((item) => (
          <NavigationItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

function NavigationItem({
  name,
  href,
  icon: Icon,
  isActive,
}: {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
}) {
  return (
    <Link
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-2 transition-colors hover:bg-muted",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground"
      )}
      href={href}
    >
      <Icon className="size-4 opacity-75" />
      <span className="text-sm">{name}</span>
    </Link>
  );
}
