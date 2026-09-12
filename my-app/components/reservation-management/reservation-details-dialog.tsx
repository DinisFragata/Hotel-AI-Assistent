"use client";

import {
  CalendarDays,
  DoorOpen,
  Mail,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ReservationStatusBadge from "@/components/reservation-management/reservation-status-badge";

export type ReservationDetails = {
  id: string;
  guestId: string;

  guest: {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
  };

  roomId: string;

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

type ReservationDetailsDialogProps = {
  reservation: ReservationDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ReservationDetailsDialog({
  reservation,
  open,
  onOpenChange,
}: ReservationDetailsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        showCloseButton
        className="w-[calc(100%-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto sm:w-[calc(100%-2rem)] sm:max-w-2xl"
      >
        <DialogHeader className="pr-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <CalendarDays className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="text-2xl tracking-[-0.03em]">
                  Reservation
                </DialogTitle>

                <ReservationStatusBadge
                  status={reservation.status}
                />
              </div>

              <DialogDescription className="mt-1">
                Reservation details and booking
                information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest */}
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Check-in
                </p>

                <p className="mt-2 text-sm font-medium">
                  {formatReservationDate(
                    reservation.checkIn,
                  )}
                </p>
              </div>

              {/* Check-out */}
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Check-out
                </p>

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
            <h2 className="text-sm font-semibold">
              Summary
            </h2>

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
      </DialogContent>
    </Dialog>
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