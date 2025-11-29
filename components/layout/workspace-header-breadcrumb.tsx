"use client";

import { usePathname } from "next/navigation";
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
};

const TRAILING_SLASH_REGEX = /\/$/;

export default function WorkspaceHeaderBreadcrumb({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(TRAILING_SLASH_REGEX, "");
  const isDashboard = normalizedPath === `/${workspaceId}`;

  const pathSegments = normalizedPath.split("/").filter(Boolean);
  const currentRoute = pathSegments.length > 1 ? pathSegments.at(-1) : null;
  const currentLabel = currentRoute ? routeLabels[currentRoute] : null;
  const isCurrentRoute =
    pathSegments.length > 1 && pathSegments.at(-1) === currentRoute;

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
        {!isDashboard && currentLabel && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem
              className={cn(
                "flex h-7 items-center rounded-md px-2 transition-colors hover:bg-accent",
                isCurrentRoute
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
