"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type RoomStatusEntry = {
  status: string;
  label: string;
  count: number;
  percent: number;
};

type AnalyticsRoomStatusChartProps = {
  breakdown: RoomStatusEntry[];
  total: number;
};

// Colours match the design system intent for each room state
const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "var(--chart-1)",
  OCCUPIED: "var(--chart-2)",
  CLEANING: "var(--chart-3)",
  MAINTENANCE: "var(--destructive)",
  OUT_OF_ORDER: "var(--chart-5)",
};

function buildChartConfig(breakdown: RoomStatusEntry[]): ChartConfig {
  return Object.fromEntries(
    breakdown.map((e) => [
      e.status,
      { label: e.label, color: STATUS_COLORS[e.status] ?? "var(--muted)" },
    ]),
  );
}

export default function AnalyticsRoomStatusChart({
  breakdown,
  total,
}: AnalyticsRoomStatusChartProps) {
  const chartConfig = buildChartConfig(breakdown);

  const data = breakdown.map((e) => ({
    name: e.label,
    status: e.status,
    value: e.count,
  }));

  return (
    <div className="glass-surface overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-lg font-semibold">Room Status</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Current snapshot — {total} rooms total
        </p>
      </div>

      <div className="p-6">
        <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full">
          <PieChart>
            <Tooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <span>
                      {name}: <strong>{value}</strong>
                    </span>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] ?? "var(--muted)"}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {breakdown.map((entry) => (
            <div
              key={entry.status}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[entry.status] ?? "var(--muted)",
                  }}
                />
                <span className="text-muted-foreground">{entry.label}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">{entry.count}</span>
                <span className="w-9 text-right text-xs text-muted-foreground">
                  {entry.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
