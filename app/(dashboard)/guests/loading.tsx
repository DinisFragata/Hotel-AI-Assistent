import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        {/* Page header */}
        <div className="mb-8 space-y-3 sm:mb-10">
          <Skeleton className="h-3 w-28" />

          <Skeleton className="h-10 w-48 sm:h-11 sm:w-56" />

          <Skeleton className="h-5 w-80 max-w-full sm:w-96" />
        </div>

        {/* Guests section */}
        <div className="glass-surface overflow-hidden rounded-3xl">
          {/* Section header */}
          <div className="border-b border-white/10 px-4 py-5 sm:px-6">
            <Skeleton className="h-5 w-32" />

            <Skeleton className="mt-2 h-4 w-28" />
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[28%_27%_20%_15%_10%] border-b border-white/10">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="px-4 py-4 first:px-6 last:px-6"
                  >
                    <Skeleton className="h-3 w-20" />
                  </div>
                ),
              )}
            </div>

            <div className="divide-y divide-white/10">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[28%_27%_20%_15%_10%] items-center"
                  >
                    <div className="min-w-0 px-6 py-5">
                      <Skeleton className="h-4 w-36" />
                    </div>

                    <div className="px-4 py-5">
                      <Skeleton className="h-4 w-48" />
                    </div>

                    <div className="px-4 py-5">
                      <Skeleton className="h-4 w-28" />
                    </div>

                    <div className="px-4 py-5">
                      <Skeleton className="h-4 w-8" />
                    </div>

                    <div className="px-6 py-5">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/10 md:hidden">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="space-y-4 px-4 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-48 max-w-full" />
                    </div>

                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>

                  <Skeleton className="h-4 w-32" />

                  <Skeleton className="h-3 w-28" />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}