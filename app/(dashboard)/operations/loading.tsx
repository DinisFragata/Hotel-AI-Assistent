import { ClipboardList } from "lucide-react";

export default function Loading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        {/* Page header */}
        <div className="mb-8 sm:mb-10">
          <div className="h-3 w-36 animate-pulse rounded bg-muted/60" />

          <div className="mt-3 h-10 w-56 animate-pulse rounded-lg bg-muted/60 sm:h-11 sm:w-64" />

          <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-muted/40" />
        </div>

        {/* Operations section */}
        <div className="glass-surface overflow-hidden rounded-3xl">
          {/* Header + filters */}
          <div className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <div className="h-5 w-28 animate-pulse rounded bg-muted/60" />

              <div className="mt-2 h-4 w-36 animate-pulse rounded bg-muted/40" />
            </div>

            <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
              <div className="h-9 flex-1 animate-pulse rounded-md bg-muted/40" />

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <div className="h-9 w-full animate-pulse rounded-md bg-muted/40 md:w-40" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted/40 md:w-40" />
              </div>
            </div>
          </div>

          {/* Desktop skeleton */}
          <div className="hidden md:block">
            <div className="border-b border-white/10 px-6 py-4">
              <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-4">
                {Array.from({ length: 7 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-3 animate-pulse rounded bg-muted/40"
                    />
                  ),
                )}
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {Array.from({ length: 7 }).map(
                (_, index) => (
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
                ),
              )}
            </div>
          </div>

          {/* Mobile skeleton */}
          <div className="space-y-3 p-4 md:hidden">
            {Array.from({ length: 4 }).map(
              (_, index) => (
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
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}