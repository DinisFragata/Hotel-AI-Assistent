import {
  BedDouble,
  Check,
  Sparkles,
} from "lucide-react";

import { getDashboardData } from "@/lib/dashboard";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatOperationDetail(
  type: "CHECK_IN" | "CHECK_OUT",
  time: Date,
) {
  const label =
    type === "CHECK_IN"
      ? "Arrival"
      : "Departure";

  return `${label}: ${formatTime(time)}`;
}

function getTodayRange() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
}

function StatCard({
  label,
  value,
  suffix,
  description,
  highlighted = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={[
        "glass-surface relative overflow-hidden rounded-3xl p-6",
        highlighted
          ? "border-primary/25"
          : "",
      ].join(" ")}
    >
      {highlighted && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(var(--primary)/0.16),transparent_38%)]" />
      )}

      <div className="relative z-10">
        <p
          className={[
            "mb-4 text-[11px] font-semibold uppercase tracking-[0.16em]",
            highlighted
              ? "text-primary"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {label}
        </p>

        <div
          className={[
            "flex items-baseline gap-2 tracking-tighter",
            highlighted
              ? "text-primary"
              : "text-foreground",
          ].join(" ")}
        >
          <span className="text-[46px] font-semibold leading-none">
            {value}
          </span>

          {suffix && (
            <span className="text-2xl font-medium">
              {suffix}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-4 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function OperationTypeBadge({
  type,
}: {
  type: "CHECK_IN" | "CHECK_OUT";
}) {
  const isCheckIn = type === "CHECK_IN";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[11px] font-semibold tracking-[0.08em]",
        isCheckIn
          ? "border-secondary/25 bg-secondary/10 text-secondary"
          : "border-destructive/25 bg-destructive/10 text-destructive",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isCheckIn
            ? "bg-secondary"
            : "bg-destructive",
        ].join(" ")}
      />

      {isCheckIn ? "CHECK-IN" : "CHECK-OUT"}
    </span>
  );
}

function InsightAction({
  action,
  confirmed,
}: {
  action: string;
  confirmed: boolean;
}) {
  if (confirmed) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-primary">
        <Check className="h-3.5 w-3.5" />
        {action}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-secondary transition-colors duration-200 hover:bg-secondary/15"
    >
      {action}
    </button>
  );
}

export default async function Home() {
  const {
    rooms,
    operations,
    maintenance,
    aiInsights,
  } = await getDashboardData();

  const { start, end } = getTodayRange();

  const occupiedRooms = rooms.filter(
    (room) => room.status === "OCCUPIED",
  ).length;

  const occupancy =
    rooms.length === 0
      ? 0
      : Math.round(
          (occupiedRooms / rooms.length) * 100,
        );

  const todayOperations = operations.filter(
    (operation) =>
      operation.time >= start &&
      operation.time <= end,
  );

  const checkIns = todayOperations.filter(
    (operation) =>
      operation.type === "CHECK_IN",
  ).length;

  const checkOuts = todayOperations.filter(
    (operation) =>
      operation.type === "CHECK_OUT",
  ).length;

  const activeRequests = maintenance.filter(
    (item) =>
      item.status === "OPEN" ||
      item.status === "IN_PROGRESS",
  ).length;

  const visibleOperations = [
    ...todayOperations,
  ]
    .sort(
      (a, b) =>
        a.time.getTime() -
        b.time.getTime(),
    )
    .slice(0, 8);

  const visibleInsights =
    aiInsights.slice(0, 4);

  const currentHour =
    new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <section className="relative min-h-screen px-10 pb-10 pt-10">
      <div className="mx-auto max-w-350">
        {/* Page introduction */}
        <div className="mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Property Overview
          </p>

          <h1 className="text-[42px] font-semibold tracking-[-0.04em]">
            {greeting}, Dinis.
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-[1.6] text-muted-foreground">
            Here&apos;s the current state of
            the property.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Occupancy"
            value={String(occupancy)}
            suffix="%"
            description={`${occupiedRooms} of ${rooms.length} rooms occupied`}
          />

          <StatCard
            label="Check-ins"
            value={String(checkIns)}
            description="Scheduled for today"
          />

          <StatCard
            label="Check-outs"
            value={String(checkOuts)}
            description="Scheduled for today"
          />

          <StatCard
            label="Active requests"
            value={String(activeRequests)}
            description="Open maintenance requests"
            highlighted
          />
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
          {/* Today's operations */}
          <div className="glass-surface overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-primary" />

                  <h2 className="text-lg font-semibold">
                    Today&apos;s Operations
                  </h2>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {visibleOperations.length}{" "}
                  {visibleOperations.length === 1
                    ? "operation"
                    : "operations"}{" "}
                  scheduled today
                </p>
              </div>
            </div>

            {visibleOperations.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center px-6">
                <div className="max-w-sm text-center">
                  <p className="font-medium">
                    No operations scheduled
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    There are no check-ins or
                    check-outs scheduled for today.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {visibleOperations.map(
                  (operation, index) => {
                    return (
                      <div
                        key={operation.id}
                        className={[
                          "flex items-center justify-between gap-6 px-6 py-4",
                          index !==
                          visibleOperations.length - 1
                            ? "border-b border-white/10"
                            : "",
                        ].join(" ")}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {operation.guestName}
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatOperationDetail(
                              operation.type,
                              operation.time,
                            )}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-5">
                          <OperationTypeBadge
                            type={operation.type}
                          />

                          <div className="w-12 text-right">
                            <span className="text-lg font-semibold tracking-[-0.02em]">
                              {operation.room.number}
                            </span>

                            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                              Room
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* AI Intelligence */}
          <div className="glass-surface overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">
                  AI Intelligence
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Recent operational insights
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
            </div>

            {visibleInsights.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center px-6">
                <div className="max-w-sm text-center">
                  <p className="font-medium">
                    No AI insights available
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    New insights will appear here
                    when the system detects them.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {visibleInsights.map(
                  (insight, index) => {
                    return (
                      <div
                        key={insight.id}
                        className={[
                          "relative overflow-hidden px-6 py-5",
                          index !==
                          visibleInsights.length - 1
                            ? "border-b border-white/10"
                            : "",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl",
                            insight.action ===
                            "SCHEDULED"
                              ? "bg-primary/8"
                              : "bg-secondary/8",
                          ].join(" ")}
                        />

                        <div className="relative">
                          <div className="mb-2 flex items-center justify-between gap-4">
                            <p
                              className={[
                                "text-[10px] font-semibold uppercase tracking-[0.16em]",
                                insight.action ===
                                "SCHEDULED"
                                  ? "text-primary"
                                  : "text-secondary",
                              ].join(" ")}
                            >
                              {insight.room ??
                                "PROPERTY"}
                            </p>
                          </div>

                          <p className="text-sm leading-6 text-foreground">
                            {insight.text}
                          </p>

                          {insight.action && (
                            <div className="mt-4">
                              <InsightAction
                                action={
                                  insight.action
                                }
                                confirmed={
                                  insight.confirmed
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}