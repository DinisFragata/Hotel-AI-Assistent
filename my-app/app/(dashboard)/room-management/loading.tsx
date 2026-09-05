import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>

          <Skeleton className="h-10 w-28" />
        </div>

        <div className="rounded-xl border">
          <div className="p-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-2 h-4 w-56" />
          </div>

          <div className="space-y-4 p-6 pt-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}