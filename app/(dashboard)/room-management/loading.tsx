import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-60 sm:h-11 sm:w-72" />
            <Skeleton className="h-5 w-80 max-w-full sm:w-96" />
          </div>

          <Skeleton className="h-10 w-full rounded-xl lg:w-36" />
        </div>

        <div className="glass-surface overflow-hidden rounded-3xl">
          <div className="border-b border-white/10 px-4 py-5 sm:px-6">
            <Skeleton className="h-5 w-16" />

            <Skeleton className="mt-2 h-4 w-36" />
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-6 gap-4 border-b border-white/10 px-6 py-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-3 w-20"
                />
              ))}
            </div>

            <div className="divide-y divide-white/10">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 items-center gap-4 px-6 py-5"
                >
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/10 md:hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-4 px-4 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20 rounded-lg" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}