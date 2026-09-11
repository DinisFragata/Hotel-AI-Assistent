function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-lg bg-muted/50",
        className,
      ].join(" ")}
    />
  );
}

export default function Loading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        {/* Introduction */}
        <div className="mb-7 space-y-3 sm:mb-10">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-72 sm:h-11 sm:w-80" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="glass-surface rounded-3xl p-6"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-5 h-12 w-24" />
              <Skeleton className="mt-4 h-4 w-36" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
          {/* Operations */}
          <div className="glass-surface overflow-hidden rounded-3xl">
            <div className="border-b border-white/10 px-6 py-5">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="mt-2 h-4 w-56" />
            </div>

            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-24" />
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Intelligence */}
          <div className="glass-surface overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-48" />
              </div>

              <Skeleton className="h-9 w-9 rounded-full" />
            </div>

            <div>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="border-b border-white/10 px-6 py-5 last:border-0"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-4/5" />
                  <Skeleton className="mt-4 h-7 w-24 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}