export default function AiAssistantLoading() {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">

        {/* Header */}
        <div className="mb-8">
          <div className="h-3 w-6 animate-pulse rounded bg-muted/60" />
          <div className="mt-3 h-10 w-52 animate-pulse rounded-lg bg-muted/60 sm:h-11" />
          <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded bg-muted/40" />
        </div>

        {/* Chat placeholder */}
        <div
          className="glass-surface overflow-hidden rounded-3xl"
          style={{ minHeight: "calc(100vh - 280px)" }}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 animate-pulse rounded-xl bg-muted/40 shrink-0" />
              <div className="space-y-2 flex-1 max-w-lg">
                <div className="h-3.5 animate-pulse rounded bg-muted/40" />
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-muted/30" />
                <div className="h-3.5 w-3/5 animate-pulse rounded bg-muted/20" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
