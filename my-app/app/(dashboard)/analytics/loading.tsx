export default function AnalyticsLoading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
            <div className="mt-3 h-10 w-48 animate-pulse rounded-lg bg-muted/60 sm:h-11" />
            <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded bg-muted/40" />
          </div>
          <div className="h-10 w-48 animate-pulse rounded-xl bg-muted/40" />
        </div>

        {/* KPI Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass-surface overflow-hidden rounded-3xl p-6"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
              <div className="mt-4 h-10 w-28 animate-pulse rounded-lg bg-muted/60" />
              <div className="mt-2 h-3.5 w-32 animate-pulse rounded bg-muted/40" />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="glass-surface overflow-hidden rounded-3xl lg:col-span-3">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="h-5 w-36 animate-pulse rounded bg-muted/60" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="p-6">
              <div className="h-[220px] animate-pulse rounded-xl bg-muted/30" />
            </div>
          </div>

          <div className="glass-surface overflow-hidden rounded-3xl lg:col-span-2">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="h-5 w-28 animate-pulse rounded bg-muted/60" />
              <div className="mt-2 h-4 w-36 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="p-6">
              <div className="mx-auto h-[200px] w-[200px] animate-pulse rounded-full bg-muted/30" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-muted/60" />
                    <div className="h-3.5 flex-1 animate-pulse rounded bg-muted/40" />
                    <div className="h-3.5 w-8 animate-pulse rounded bg-muted/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdowns Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-surface overflow-hidden rounded-3xl">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="h-5 w-28 animate-pulse rounded bg-muted/60" />
              <div className="mt-2 h-4 w-44 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-muted/40" />
                  <div className="h-1.5 flex-1 animate-pulse rounded-full bg-muted/30" />
                  <div className="h-4 w-5 animate-pulse rounded bg-muted/40" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-surface overflow-hidden rounded-3xl">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="h-5 w-28 animate-pulse rounded bg-muted/60" />
              <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="divide-y divide-white/10">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-muted/40" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted/40" />
                  </div>
                  <div className="h-7 w-8 animate-pulse rounded bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
