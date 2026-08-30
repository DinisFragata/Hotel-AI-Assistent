import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  Bot,
  CalendarDays,
  Check,
  ChartNoAxesCombined,
  Hammer,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import { getDashboardData } from "@/lib/dashboard";

const navigation = [
  {
    label: "DASHBOARD",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "ROOM MANAGEMENT",
    href: "/room-management",
    icon: BedDouble,
  },
  {
    label: "RESERVATIONS",
    href: "/reservations",
    icon: CalendarDays,
  },
  {
    label: "MAINTENANCE",
    href: "/maintenance",
    icon: Hammer,
  },
  {
    label: "ANALYTICS",
    href: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "AI ASSISTANT",
    href: "/ai-assistant",
    icon: Bot,
  },
  {
    label: "SETTINGS",
    href: "/settings",
    icon: Settings,
  },
];

function StatCard({
  label,
  value,
  suffix,
  highlighted = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border p-6 shadow-xl",
        "backdrop-blur-lg transition-transform hover:-translate-y-1",
        highlighted
          ? "border-primary/30 bg-primary/10"
          : "border-white/10 bg-white/5",
      ].join(" ")}
    >
      {highlighted && (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
      )}

      <p
        className={[
          "relative z-10 mb-4 text-[12px] font-semibold uppercase tracking-widest",
          highlighted ? "text-primary" : "text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </p>

      <div
        className={[
          "relative z-10 flex items-baseline gap-2 text-5xl font-bold tracking-[-0.04em]",
          highlighted ? "text-primary" : "text-foreground",
        ].join(" ")}
      >
        {value}

        {suffix && (
          <span className="text-2xl text-primary">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

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
  const label = type === "CHECK_IN" ? "Arrival" : "Departure";

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
      : Math.round((occupiedRooms / rooms.length) * 100);

  const todayOperations = operations.filter(
    (operation) =>
      operation.time >= start &&
      operation.time <= end,
  );

  const checkIns = todayOperations.filter(
    (operation) => operation.type === "CHECK_IN",
  ).length;

  const checkOuts = todayOperations.filter(
    (operation) => operation.type === "CHECK_OUT",
  ).length;

  const activeRequests = maintenance.filter(
    (item) =>
      item.status === "OPEN" ||
      item.status === "IN_PROGRESS",
  ).length;

  const visibleOperations = [...todayOperations]
    .sort(
      (a, b) =>
        a.time.getTime() - b.time.getTime(),
    )
    .slice(0, 8);

  const visibleInsights = aiInsights.slice(0, 4);

  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const formattedDate =
    today.charAt(0).toUpperCase() + today.slice(1);

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-foreground">
      {/* Background gradients */}
      <div className="pointer-events-none fixed left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-secondary/10 blur-[120px]" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-white/10 bg-white/5 text-foreground backdrop-blur-xl">
        <div className="mb-8 p-8">
          <h1 className="text-2xl font-bold tracking-[-0.06em]">
            FRAGATA<span className="text-primary">.OS</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/";

            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "flex items-center rounded-xl px-4 py-3",
                  "font-medium tracking-wide transition-all",
                  isActive
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="mr-4 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="mt-auto flex items-center gap-4 border-t border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/30 bg-secondary/20">
            <User className="h-5 w-5 text-secondary" />
          </div>

          <div className="flex flex-col">
            <span className="font-medium tracking-wide">
              ADMIN DINIS
            </span>

            <span className="text-xs text-muted-foreground">
              PROPERTY MANAGER
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-72">
        {/* Header */}
        <header className="fixed left-72 right-0 top-0 z-40 flex h-24 items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 px-10 backdrop-blur-xl">
          <div className="text-[23px] font-semibold leading-[1.3]">
            {formattedDate}
          </div>

          <Button
            variant="outline"
            className="gap-2 rounded-full border-primary/30 bg-primary/10 px-6 py-3 text-primary hover:bg-primary/20 hover:text-primary"
          >
            NEW RESERVATION
            <Plus className="h-4.5 w-4.5" />
          </Button>
        </header>

        {/* Dashboard */}
        <section className="relative min-h-screen px-10 pb-10 pt-32">
          {/* Welcome */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold tracking-tighter md:text-[72px] md:leading-none">
              {greeting}, Dinis.
            </h2>

            <p className="mt-4 max-w-xl text-lg leading-[1.6] text-muted-foreground">
              Here&apos;s the state of the property today.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Occupancy"
              value={String(occupancy)}
              suffix="%"
            />

            <StatCard
              label="Check-ins"
              value={String(checkIns)}
            />

            <StatCard
              label="Check-outs"
              value={String(checkOuts)}
            />

            <StatCard
              label="Active requests"
              value={String(activeRequests)}
              highlighted
            />
          </div>

          {/* Operations + AI */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Today's Operations */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.01em]">
                  Today&apos;s Operations
                </h3>

                <span className="text-sm text-muted-foreground">
                  {visibleOperations.length} operation
                  {visibleOperations.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-lg">
                {visibleOperations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No operations scheduled for today.
                  </div>
                ) : (
                  visibleOperations.map((operation, index) => {
                    const isCheckIn =
                      operation.type === "CHECK_IN";

                    return (
                      <div
                        key={operation.id}
                        className={[
                          "flex items-center justify-between border-white/10 p-5 px-6 transition-colors",
                          index !== visibleOperations.length - 1
                            ? "border-b"
                            : "",
                          "hover:bg-white/10",
                        ].join(" ")}
                      >
                        <div className="flex flex-col">
                          <span className="text-lg font-medium">
                            {operation.guestName}
                          </span>

                          <span className="text-muted-foreground">
                            {formatOperationDetail(
                              operation.type,
                              operation.time,
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-6">
                          <span
                            className={[
                              "rounded-full border px-3 py-1 text-[12px] font-semibold tracking-widest",
                              isCheckIn
                                ? "border-secondary/50 bg-secondary/10 text-secondary"
                                : "border-destructive/50 bg-destructive/10 text-destructive",
                            ].join(" ")}
                          >
                            {isCheckIn
                              ? "CHECK-IN"
                              : "CHECK-OUT"}
                          </span>

                          <span className="w-12 text-right text-[23px] font-semibold">
                            {operation.room.number}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* AI Intelligence */}
            <div>
              <h3 className="mb-6 flex items-center justify-between text-[32px] font-semibold leading-[1.2] tracking-[-0.01em]">
                AI Intelligence

                <Sparkles className="h-7 w-7 text-secondary" />
              </h3>

              <div className="space-y-4">
                {visibleInsights.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-muted-foreground">
                    No AI insights available.
                  </div>
                ) : (
                  visibleInsights.map((insight) => {
                    const isPrimary =
                      insight.action === "SCHEDULED";

                    return (
                      <div
                        key={insight.id}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-lg"
                      >
                        <div
                          className={[
                            "absolute right-[-50%] top-[-50%] h-full w-full rounded-full bg-linear-to-bl blur-2xl",
                            isPrimary
                              ? "from-primary/20"
                              : "from-secondary/20",
                          ].join(" ")}
                        />

                        <div className="relative z-10">
                          <p
                            className={[
                              "mb-2 text-[12px] font-semibold tracking-widest",
                              isPrimary
                                ? "text-primary"
                                : "text-secondary",
                            ].join(" ")}
                          >
                            {insight.room ?? "PROPERTY"}
                          </p>

                          <p className="text-foreground">
                            {insight.text}
                          </p>

                          {insight.action && (
                            <div className="mt-6">
                              {insight.confirmed ? (
                                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[12px] font-semibold tracking-widest text-primary">
                                  {insight.action}
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  className="rounded-full border border-secondary/30 bg-secondary/20 text-secondary hover:bg-secondary/30 hover:text-secondary"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  {insight.action}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}