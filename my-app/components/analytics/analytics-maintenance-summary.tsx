import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";

type MaintenanceSummary = {
  active: number;
  urgentOrHigh: number;
  completedInPeriod: number;
};

type AnalyticsMaintenanceSummaryProps = {
  summary: MaintenanceSummary;
  period: string;
};

export default function AnalyticsMaintenanceSummary({
  summary,
  period,
}: AnalyticsMaintenanceSummaryProps) {
  const periodLabel =
    period === "7d"
      ? "last 7 days"
      : period === "30d"
        ? "last 30 days"
        : "last 90 days";

  return (
    <div className="glass-surface overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-lg font-semibold">Maintenance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Active now + completed in {periodLabel}
        </p>
      </div>

      <div className="divide-y divide-white/10">
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
            <Wrench className="h-5 w-5 text-secondary" />
          </div>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Active requests</p>
            <p className="text-xs text-muted-foreground/70">
              Open + in progress
            </p>
          </div>

          <span className="text-2xl font-semibold tracking-[-0.03em]">
            {summary.active}
          </span>
        </div>

        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground">High priority</p>
            <p className="text-xs text-muted-foreground/70">
              Urgent or high priority
            </p>
          </div>

          <span className="text-2xl font-semibold tracking-[-0.03em]">
            {summary.urgentOrHigh}
          </span>
        </div>

        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-xs text-muted-foreground/70">{periodLabel}</p>
          </div>

          <span className="text-2xl font-semibold tracking-[-0.03em]">
            {summary.completedInPeriod}
          </span>
        </div>
      </div>
    </div>
  );
}
