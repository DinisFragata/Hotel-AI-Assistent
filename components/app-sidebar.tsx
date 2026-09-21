"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BarChart3,
  BedDouble,
  BookUser,
  Bot,
  CalendarDays,
  Hammer,
  LayoutDashboard,
  UsersRound,
  X,
  Menu,
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
    label: "GUESTS",
    href: "/guests",
    icon: UsersRound,
  },
  {
    label: "MAINTENANCE",
    href: "/maintenance",
    icon: Hammer,
  },
    {
    label: "OPERATIONS",
    href: "/operations",
    icon: BookUser,
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
];

type SidebarContentProps = {
  onNavigate?: () => void;
};

function SidebarContent({
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pb-8 pt-8">
        <Link
          href="/"
          onClick={onNavigate}
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
              onClick={onNavigate}
              className={[
                "group flex items-center rounded-xl border px-4 py-3",
                "text-sm font-medium tracking-wide transition-all duration-200",
                "cursor-pointer",
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
    </div>
  );
}

export default function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-white/10 bg-black/20 text-foreground backdrop-blur-xl md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-label={
          mobileOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="fixed left-4 top-4 z-60 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-background/80 text-muted-foreground shadow-lg backdrop-blur-xl transition-all duration-150 hover:bg-muted hover:text-foreground active:scale-[0.98] md:hidden"
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)]",
          "border-r border-white/10 bg-background/95 text-foreground shadow-2xl backdrop-blur-xl",
          "transition-transform duration-200 ease-out md:hidden",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarContent
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}