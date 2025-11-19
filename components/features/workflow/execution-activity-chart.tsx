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

const chartConfig = {
  sucessful_executions: {
    label: "Successful",
    color: "#4ade80",
  },
  failed_executions: {
    label: "Failed",
    color: "#f87171",
  },
} satisfies ChartConfig;

type ExecutionActivityChartProps = {
  executionMetrics: ExecutionMetricsHourly[] | null;
};

type ChartPoint = {
  hour: Date;
  hourLabel: string;
  hourShortLabel: string;
  sucessful_executions: number;
  failed_executions: number;
};

export default function ExecutionActivityChart({
  executionMetrics,
}: ExecutionActivityChartProps) {
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

        const totalExecutions = metric.total_executions ?? 0;
        const failedExecutions = metric.failed_executions ?? 0;
        const successfulExecutions =
          metric.sucessful_executions ??
          Math.max(totalExecutions - failedExecutions, 0);

        return {
          hour: timestamp,
          hourLabel: format(timestamp, "MMM d, HH:mm"),
          hourShortLabel: format(timestamp, "HH:mm"),
          sucessful_executions: successfulExecutions,
          failed_executions: failedExecutions,
        };
      })
      .filter((metric): metric is ChartPoint => Boolean(metric));
  }, [executionMetrics]);

  return (
    <div className="flex flex-col gap-6 rounded-lg border">
      <div className="flex items-center justify-between rounded-t-lg border-b bg-muted p-3">
        <h2 className="font-semibold text-lg tracking-tight">
          Execution Activity
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
                          {value?.toLocaleString()}
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
                <linearGradient id="fillSuccessful" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sucessful_executions)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sucessful_executions)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFailed" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-failed_executions)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-failed_executions)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="sucessful_executions"
                fill="url(#fillSuccessful)"
                fillOpacity={0.4}
                stroke="var(--color-sucessful_executions)"
                type="natural"
              />
              <Area
                dataKey="failed_executions"
                fill="url(#fillFailed)"
                fillOpacity={0.4}
                stroke="var(--color-failed_executions)"
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
