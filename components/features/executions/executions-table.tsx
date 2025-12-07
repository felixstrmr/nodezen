"use client";

import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/supabase";
import { formatDuration } from "@/utils/time";
import { cn } from "@/utils/ui";

type ExecutionRow = Database["public"]["Tables"]["executions"]["Row"] & {
  workflow: {
    id: string;
    name: string;
    instance: {
      id: string;
      name: string;
    } | null;
  } | null;
};

export default function ExecutionsTable({
  executions,
  isLoading,
  isFetching,
  hasMore,
  fetchNextPage,
}: {
  executions: ExecutionRow[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isLoadingInitial = isLoading && executions.length === 0;
  const isEmpty = !isLoading && executions.length === 0;

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isFetching) {
          fetchNextPage();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px",
      }
    );

    if (loadMoreSentinelRef.current) {
      observerRef.current.observe(loadMoreSentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isFetching, hasMore, fetchNextPage]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="grid grid-cols-8 border-b bg-muted/50 p-2 text-muted-foreground text-sm">
        <p className="col-span-2">Started at</p>
        <p className="col-span-3">Workflow</p>
        <p className="col-span-1">Status</p>
        <p className="col-span-1">Mode</p>
        <p className="col-span-1">Duration</p>
      </div>
      <div className="flex flex-col overflow-y-auto" ref={scrollContainerRef}>
        {isLoadingInitial ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Loading executions...
          </div>
        ) : null}
        {isEmpty ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            No executions found
          </div>
        ) : null}
        {executions.length > 0 && (
          <>
            {executions.map((execution) => (
              <div
                className={cn(
                  "grid grid-cols-8 items-center border-b p-2 text-sm",
                  execution.status === "error" && "bg-red-50"
                )}
                key={execution.id}
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md",
                      execution.status === "success"
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    )}
                  >
                    {execution.status === "success" ? (
                      <CheckIcon className="size-3.5 text-green-600" />
                    ) : (
                      <XIcon className="size-3.5 text-red-600" />
                    )}
                  </div>
                  <p className="col-span-2">
                    {format(execution.started_at, "PPp")}
                  </p>
                </div>
                <p className="col-span-3">
                  {execution.workflow?.name || "Unknown Workflow"}
                </p>
                <Badge
                  className="gap-1.5 rounded-sm bg-background px-1.5 capitalize"
                  variant="outline"
                >
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      execution.status === "success"
                        ? "bg-green-500"
                        : "bg-red-500"
                    )}
                  />
                  {execution.status}
                </Badge>
                <p className="col-span-1 text-muted-foreground capitalize">
                  {execution.mode}
                </p>
                <p className="col-span-1 font-mono text-muted-foreground">
                  {execution.duration_ms
                    ? formatDuration(execution.duration_ms)
                    : "N/A"}
                </p>
              </div>
            ))}
            <div ref={loadMoreSentinelRef} style={{ height: "1px" }} />
            {isFetching ? (
              <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
                Loading more...
              </div>
            ) : null}
            {!hasMore && executions.length > 0 ? (
              <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
                You&apos;ve reached the end
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
