import { prisma } from "@/lib/prisma";
import ReservationCreateDialog from "@/components/reservation-management/reservation-create-dialog";
import ReservationEditDialog from "@/components/reservation-management/reservation-edit-dialog";
import ReservationCancelDialog from "@/components/reservation-management/reservation-cancel-dialog";
import ReservationStatusAction from "@/components/reservation-management/reservation-status-action";
import ReservationSearch from "@/components/reservation-management/reservation-search";
import ReservationStatusFilter from "@/components/reservation-management/reservation-status-filter";
import ReservationDateFilter from "@/components/reservation-management/reservation-date-filter";
import ReservationFilterProvider from "@/components/reservation-management/reservation-filter-provider";
import ReservationResults from "@/components/reservation-management/reservation-results";

import ReservationCard from "@/components/reservation-management/reservation-card";
import ReservationStatusBadge from "@/components/reservation-management/reservation-status-badge";

import {
  parseReservationDateFilter,
  parseReservationStatus,
} from "@/lib/reservations/filters";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    date?: string;
  }>;
}) {

  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const selectedStatus = parseReservationStatus(params.status,);

  const selectedDate = parseReservationDateFilter(params.date,);

  const hasSearchFilter = Boolean(search);
  const hasStatusFilter = Boolean(selectedStatus);
  const hasDateFilter = Boolean(selectedDate);

  const statusValue = selectedStatus ?? "ALL";
  const dateValue = selectedDate ?? "ALL";

  const activeFilterCount = [
    hasSearchFilter,
    hasStatusFilter,
    hasDateFilter,
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0;

  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const [reservations, guests, rooms] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  guest: {
                    firstName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  guest: {
                    lastName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  guest: {
                    email: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  room: {
                    number: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),

        ...(selectedStatus
          ? {
              status: selectedStatus,
            }
          : {}),
          ...(selectedDate === "UPCOMING"
            ? {
                checkIn: {
                  gte: tomorrowStart,
                },
              }
            : {}),

          ...(selectedDate === "TODAY"
            ? {
                checkIn: {
                  lt: tomorrowStart,
                },
                checkOut: {
                  gt: todayStart,
                },
              }
            : {}),

          ...(selectedDate === "PAST"
            ? {
                checkOut: {
                  lte: todayStart,
                },
              }
            : {}),
      },

      include: {
        guest: true,
        room: true,
      },

      orderBy: {
        checkIn: "asc",
      },
    }),

    prisma.guest.findMany({
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    }),

    prisma.room.findMany({
      orderBy: {
        number: "asc",
      },
    }),
  ]);

  const reservationRows = reservations.map((reservation) => ({
    ...reservation,
    totalPrice: reservation.totalPrice.toFixed(2),
    checkInInput: formatInputDate(reservation.checkIn),
    checkOutInput: formatInputDate(reservation.checkOut),
  }));

  const guestOptions = guests.map((guest) => ({
    id: guest.id,
    name: `${guest.firstName} ${guest.lastName}`,
    email: guest.email,
  }));

  const roomOptions = rooms.map((room) => ({
    id: room.id,
    number: room.number,
    capacity: room.capacity,
    pricePerNight: room.pricePerNight.toFixed(2),
  }));

  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-10">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Property Management
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
              Reservations
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-[1.6] text-muted-foreground">
              Manage guest reservations, booking dates and reservation status.
            </p>
          </div>

          <ReservationCreateDialog
            guests={guestOptions}
            rooms={roomOptions}
          />
        </div>

        <ReservationFilterProvider>
        <div className="glass-surface overflow-hidden rounded-3xl">
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Reservations
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {reservationRows.length}{" "}
                {reservationRows.length === 1
                  ? "reservation"
                  : "reservations"}{" "}
                {hasFilters
                  ? "matching your filters"
                  : "registered"}
              </p>
            </div>

            <div className="w-full md:w-auto">
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1 md:w-72 md:flex-none">
                  <ReservationSearch
                    initialSearch={search}
                  />
                </div>

                <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:flex md:gap-3">
                  <ReservationStatusFilter
                    initialStatus={statusValue}
                  />

                  <ReservationDateFilter
                    initialDate={dateValue}
                  />
                </div>
              </div>
            </div>
          </div>

          <ReservationResults>
          {reservationRows.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="max-w-sm text-center">
                <h3 className="font-medium">
                  {search
                    ? "No matching reservations"
                    : "No reservations yet"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {search
                    ? `No reservations were found for the selected filters.`
                    : "Create your first reservation to start managing hotel bookings."}
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
                          Guest
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Room
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Check-in
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Check-out
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Guests
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Total
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Status
                        </th>

                        <th className="w-32 px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {reservationRows.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="border-b border-white/10 last:border-0 transition-colors duration-150 hover:bg-white/1.5"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium leading-5">
                                {reservation.guest.firstName}{" "}
                                {reservation.guest.lastName}
                              </p>

                              {reservation.guest.email && (
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                  {reservation.guest.email}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 font-medium">
                            {reservation.room.number}
                          </td>

                          <td className="px-4 py-4 text-muted-foreground">
                            {formatDate(reservation.checkIn)}
                          </td>

                          <td className="px-4 py-4 text-muted-foreground">
                            {formatDate(reservation.checkOut)}
                          </td>

                          <td className="px-4 py-4 text-muted-foreground">
                            {reservation.guestsCount}{" "}
                            {reservation.guestsCount === 1
                              ? "guest"
                              : "guests"}
                          </td>

                          <td className="px-4 py-4 font-medium">
                            €{reservation.totalPrice}
                          </td>

                          <td className="px-6 py-4">
                            <ReservationStatusBadge
                              status={reservation.status}
                            />
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              {reservation.status !== "CHECKED_OUT" && reservation.status !== "CANCELLED" && (
                                <ReservationEditDialog
                                  reservation={{
                                    id: reservation.id,
                                    guestId: reservation.guestId,
                                    roomId: reservation.roomId,
                                    checkIn: reservation.checkInInput,
                                    checkOut: reservation.checkOutInput,
                                    guestsCount: reservation.guestsCount,
                                    status: reservation.status,
                                  }}
                                  guests={guestOptions}
                                  rooms={roomOptions}
                                />
                              )}

                              {reservation.status === "PENDING" && (
                                <>
                                  <ReservationStatusAction
                                    reservationId={reservation.id}
                                    targetStatus="CONFIRMED"
                                  />

                                  <ReservationCancelDialog
                                    reservationId={reservation.id}
                                    guestName={`${reservation.guest.firstName} ${reservation.guest.lastName}`}
                                    roomNumber={reservation.room.number}
                                    checkIn={reservation.checkInInput}
                                    checkOut={reservation.checkOutInput}
                                    totalPrice={reservation.totalPrice}
                                  />
                                </>
                              )}

                              {reservation.status === "CONFIRMED" && (
                                <>
                                  <ReservationStatusAction
                                    reservationId={reservation.id}
                                    targetStatus="CHECKED_IN"
                                  />

                                  <ReservationCancelDialog
                                    reservationId={reservation.id}
                                    guestName={`${reservation.guest.firstName} ${reservation.guest.lastName}`}
                                    roomNumber={reservation.room.number}
                                    checkIn={reservation.checkInInput}
                                    checkOut={reservation.checkOutInput}
                                    totalPrice={reservation.totalPrice}
                                  />
                                </>
                              )}

                              {reservation.status === "CHECKED_IN" && (
                                <ReservationStatusAction
                                  reservationId={reservation.id}
                                  targetStatus="CHECKED_OUT"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {reservationRows.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      guests={guestOptions}
                      rooms={roomOptions}
                    />
                  ))}
                </div>
              </>
            )}
          </ReservationResults>
        </div>
        </ReservationFilterProvider>
      </div>
    </section>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}