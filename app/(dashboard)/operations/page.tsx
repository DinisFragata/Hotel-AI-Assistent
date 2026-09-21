import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import {
  ArrowRightFromLine,
  ArrowRightToLine,
  ClipboardList,
} from "lucide-react";

import OperationDateFilter from "@/components/operations/operation-date-filter";
import OperationDetailsTrigger from "@/components/operations/operation-details-trigger";
import OperationFilterProvider from "@/components/operations/operation-filter-provider";
import OperationResults from "@/components/operations/operation-results";
import OperationSearch from "@/components/operations/operation-search";
import OperationTypeFilter from "@/components/operations/operation-type-filter";

import {
  parseOperationDateFilter,
  parseOperationType,
} from "@/lib/operations/filters";

type OperationsPageProps = {
  searchParams: Promise<{
    search?: string;
    type?: string;
    date?: string;
  }>;
};

export default async function OperationsPage({
  searchParams,
}: OperationsPageProps) {
  const params = await searchParams;

  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : "";

  const type = parseOperationType(
    params.type,
  );

  const dateFilter =
    parseOperationDateFilter(params.date);

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const where = {
    ...(search
      ? {
          OR: [
            {
              guestName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              room: {
                number: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),

    ...(type
      ? {
          type,
        }
      : {}),

    ...(dateFilter === "TODAY"
      ? {
          time: {
            gte: startOfToday,
            lte: endOfToday,
          },
        }
      : dateFilter === "UPCOMING"
        ? {
            time: {
              gt: endOfToday,
            },
          }
        : dateFilter === "PAST"
          ? {
              time: {
                lt: startOfToday,
              },
            }
          : {}),
  };

  const operations =
    await prisma.operation.findMany({
      where,

      include: {
        room: {
          select: {
            number: true,
          },
        },

        reservation: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            guestsCount: true,
            totalPrice: true,
            status: true,

            guest: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },

            room: {
              select: {
                number: true,
              },
            },
          },
        },
      },

      orderBy: {
        time: "desc",
      },
    });

  const hasFilters =
    Boolean(search) ||
    Boolean(type) ||
    dateFilter !== "ALL";

  return (
    <OperationFilterProvider>
      <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-350">
          {/* Page header */}
          <div className="mb-8 sm:mb-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Property Operations
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
              Operations
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-[1.6]">
              Track guest check-ins and check-outs
              across the property.
            </p>
          </div>

          {/* Operations section */}
          <div className="glass-surface overflow-hidden rounded-3xl">
            {/* Section header + filters */}
            <div className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Operations
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {operations.length}{" "}
                    {operations.length === 1
                      ? "operation"
                      : "operations"}{" "}
                    found
                  </p>
                </div>

                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <OperationSearch
                      initialSearch={search}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    <OperationTypeFilter
                      initialType={
                        type ?? "ALL"
                      }
                    />

                    <OperationDateFilter
                      initialDate={
                        dateFilter
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <OperationResults>
              {operations.length === 0 ? (
                <div className="flex min-h-60 items-center justify-center px-4">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ClipboardList className="size-5" />
                    </div>

                    <h3 className="mt-4 font-medium">
                      {hasFilters
                        ? "No operations found."
                        : "No operations yet."}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {hasFilters
                        ? "Try adjusting your search or filters."
                        : "Check-in and check-out operations will appear here as they are recorded."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Type
                          </th>

                          <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Guest
                          </th>

                          <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Room
                          </th>

                          <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Reservation
                          </th>

                          <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Date
                          </th>

                          <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Time
                          </th>

                          <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {operations.map(
                          (operation) => (
                            <tr
                              key={
                                operation.id
                              }
                              className="border-b border-white/10 last:border-0 transition-colors duration-150 hover:bg-white/1.5"
                            >
                              <td className="px-6 py-4">
                                <OperationTypeBadge
                                  type={
                                    operation.type
                                  }
                                />
                              </td>

                              <td className="px-4 py-4">
                                <p className="font-medium">
                                  {
                                    operation.guestName
                                  }
                                </p>
                              </td>

                              <td className="px-4 py-4 font-medium">
                                Room{" "}
                                {
                                  operation
                                    .room
                                    .number
                                }
                              </td>

                              <td className="px-4 py-4">
                                {operation.reservation ? (
                                  <span className="text-sm text-foreground">
                                    Linked
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    Not linked
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {formatDate(
                                  operation.time,
                                )}
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {formatTime(
                                  operation.time,
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex justify-end">
                                  <OperationDetailsTrigger
                                    operation={{
                                      id: operation.id,
                                      type: operation.type,
                                      guestName:
                                        operation.guestName,
                                      room: {
                                        number:
                                          operation
                                            .room
                                            .number,
                                      },
                                      time: operation.time.toISOString(),
                                      reservation:
                                        operation.reservation
                                          ? {
                                              guest: {
                                                firstName:
                                                  operation
                                                    .reservation
                                                    .guest
                                                    .firstName,

                                                lastName:
                                                  operation
                                                    .reservation
                                                    .guest
                                                    .lastName,

                                                email:
                                                  operation
                                                    .reservation
                                                    .guest
                                                    .email,

                                                phone:
                                                  operation
                                                    .reservation
                                                    .guest
                                                    .phone,
                                              },

                                              room: {
                                                number:
                                                  operation
                                                    .reservation
                                                    .room
                                                    .number,
                                              },

                                              checkIn:
                                                operation
                                                  .reservation
                                                  .checkIn
                                                  .toISOString(),

                                              checkOut:
                                                operation
                                                  .reservation
                                                  .checkOut
                                                  .toISOString(),

                                              guestsCount:
                                                operation
                                                  .reservation
                                                  .guestsCount,

                                              totalPrice:
                                                operation
                                                  .reservation
                                                  .totalPrice
                                                  .toFixed(
                                                    2,
                                                  ),

                                              status:
                                                operation
                                                  .reservation
                                                  .status,
                                            }
                                          : null,
                                    }}
                                    label="Details"
                                  />
                                </div>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="space-y-3 p-4 md:hidden">
                    {operations.map(
                      (operation) => (
                        <article
                          key={
                            operation.id
                          }
                          className="min-w-0 rounded-2xl border border-white/10 bg-white/2.5 p-4 transition-colors duration-150 hover:border-white/15 hover:bg-white/4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <OperationTypeBadge
                              type={
                                operation.type
                              }
                            />

                            <span className="text-xs text-muted-foreground">
                              {formatTime(
                                operation.time,
                              )}
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Guest
                              </p>

                              <p className="mt-1.5 truncate text-sm font-medium">
                                {
                                  operation.guestName
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Room
                              </p>

                              <p className="mt-1.5 text-sm font-medium">
                                {
                                  operation
                                    .room
                                    .number
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Reservation
                              </p>

                              <p className="mt-1.5 text-sm font-medium">
                                {operation.reservation
                                  ? "Linked"
                                  : "Not linked"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Date
                              </p>

                              <p className="mt-1.5 text-sm text-muted-foreground">
                                {formatDate(
                                  operation.time,
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-white/10 pt-4">
                            <OperationDetailsTrigger
                              operation={{
                                id: operation.id,
                                type: operation.type,
                                guestName:
                                  operation.guestName,
                                room: {
                                  number:
                                    operation
                                      .room
                                      .number,
                                },
                                time: operation.time.toISOString(),
                                reservation:
                                  operation.reservation
                                    ? {
                                        guest: {
                                          firstName:
                                            operation
                                              .reservation
                                              .guest
                                              .firstName,

                                          lastName:
                                            operation
                                              .reservation
                                              .guest
                                              .lastName,

                                          email:
                                            operation
                                              .reservation
                                              .guest
                                              .email,

                                          phone:
                                            operation
                                              .reservation
                                              .guest
                                              .phone,
                                        },

                                        room: {
                                          number:
                                            operation
                                              .reservation
                                              .room
                                              .number,
                                        },

                                        checkIn:
                                          operation
                                            .reservation
                                            .checkIn
                                            .toISOString(),

                                        checkOut:
                                          operation
                                            .reservation
                                            .checkOut
                                            .toISOString(),

                                        guestsCount:
                                          operation
                                            .reservation
                                            .guestsCount,

                                        totalPrice:
                                          operation
                                            .reservation
                                            .totalPrice
                                            .toFixed(
                                              2,
                                            ),

                                        status:
                                          operation
                                            .reservation
                                            .status,
                                      }
                                    : null,
                              }}
                            />
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                </>
              )}
            </OperationResults>
          </div>
        </div>
      </section>
    </OperationFilterProvider>
  );
}

function OperationTypeBadge({
  type,
}: {
  type: "CHECK_IN" | "CHECK_OUT";
}) {
  const isCheckIn =
    type === "CHECK_IN";

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[11px] font-semibold tracking-[0.08em]",
        isCheckIn
          ? "border-secondary/25 bg-secondary/10 text-secondary"
          : "border-destructive/25 bg-destructive/10 text-destructive",
      ].join(" ")}
    >
      {isCheckIn ? (
        <ArrowRightToLine className="size-3.5" />
      ) : (
        <ArrowRightFromLine className="size-3.5" />
      )}

      {isCheckIn
        ? "CHECK-IN"
        : "CHECK-OUT"}
    </span>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}