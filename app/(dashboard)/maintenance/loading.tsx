import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />

            <Skeleton className="h-10 w-52 sm:h-11 sm:w-64" />

            <Skeleton className="h-5 w-80 max-w-full sm:w-96" />
          </div>
        </div>

        {/* Maintenance section */}
        <div className="glass-surface overflow-hidden rounded-3xl">
          {/* Section header */}
          <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>

            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>

          {/* Toolbar */}
          <div className="border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Skeleton className="h-9 w-full lg:flex-1" />

              <div className="flex flex-col gap-2 sm:flex-row">
                <Skeleton className="h-9 w-full sm:w-28" />

                <Skeleton className="h-9 w-full sm:w-28" />

                <Skeleton className="h-9 w-full sm:w-32" />
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-hidden md:block">
            <div className="grid grid-cols-[34%_10%_13%_16%_16%_11%] border-b border-white/10">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={[
                    "px-4 py-4",
                    index === 0 ? "px-6" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>

            <div className="divide-y divide-white/10">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[34%_10%_13%_16%_16%_11%] items-center"
                >
                  <div className="min-w-0 px-6 py-5">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56 max-w-full" />
                    </div>
                  </div>

                  <div className="px-4 py-5">
                    <Skeleton className="h-4 w-16" />
                  </div>

                  <div className="px-4 py-5">
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>

                  <div className="px-4 py-5">
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="px-4 py-5">
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="px-4 py-5">
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/10 md:hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 px-4 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>

                <Skeleton className="h-8 w-full" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>

                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}