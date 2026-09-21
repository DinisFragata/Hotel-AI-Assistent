"use client";

import type { ReactNode } from "react";

import { useOperationFilter } from "./operation-filter-provider";

type OperationResultsProps = {
  children: ReactNode;
};

export default function OperationResults({
  children,
}: OperationResultsProps) {
  const { isPending } =
    useOperationFilter();

  return (
    <div className="relative min-h-0">
      <div
        className={[
          "transition-opacity duration-200",
          isPending
            ? "opacity-0"
            : "opacity-100",
        ].join(" ")}
      >
        {children}
      </div>

      {isPending && (
        <div
          className="pointer-events-none absolute inset-0 bg-background/20"
          aria-hidden="true"
        >
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="divide-y divide-white/10">
              {Array.from({
                length: 7,
              }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_0.8fr_0.8fr] items-center gap-4 px-6 py-5"
                >
                  <div className="h-7 w-24 animate-pulse rounded-full bg-muted/40" />

                  <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />

                  <div className="h-4 w-16 animate-pulse rounded bg-muted/40" />

                  <div className="h-4 w-20 animate-pulse rounded bg-muted/40" />

                  <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />

                  <div className="h-4 w-14 animate-pulse rounded bg-muted/40" />

                  <div className="ml-auto h-8 w-20 animate-pulse rounded-md bg-muted/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-4 md:hidden">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/2.5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-muted/40" />

                  <div className="h-4 w-12 animate-pulse rounded bg-muted/40" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-2.5 w-12 animate-pulse rounded bg-muted/40" />

                    <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-2.5 w-10 animate-pulse rounded bg-muted/40" />

                    <div className="h-4 w-16 animate-pulse rounded bg-muted/40" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-2.5 w-20 animate-pulse rounded bg-muted/40" />

                    <div className="h-4 w-20 animate-pulse rounded bg-muted/40" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-2.5 w-12 animate-pulse rounded bg-muted/40" />

                    <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="h-8 w-full animate-pulse rounded-md bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isPending && (
        <span className="sr-only" aria-live="polite">
          Updating operations...
        </span>
      )}
    </div>
  );
}