"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { DashboardIcon } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/utils/ui";

const routeLabels: Record<string, string> = {
  workflows: "Workflows",
  settings: "Settings",
  alerts: "Alerts",
  executions: "Executions",
  instances: "Instances",
  backups: "Backups",
  channels: "Channels",
  rules: "Rules",
};

const TRAILING_SLASH_REGEX = /\/$/;

type BreadcrumbSegment = {
  label: string;
  href: string;
  isLast: boolean;
};

export default function WorkspaceHeaderBreadcrumb({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(TRAILING_SLASH_REGEX, "");
  const isDashboard = normalizedPath === `/${workspaceId}`;

  const pathSegments = normalizedPath.split("/").filter(Boolean);
  const breadcrumbSegments: BreadcrumbSegment[] = [];
  const routeSegments = pathSegments.slice(1);

  routeSegments.forEach((segment, index) => {
    const isLast = index === routeSegments.length - 1;
    const href = `/${[workspaceId, ...routeSegments.slice(0, index + 1)].join("/")}`;
    const label = routeLabels[segment] || segment;

    breadcrumbSegments.push({
      label,
      href,
      isLast,
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className={cn(
              "flex size-7 items-center justify-center rounded-md transition-colors",
              isDashboard
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
            href={`/${workspaceId}`}
          >
            <DashboardIcon className="size-3.5 opacity-75" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbSegments.map((segment) => (
          <Fragment key={segment.href}>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              {segment.isLast ? (
                <BreadcrumbPage
                  className={cn(
                    "flex h-7 items-center rounded-md px-2 transition-colors",
                    "bg-accent text-foreground"
                  )}
                >
                  {segment.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className={cn(
                    "flex h-7 items-center rounded-md px-2 transition-colors",
                    "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Link href={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
