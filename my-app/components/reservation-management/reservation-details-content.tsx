import {
  CalendarDays,
  DoorOpen,
  Mail,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import ReservationStatusBadge from "@/components/reservation-management/reservation-status-badge";

export type ReservationDetailsContentData = {
  guest?: {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
  };

  room: {
    number: string;
  };

  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CHECKED_IN"
    | "CHECKED_OUT"
    | "CANCELLED";
};

type ReservationDetailsContentProps = {
  reservation: ReservationDetailsContentData;
  showGuest?: boolean;
  showStatus?: boolean;
};

export default function ReservationDetailsContent({
  reservation,
  showGuest = true,
  showStatus = true,
}: ReservationDetailsContentProps) {
  return (
    <div className="space-y-6">
      {/* Guest */}
      {showGuest && reservation.guest && (
        <section>
          <h2 className="text-sm font-semibold">
            Guest
          </h2>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/2 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="font-medium">
                  {reservation.guest.firstName}{" "}
                  {reservation.guest.lastName}
                </p>

                {reservation.guest.email && (
                  <a
                    href={`mailto:${reservation.guest.email}`}
                    className="mt-1 flex w-fit max-w-full items-center gap-1.5 break-all text-sm text-muted-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    <Mail className="size-3.5 shrink-0" />

                    <span>
                      {reservation.guest.email}
                    </span>
                  </a>
                )}

                {reservation.guest.phone && (
                  <a
                    href={`tel:${reservation.guest.phone}`}
                    className="mt-1 flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    <Phone className="size-3.5 shrink-0" />

                    <span>
                      {reservation.guest.phone}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stay */}
      <section>
        <h2 className="text-sm font-semibold">
          Stay
        </h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {/* Room */}
          <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DoorOpen className="size-4" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Room
              </p>
            </div>

            <p className="mt-3 text-lg font-semibold">
              Room {reservation.room.number}
            </p>
          </div>

          {/* Guests */}
          <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersRound className="size-4" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Guests
              </p>
            </div>

            <p className="mt-3 text-lg font-semibold">
              {reservation.guestsCount}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {reservation.guestsCount === 1
                ? "guest"
                : "guests"}
            </p>
          </div>

          {/* Check-in */}
          <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Check-in
              </p>
            </div>

            <p className="mt-2 text-sm font-medium">
              {formatReservationDate(
                reservation.checkIn,
              )}
            </p>
          </div>

          {/* Check-out */}
          <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Check-out
              </p>
            </div>

            <p className="mt-2 text-sm font-medium">
              {formatReservationDate(
                reservation.checkOut,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">
            Summary
          </h2>

          {showStatus && (
            <ReservationStatusBadge
              status={reservation.status}
            />
          )}
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/2 p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Total
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight">
              €{reservation.totalPrice}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatReservationDate(
  value: string,
) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}