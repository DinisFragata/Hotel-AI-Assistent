import { cn } from "@/lib/utils";

type ReservationBreakdown = {
  PENDING: number;
  CONFIRMED: number;
  CHECKED_IN: number;
  CHECKED_OUT: number;
  CANCELLED: number;
};

type AnalyticsReservationBreakdownProps = {
  breakdown: ReservationBreakdown;
  period: string;
};

const STATUS_CONFIG = [
  {
    key: "PENDING" as const,
    label: "Pending",
    className: "bg-muted-foreground/20 text-muted-foreground",
  },
  {
    key: "CONFIRMED" as const,
    label: "Confirmed",
    className: "bg-secondary/15 text-secondary",
  },
  {
    key: "CHECKED_IN" as const,
    label: "Checked In",
    className: "bg-primary/15 text-primary",
  },
  {
    key: "CHECKED_OUT" as const,
    label: "Checked Out",
    className: "bg-muted-foreground/15 text-muted-foreground",
  },
  {
    key: "CANCELLED" as const,
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive",
  },
];

export default function AnalyticsReservationBreakdown({
  breakdown,
  period,
}: AnalyticsReservationBreakdownProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-surface overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-lg font-semibold">Reservations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Status breakdown —{" "}
          {period === "7d"
            ? "last 7 days"
            : period === "30d"
              ? "last 30 days"
              : "last 90 days"}
        </p>
      </div>

      <div className="p-6">
        {total === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No reservations in this period.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {STATUS_CONFIG.map(({ key, label, className }) => {
              const count = breakdown[key];
              const percent =
                total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={key} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-24 shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.1em]",
                      className,
                    )}
                  >
                    {label}
                  </span>

                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-current opacity-40 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-6 text-right text-sm font-medium tabular-nums">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
