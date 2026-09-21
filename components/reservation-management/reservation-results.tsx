"use client";

import { ReactNode } from "react";
import { useReservationFilter } from "./reservation-filter-provider";

type ReservationResultsProps = {
  children: ReactNode;
};

export default function ReservationResults({
  children,
}: ReservationResultsProps) {
  const { isPending } = useReservationFilter();

  return (
    <div className="relative min-h-0">
      <div
        className={[
          "transition-opacity duration-200",
          isPending ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        {children}
      </div>

      {isPending && (
        <div className="pointer-events-none absolute inset-0 bg-background/20">
          <div className="divide-y divide-white/10">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-6 px-6 py-5"
              >
                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                  <div className="h-3 w-36 animate-pulse rounded bg-muted/40" />
                </div>

                <div className="h-4 w-12 animate-pulse rounded bg-muted/60" />

                <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />

                <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />

                <div className="h-4 w-12 animate-pulse rounded bg-muted/40" />

                <div className="h-4 w-16 animate-pulse rounded bg-muted/60" />

                <div className="h-7 w-24 animate-pulse rounded-full bg-muted/40" />

                <div className="ml-auto flex gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}