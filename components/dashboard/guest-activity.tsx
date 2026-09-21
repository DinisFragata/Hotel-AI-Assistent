"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarDays,
  Clock3,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import GuestDetailsDialog, {
  type GuestDetails,
  type GuestReservation,
} from "@/components/guests/guest-details-dialog";
import ReservationDetailsDialog, {
  type ReservationDetails,
} from "@/components/reservation-management/reservation-details-dialog";

type DashboardGuest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  preferredLanguage: string | null;
  preferredRoomType: string | null;
  specialRequests: string | null;
  reservations: Array<{
    id: string;
    guestId: string;
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    guestsCount: number;
    totalPrice: string;
    status:
      | "PENDING"
      | "CONFIRMED"
      | "CHECKED_IN"
      | "CHECKED_OUT"
      | "CANCELLED";
    room: {
      number: string;
    };
  }>;
};

type GuestActivityProps = {
  guests: DashboardGuest[];
};

type ActivityReservation = {
  guest: DashboardGuest;
  reservation: DashboardGuest["reservations"][number];
};

function getTodayRange() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function buildGuestDetails(
  guest: DashboardGuest,
): GuestDetails {
  return {
    id: guest.id,
    firstName: guest.firstName,
    lastName: guest.lastName,
    email: guest.email,
    phone: guest.phone,
    preferredLanguage: guest.preferredLanguage,
    preferredRoomType: guest.preferredRoomType,
    specialRequests: guest.specialRequests,
    reservationCount: guest.reservations.length,
    reservations: guest.reservations.map(
      (reservation): GuestReservation => ({
        id: reservation.id,
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        roomNumber: reservation.room.number,
        checkIn: reservation.checkIn.toISOString(),
        checkOut: reservation.checkOut.toISOString(),
        guestsCount: reservation.guestsCount,
        totalPrice: reservation.totalPrice,
        status: reservation.status,
      }),
    ),
  };
}

function buildReservationDetails(
  guest: DashboardGuest,
  reservation: DashboardGuest["reservations"][number],
): ReservationDetails {
  return {
    id: reservation.id,
    guestId: reservation.guestId,
    guest: {
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
    },
    roomId: reservation.roomId,
    room: {
      number: reservation.room.number,
    },
    checkIn: reservation.checkIn.toISOString(),
    checkOut: reservation.checkOut.toISOString(),
    guestsCount: reservation.guestsCount,
    totalPrice: reservation.totalPrice,
    status: reservation.status,
  };
}

function GuestRow({
  guest,
  reservation,
  type,
  onClick,
}: {
  guest: DashboardGuest;
  reservation: DashboardGuest["reservations"][number];
  type: "arrival" | "departure" | "upcoming";
  onClick: () => void;
}) {
  const isArrival = type === "arrival";
  const isDeparture = type === "departure";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-150 hover:bg-white/3 sm:px-5"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold transition-colors duration-150 group-hover:text-primary">
          {guest.firstName} {guest.lastName}
        </p>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          Room {reservation.room.number}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-foreground">
          {isArrival || isDeparture
            ? formatTime(
                isArrival
                  ? reservation.checkIn
                  : reservation.checkOut,
              )
            : formatDate(reservation.checkIn)}
        </p>

        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {isArrival
            ? "Arrival"
            : isDeparture
              ? "Departure"
              : "Check-in"}
        </p>
      </div>
    </button>
  );
}

function AttentionRow({
  guest,
  onClick,
}: {
  guest: DashboardGuest;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-white/3"
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
        <MessageSquareText className="size-3.5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold transition-colors duration-150 group-hover:text-primary">
          {guest.firstName} {guest.lastName}
        </p>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {guest.specialRequests}
        </p>
      </div>
    </button>
  );
}

