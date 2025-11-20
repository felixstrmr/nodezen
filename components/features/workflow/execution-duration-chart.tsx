"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ExecutionMetricsHourly } from "@/types";
import { formatDuration } from "@/utils/time";

const chartConfig = {
  avg_duration_ms: {
    label: "Average",
    color: "var(--chart-1)",
  },
  p50_duration_ms: {
    label: "P50",
    color: "var(--chart-2)",
  },
  p95_duration_ms: {
    label: "P95",
    color: "var(--chart-3)",
  },
  p99_duration_ms: {
    label: "P99",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type ExecutionDurationChartProps = {
  executionMetrics: ExecutionMetricsHourly[] | null;
};

type ChartPoint = {
  hour: Date;
  hourLabel: string;
  hourShortLabel: string;
  avg_duration_ms: number;
};

export default function ExecutionDurationChart({
  executionMetrics,
}: ExecutionDurationChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    if (!executionMetrics?.length) {
      return [];
    }

    return executionMetrics
      .slice()
      .sort(
        (metricA, metricB) =>
          new Date(metricA.hour_start).getTime() -
          new Date(metricB.hour_start).getTime()
      )
      .map((metric) => {
        const timestamp = new Date(metric.hour_start);

        if (Number.isNaN(timestamp.getTime())) {
          return null;
        }

        const avgDuration = metric.avg_duration_ms ?? 0;

        return {
          hour: timestamp,
          hourLabel: format(timestamp, "MMM d, HH:mm"),
          hourShortLabel: format(timestamp, "HH:mm"),
          avg_duration_ms: avgDuration,
        };
      })
      .filter((metric): metric is ChartPoint => Boolean(metric));
  }, [executionMetrics]);

  return (
    <div className="flex flex-col gap-6 rounded-lg border">
      <div className="flex items-center justify-between rounded-t-lg border-b bg-muted p-3">
        <h2 className="font-semibold text-lg tracking-tight">
          Execution Duration
        </h2>
        <p className="text-muted-foreground text-sm">Last 24 hours</p>
      </div>
      <div className="p-3">
        {chartData.length ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="hourShortLabel"
                tickLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label ?? name}
                        </span>
                        <span className="font-medium font-mono">
                          {typeof value === "number"
                            ? formatDuration(value)
                            : value}
                        </span>
                      </div>
                    )}
                    indicator="dot"
                    labelKey="hourLabel"
                  />
                }
                cursor={false}
              />
              <defs>
                <linearGradient id="fillAvg" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                </linearGradient>
                <linearGradient id="fillP95" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="avg_duration_ms"
                fill="url(#fillAvg)"
                fillOpacity={0.4}
                stroke="var(--chart-1)"
                type="natural"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] flex-1 items-center justify-center text-muted-foreground text-sm">
            No execution metrics found for this workflow.
          </div>
        )}
      </div>
    </div>
  );
}
