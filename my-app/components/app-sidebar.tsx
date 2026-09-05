"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BedDouble,
  Bot,
  CalendarDays,
  Hammer,
  LayoutDashboard,
  Settings,
} from "lucide-react";

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
    icon: BarChart3,
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

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-black/20 text-foreground backdrop-blur-xl">
      <div className="px-8 pb-8 pt-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-[-0.06em]"
        >
          Hotel<span className="text-primary">.Operations</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center rounded-xl border px-4 py-3",
                "text-sm font-medium tracking-wide transition-all duration-200",
                isActive
                  ? "border-primary/30 bg-primary/10 text-primary shadow-[0_8px_30px_rgb(var(--primary)/0.06)]"
                  : "border-transparent text-muted-foreground hover:border-white/5 hover:bg-white/5 hover:text-foreground",
              ].join(" ")}
            >
              <Icon
                className={[
                  "mr-4 h-5 w-5 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                ].join(" ")}
              />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 bg-white/3 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10">
            <span className="text-sm font-semibold text-secondary">
              DF
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium tracking-wide">
              ADMIN DINIS
            </p>

            <p className="mt-0.5 truncate text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Property Manager
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}