export default function GuestActivity({
  guests,
}: GuestActivityProps) {
  const [selectedGuest, setSelectedGuest] =
    useState<GuestDetails | null>(null);

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetails | null>(null);

  const { start, end } = getTodayRange();

  const guestActivity = useMemo(() => {
    const arrivals: ActivityReservation[] = [];
    const departures: ActivityReservation[] = [];
    const upcoming: ActivityReservation[] = [];

    for (const guest of guests) {
      for (const reservation of guest.reservations) {
        if (reservation.status === "CANCELLED") {
          continue;
        }

        if (
          reservation.checkIn >= start &&
          reservation.checkIn <= end
        ) {
          arrivals.push({
            guest,
            reservation,
          });
        }

        if (
          reservation.checkOut >= start &&
          reservation.checkOut <= end
        ) {
          departures.push({
            guest,
            reservation,
          });
        }

        if (reservation.checkIn > end) {
          upcoming.push({
            guest,
            reservation,
          });
        }
      }
    }

    arrivals.sort(
      (a, b) =>
        a.reservation.checkIn.getTime() -
        b.reservation.checkIn.getTime(),
    );

    departures.sort(
      (a, b) =>
        a.reservation.checkOut.getTime() -
        b.reservation.checkOut.getTime(),
    );

    upcoming.sort(
      (a, b) =>
        a.reservation.checkIn.getTime() -
        b.reservation.checkIn.getTime(),
    );

    return {
      arrivals: arrivals.slice(0, 4),
      departures: departures.slice(0, 4),
      upcoming: upcoming.slice(0, 4),
    };
  }, [guests, start, end]);

  const attentionGuests = useMemo(() => {
    return guests
      .filter(
        (guest) =>
          Boolean(guest.specialRequests?.trim()) &&
          guest.reservations.some(
            (reservation) =>
              reservation.status !== "CANCELLED" &&
              reservation.status !== "CHECKED_OUT",
          ),
      )
      .sort((a, b) => {
        const aReservation =
          a.reservations.find(
            (reservation) =>
              reservation.status === "CHECKED_IN" ||
              reservation.status === "CONFIRMED" ||
              reservation.status === "PENDING",
          )?.checkIn.getTime() ?? Infinity;

        const bReservation =
          b.reservations.find(
            (reservation) =>
              reservation.status === "CHECKED_IN" ||
              reservation.status === "CONFIRMED" ||
              reservation.status === "PENDING",
          )?.checkIn.getTime() ?? Infinity;

        return aReservation - bReservation;
      })
      .slice(0, 4);
  }, [guests]);

  function handleGuestClick(
    guest: DashboardGuest,
  ) {
    setSelectedReservation(null);
    setSelectedGuest(buildGuestDetails(guest));
  }

  function handleReservationClick(
    guest: DashboardGuest,
    reservation: DashboardGuest["reservations"][number],
  ) {
    setSelectedGuest(null);
    setSelectedReservation(
      buildReservationDetails(
        guest,
        reservation,
      ),
    );
  }

  function handleGuestDetailsReservationClick(
    reservation: GuestReservation,
  ) {
    if (!selectedGuest) {
      return;
    }

    const matchingReservation =
      guests
        .find(
          (guest) =>
            guest.id === selectedGuest.id,
        )
        ?.reservations.find(
          (item) => item.id === reservation.id,
        );

    if (!matchingReservation) {
      return;
    }

    const matchingGuest = guests.find(
      (guest) =>
        guest.id === selectedGuest.id,
    );

    if (!matchingGuest) {
      return;
    }

    handleReservationClick(
      matchingGuest,
      matchingReservation,
    );
  }

  return (
    <>
      <div className="glass-surface overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <UsersRound className="size-4 text-primary" />

                <h2 className="text-lg font-semibold">
                  Guest Activity
                </h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Today&apos;s guest movement and upcoming stays.
              </p>
            </div>

            <div className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/5 sm:flex">
              <CalendarDays className="size-4 text-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <section>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="size-3.5 text-secondary" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Arrivals
                </p>
              </div>

              <span className="text-sm font-semibold">
                {guestActivity.arrivals.length}
              </span>
            </div>

            {guestActivity.arrivals.length === 0 ? (
              <div className="flex min-h-28 items-center justify-center px-5 text-center">
                <p className="text-xs text-muted-foreground">
                  No arrivals today.
                </p>
              </div>
            ) : (
              guestActivity.arrivals.map(
                ({ guest, reservation }) => (
                  <GuestRow
                    key={`${guest.id}-${reservation.id}`}
                    guest={guest}
                    reservation={reservation}
                    type="arrival"
                    onClick={() =>
                      handleGuestClick(guest)
                    }
                  />
                ),
              )
            )}
          </section>

          <section>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <ArrowUpFromLine className="size-3.5 text-destructive" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Departures
                </p>
              </div>

              <span className="text-sm font-semibold">
                {guestActivity.departures.length}
              </span>
            </div>

            {guestActivity.departures.length === 0 ? (
              <div className="flex min-h-28 items-center justify-center px-5 text-center">
                <p className="text-xs text-muted-foreground">
                  No departures today.
                </p>
              </div>
            ) : (
              guestActivity.departures.map(
                ({ guest, reservation }) => (
                  <GuestRow
                    key={`${guest.id}-${reservation.id}`}
                    guest={guest}
                    reservation={reservation}
                    type="departure"
                    onClick={() =>
                      handleGuestClick(guest)
                    }
                  />
                ),
              )
            )}
          </section>

          <section>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <Clock3 className="size-3.5 text-primary" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Upcoming
                </p>
              </div>

              <span className="text-sm font-semibold">
                {guestActivity.upcoming.length}
              </span>
            </div>

            {guestActivity.upcoming.length === 0 ? (
              <div className="flex min-h-28 items-center justify-center px-5 text-center">
                <p className="text-xs text-muted-foreground">
                  No upcoming stays.
                </p>
              </div>
            ) : (
              guestActivity.upcoming.map(
                ({ guest, reservation }) => (
                  <GuestRow
                    key={`${guest.id}-${reservation.id}`}
                    guest={guest}
                    reservation={reservation}
                    type="upcoming"
                    onClick={() =>
                      handleGuestClick(guest)
                    }
                  />
                ),
              )
            )}
          </section>
        </div>
      </div>

      <div className="mt-6 glass-surface overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold">
            Guest Attention
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Guests with active stays and recorded special requests.
          </p>
        </div>

        {attentionGuests.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium">
                No guest requests require attention.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Recorded guest requests will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
            {attentionGuests.map((guest) => (
              <AttentionRow
                key={guest.id}
                guest={guest}
                onClick={() =>
                  handleGuestClick(guest)
                }
              />
            ))}
          </div>
        )}
      </div>

      {selectedGuest && (
        <GuestDetailsDialog
          guest={selectedGuest}
          open={Boolean(selectedGuest)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedGuest(null);
            }
          }}
          onReservationClick={
            handleGuestDetailsReservationClick
          }
        />
      )}

      {selectedReservation && (
        <ReservationDetailsDialog
          reservation={selectedReservation}
          open={Boolean(selectedReservation)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedReservation(null);
            }
          }}
        />
      )}
    </>
  );
}