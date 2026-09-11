import { prisma } from "@/lib/prisma";

import CreateMaintenanceDialog from "@/components/maintenance/create-maintenance-dialog";
import MaintenanceResults from "@/components/maintenance/maintenance-results";
import MaintenanceToolbar from "@/components/maintenance/maintenance-toolbar";

import {
  getMaintenanceFilters,
  parseMaintenanceSearchParams,
} from "@/lib/maintenance/filters";

type MaintenancePageProps = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default async function MaintenancePage({
  searchParams,
}: MaintenancePageProps) {
  const rawSearchParams = await searchParams;

  const filters =
    parseMaintenanceSearchParams(rawSearchParams);

  const where = getMaintenanceFilters(filters);

  const [maintenance, rooms, users] = await Promise.all([
    prisma.maintenance.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        room: {
          select: {
            id: true,
            number: true,
          },
        },

        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },

        history: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),

    prisma.room.findMany({
      orderBy: {
        number: "asc",
      },
      select: {
        id: true,
        number: true,
        capacity: true,
        pricePerNight: true,
      },
    }),

    prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const roomOptions = rooms.map((room) => ({
    id: room.id,
    number: room.number,
    capacity: room.capacity,
    pricePerNight: room.pricePerNight.toString(),
  }));

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.priority) ||
    Boolean(filters.assignedToId);

  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Property Operations
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
              Maintenance
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-[1.6]">
              Track maintenance requests, assignments and operational issues.
            </p>
          </div>
        </div>

        {/* Maintenance section */}
        <div className="glass-surface overflow-hidden rounded-3xl">
          <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-semibold">
                Maintenance Requests
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {maintenance.length}{" "}
                {maintenance.length === 1
                  ? "request"
                  : "requests"}{" "}
                {hasActiveFilters
                  ? "matching your filters"
                  : "registered"}
              </p>
            </div>

            <CreateMaintenanceDialog
              rooms={roomOptions}
              users={users}
            />
          </div>

          <MaintenanceToolbar users={users} />

          <MaintenanceResults
            maintenance={maintenance}
            rooms={roomOptions}
            users={users}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </section>
  );
}