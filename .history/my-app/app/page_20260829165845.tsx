import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
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

const navigation = [
  {
    label: "DASHBOARD",
    href: "/",
    icon: LayoutDashboard,
    active: true,
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

const operations = [
  {
    name: "Eleanor Vance",
    detail: "Arrival: 14:00",
    type: "CHECK-IN",
    room: "402",
  },
  {
    name: "Arthur Pendelton",
    detail: "Departure: 11:00",
    type: "CHECK-OUT",
    room: "315",
  },
  {
    name: "Theodore Montague",
    detail: "Arrival: 15:30",
    type: "CHECK-IN",
    room: "201",
    highlighted: true,
  },
  {
    name: "Clara Bow",
    detail: "Departure: 12:00",
    type: "CHECK-OUT",
    room: "510",
  },
];

const aiInsights = [
  {
    room: "Room 204",
    text: "Mr. Sterling prefers non-feather pillows. Room service notified.",
    type: "secondary",
    action: "CONFIRM",
  },
  {
    room: "Room 312",
    text: "Anniversary celebration. Champagne delivery scheduled for 18:00.",
    type: "primary",
    action: "SCHEDULED",
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

export default function Home() {
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

            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "flex items-center rounded-xl px-4 py-3",
                  "font-medium tracking-wide transition-all",
                  item.active
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
            Tuesday, 14th of November
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
            <h2 className="text-5xl font-bold tracking-[-0.05em] md:text-[72px] md:leading-none">
              Good morning, Dinis.
            </h2>

            <p className="mt-4 max-w-xl text-lg leading-[1.6] text-muted-foreground">
              Here&apos;s the state of the property today.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Occupancy"
              value="78"
              suffix="%"
            />

            <StatCard
              label="Check-ins"
              value="8"
            />

            <StatCard
              label="Check-outs"
              value="6"
            />

            <StatCard
              label="Active requests"
              value="5"
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

                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-lg">
                {operations.map((operation, index) => {
                  const isCheckIn = operation.type === "CHECK-IN";

                  return (
                    <div
                      key={operation.name}
                      className={[
                        "flex items-center justify-between border-white/10 p-5 px-6 transition-colors",
                        index !== operations.length - 1
                          ? "border-b"
                          : "",
                        operation.highlighted
                          ? "bg-white/5"
                          : "hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="flex flex-col">
                        <span className="text-lg font-medium">
                          {operation.name}
                        </span>

                        <span className="text-muted-foreground">
                          {operation.detail}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-[12px] font-semibold tracking-[0.1em]",
                            isCheckIn
                              ? "border-secondary/50 bg-secondary/10 text-secondary"
                              : "border-error/50 bg-error/10 text-error",
                          ].join(" ")}
                        >
                          {operation.type}
                        </span>

                        <span className="w-12 text-right text-[23px] font-semibold">
                          {operation.room}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Intelligence */}
            <div>
              <h3 className="mb-6 flex items-center justify-between text-[32px] font-semibold leading-[1.2] tracking-[-0.01em]">
                AI Intelligence

                <Sparkles className="h-7 w-7 text-secondary" />
              </h3>

              <div className="space-y-4">
                {aiInsights.map((insight) => {
                  const isPrimary = insight.type === "primary";

                  return (
                    <div
                      key={insight.room}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-lg"
                    >
                      <div
                        className={[
                          "absolute right-[-50%] top-[-50%] h-full w-full rounded-full bg-gradient-to-bl blur-2xl",
                          isPrimary
                            ? "from-primary/20"
                            : "from-secondary/20",
                        ].join(" ")}
                      />

                      <div className="relative z-10">
                        <p
                          className={[
                            "mb-2 text-[12px] font-semibold tracking-[0.1em]",
                            isPrimary
                              ? "text-primary"
                              : "text-secondary",
                          ].join(" ")}
                        >
                          {insight.room}
                        </p>

                        <p className="text-foreground">
                          {insight.text}
                        </p>

                        <div className="mt-6">
                          {isPrimary ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[12px] font-semibold tracking-[0.1em] text-primary">
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}