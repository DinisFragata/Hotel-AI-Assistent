"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type TrendEntry = {
  date: string;
  label: string;
  checkIns: number;
  checkOuts: number;
};

type AnalyticsOperationsTrendChartProps = {
  data: TrendEntry[];
  period: string;
};

const chartConfig = {
  checkIns: {
    label: "Check-ins",
    color: "var(--chart-1)",
  },
  checkOuts: {
    label: "Check-outs",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// For 90d there are too many bars to label every day — show every ~15th label
function shouldShowLabel(index: number, total: number): boolean {
  if (total <= 14) return true;
  if (total <= 31) return index % 5 === 0 || index === total - 1;
  return index % 15 === 0 || index === total - 1;
}

export default function AnalyticsOperationsTrendChart({
  data,
  period,
}: AnalyticsOperationsTrendChartProps) {
  const isEmpty = data.every((d) => d.checkIns === 0 && d.checkOuts === 0);

  return (
    <div className="glass-surface overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-lg font-semibold">Operations Trend</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Check-ins and check-outs — {period === "7d" ? "last 7 days" : period === "30d" ? "last 30 days" : "last 90 days"}
        </p>
      </div>

      <div className="p-6">
        {isEmpty ? (
          <div className="flex h-[220px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No operations in this period.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart
              data={data}
              margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeOpacity={0.4}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(_, index) =>
                  shouldShowLabel(index, data.length) ? data[index].label : ""
                }
                interval={0}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                allowDecimals={false}
                width={32}
              />

              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                content={<ChartTooltipContent />}
              />

              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="checkIns"
                fill="var(--color-checkIns)"
                radius={[3, 3, 0, 0]}
                maxBarSize={20}
              />

              <Bar
                dataKey="checkOuts"
                fill="var(--color-checkOuts)"
                radius={[3, 3, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
