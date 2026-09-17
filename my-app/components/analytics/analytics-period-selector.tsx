"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { AnalyticsPeriod } from "@/lib/analytics/filters";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

type AnalyticsPeriodSelectorProps = {
  selected: AnalyticsPeriod;
};

export default function AnalyticsPeriodSelector({
  selected,
}: AnalyticsPeriodSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(period: AnalyticsPeriod) {
    startTransition(() => {
      router.replace(`/analytics?period=${period}`);
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-white/10 bg-white/4 p-1",
        isPending && "opacity-60",
      )}
    >
      {PERIODS.map((p) => {
        const isActive = p.value === selected;

        return (
          <button
            key={p.value}
            type="button"
            onClick={() => handleSelect(p.value)}
            disabled={isPending}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isActive
                ? "bg-primary/15 text-primary shadow-sm"
                : "cursor-pointer text-muted-foreground hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
