export default function Loading() {
  return (
    <section className="relative min-h-screen px-10 pb-10 pt-10">
      <div className="mx-auto max-w-350">
        {/* Page header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-muted/60" />

            <div className="h-11 w-72 animate-pulse rounded-xl bg-muted/60" />

            <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-muted/40" />
          </div>

          <div className="hidden h-10 w-40 animate-pulse rounded-xl bg-muted/60 md:block" />
        </div>

        {/* Reservations surface */}
        <div className="glass-surface overflow-hidden rounded-3xl">
          {/* Toolbar */}
          <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded-lg bg-muted/60" />
              <div className="h-4 w-48 animate-pulse rounded-lg bg-muted/40" />
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40 md:w-64" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40 md:w-44" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40 md:w-40" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {[
                    "Guest",
                    "Room",
                    "Check-in",
                    "Check-out",
                    "Guests",
                    "Total",
                    "Status",
                    "Actions",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-6 py-4 text-left"
                    >
                      <div className="h-3 w-16 animate-pulse rounded bg-muted/40" />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 7 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                        <div className="h-3 w-36 animate-pulse rounded bg-muted/40" />
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="h-4 w-12 animate-pulse rounded bg-muted/60" />
                    </td>

                    <td className="px-4 py-5">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
                    </td>

                    <td className="px-4 py-5">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
                    </td>

                    <td className="px-4 py-5">
                      <div className="h-4 w-12 animate-pulse rounded bg-muted/40" />
                    </td>

                    <td className="px-4 py-5">
                      <div className="h-4 w-16 animate-pulse rounded bg-muted/60" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-7 w-24 animate-pulse rounded-full bg-muted/40" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}