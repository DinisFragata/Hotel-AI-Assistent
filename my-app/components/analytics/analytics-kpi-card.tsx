import { cn } from "@/lib/utils";

type AnalyticsKpiCardProps = {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
  highlighted?: boolean;
};

export default function AnalyticsKpiCard({
  label,
  value,
  suffix,
  description,
  highlighted = false,
}: AnalyticsKpiCardProps) {
  return (
    <div
      className={cn(
        "glass-surface relative overflow-hidden rounded-3xl p-6",
        highlighted && "border-primary/25",
      )}
    >
      {highlighted && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(var(--primary)/0.16),transparent_38%)]" />
      )}

      <div className="relative z-10">
        <p
          className={cn(
            "mb-4 text-[11px] font-semibold uppercase tracking-[0.16em]",
            highlighted ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {value}
          </span>

          {suffix && (
            <span className="text-base font-medium text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
