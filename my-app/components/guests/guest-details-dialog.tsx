"use client";

import {
  CalendarDays,
  Check,
  Copy,
  Mail,
  Pencil,
  Phone,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { GuestPreferences } from "@/components/guests/guest-preferences";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type GuestReservation = {
  id: string;
  guestId: string;
  roomId: string;
  roomNumber: string;
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

export type GuestDetails = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  preferredLanguage: string | null;
  preferredRoomType: string | null;
  specialRequests: string | null;
  reservationCount: number;
  reservations: GuestReservation[];
};

type GuestDetailsDialogProps = {
  guest: GuestDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onReservationClick?: (reservation: GuestReservation) => void;
};

type CopiedField = "email" | "phone" | null;

export default function GuestDetailsDialog({
  guest,
  open,
  onOpenChange,
  onEdit,
  onReservationClick,
}: GuestDetailsDialogProps) {
  const [copiedField, setCopiedField] =
    useState<CopiedField>(null);

  const [now] = useState(() => Date.now());

  const activeReservations = guest.reservations.filter(
    (reservation) => reservation.status === "CHECKED_IN",
  );

  const upcomingReservations = guest.reservations.filter(
    (reservation) => {
      if (
        reservation.status === "CANCELLED" ||
        reservation.status === "CHECKED_OUT" ||
        reservation.status === "CHECKED_IN"
      ) {
        return false;
      }

      const checkIn = new Date(
        reservation.checkIn,
      ).getTime();

      return checkIn > now;
    },
  );

  const cancelledReservations =
    guest.reservations.filter(
      (reservation) =>
        reservation.status === "CANCELLED",
    );

  const pastReservations = guest.reservations.filter(
    (reservation) => {
      if (
        reservation.status === "CANCELLED" ||
        reservation.status === "CHECKED_IN"
      ) {
        return false;
      }

      const checkOut = new Date(
        reservation.checkOut,
      ).getTime();

      return (
        reservation.status === "CHECKED_OUT" ||
        checkOut <= now
      );
    },
  );

  async function handleCopy(
    value: string,
    field: "email" | "phone",
  ) {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);

      toast.success(
        field === "email"
          ? "Email copied to clipboard."
          : "Phone number copied to clipboard.",
      );

      window.setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto sm:w-[calc(100%-2rem)] sm:max-w-2xl"
      >
        <div className="relative">
          {/* Header */}
          <DialogHeader className="pr-24">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <UserRound className="size-5" />
              </div>

              <div className="min-w-0">
                <DialogTitle className="text-2xl tracking-[-0.03em]">
                  {guest.firstName} {guest.lastName}
                </DialogTitle>

                <DialogDescription className="mt-1">
                  Guest profile and reservation overview.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Header actions */}
          <div className="absolute right-0 top-0 flex items-center gap-1">
            {onEdit && (
              <>
                <div className="flex items-center rounded-lg border border-white/10 bg-white/2 p-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 cursor-pointer gap-1.5 px-2.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    onClick={onEdit}
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit profile</span>
                  </Button>
                </div>

                <div className="mx-1 h-6 w-px bg-white/10" />
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact */}
          <section>
            <h2 className="text-sm font-semibold">
              Contact Information
            </h2>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {/* Email */}
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4 transition-colors duration-150 hover:border-primary/20 hover:bg-white/3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                      Email
                    </p>
                  </div>

                  {guest.email && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      title="Copy email"
                      aria-label="Copy email"
                      onClick={() =>
                        handleCopy(
                          guest.email!,
                          "email",
                        )
                      }
                    >
                      {copiedField === "email" ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  )}
                </div>

                {guest.email ? (
                  <a
                    href={`mailto:${guest.email}`}
                    className="mt-3 block break-all text-sm font-medium transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    {guest.email}
                  </a>
                ) : (
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    No email provided
                  </p>
                )}

                {guest.email && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Click to open your email app
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4 transition-colors duration-150 hover:border-primary/20 hover:bg-white/3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                      Phone
                    </p>
                  </div>

                  {guest.phone && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      title="Copy phone number"
                      aria-label="Copy phone number"
                      onClick={() =>
                        handleCopy(
                          guest.phone!,
                          "phone",
                        )
                      }
                    >
                      {copiedField === "phone" ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  )}
                </div>

                {guest.phone ? (
                  <a
                    href={`tel:${guest.phone}`}
                    className="mt-3 block text-sm font-medium transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    {guest.phone}
                  </a>
                ) : (
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    No phone provided
                  </p>
                )}

                {guest.phone && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Click to open the phone app
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Overview */}
          <section>
            <h2 className="text-sm font-semibold">
              Overview
            </h2>

            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Reservations
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {guest.reservationCount}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Preferred Language
                </p>

                <p className="mt-2 text-sm font-medium">
                  {guest.preferredLanguage ??
                    "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Room Preference
                </p>

                <p className="mt-2 text-sm font-medium">
                  {guest.preferredRoomType ??
                    "Not specified"}
                </p>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <GuestPreferences
            preferredLanguage={
              guest.preferredLanguage
            }
            preferredRoomType={
              guest.preferredRoomType
            }
            specialRequests={guest.specialRequests}
          />

          {/* Reservation history */}
          <section>
            <div>
              <h2 className="text-sm font-semibold">
                Reservation History
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {guest.reservationCount}{" "}
                {guest.reservationCount === 1
                  ? "reservation"
                  : "reservations"}{" "}
                on record
              </p>
            </div>

            {guest.reservations.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-8 text-center">
                <p className="text-sm font-medium">
                  No reservations yet.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Reservations associated with
                  this guest will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-6">
                {activeReservations.length > 0 && (
                  <ReservationGroup
                    title="Active"
                    count={
                      activeReservations.length
                    }
                    reservations={
                      activeReservations
                    }
                    onReservationClick={
                      onReservationClick
                    }
                  />
                )}

                {upcomingReservations.length >
                  0 && (
                  <ReservationGroup
                    title="Upcoming"
                    count={
                      upcomingReservations.length
                    }
                    reservations={
                      upcomingReservations
                    }
                    onReservationClick={
                      onReservationClick
                    }
                  />
                )}

                {pastReservations.length > 0 && (
                  <ReservationGroup
                    title="Past"
                    count={pastReservations.length}
                    reservations={
                      pastReservations
                    }
                    onReservationClick={
                      onReservationClick
                    }
                  />
                )}

                {cancelledReservations.length >
                  0 && (
                  <ReservationGroup
                    title="Cancelled"
                    count={
                      cancelledReservations.length
                    }
                    reservations={
                      cancelledReservations
                    }
                    onReservationClick={
                      onReservationClick
                    }
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReservationGroup({
  title,
  count,
  reservations,
  onReservationClick,
}: {
  title: string;
  count: number;
  reservations: GuestReservation[];
  onReservationClick?: (
    reservation: GuestReservation,
  ) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </p>

        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {count}
        </span>
      </div>

      <div className="space-y-2">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onClick={onReservationClick}
          />
        ))}
      </div>
    </div>
  );
}

function ReservationCard({
  reservation,
  onClick,
}: {
  reservation: GuestReservation;
  onClick?: (
    reservation: GuestReservation,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(reservation)}
      disabled={!onClick}
      className={[
        "w-full rounded-2xl border border-white/10 bg-white/2 p-4 text-left",
        "transition-colors duration-150",
        onClick &&
          "cursor-pointer hover:border-primary/20 hover:bg-white/3",
        !onClick && "cursor-default",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold">
              Room {reservation.roomNumber}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatReservationDate(
                reservation.checkIn,
              )}{" "}
              →{" "}
              {formatReservationDate(
                reservation.checkOut,
              )}
            </p>
          </div>
        </div>

        <span
          className={[
            "inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1",
            "text-[11px] font-semibold",
            getReservationStatusClass(
              reservation.status,
            ),
          ].join(" ")}
        >
          {getReservationStatusLabel(
            reservation.status,
          )}
        </span>
      </div>

      <div className="mt-4 grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UsersRound className="size-3.5" />

          <span>
            {reservation.guestsCount}{" "}
            {reservation.guestsCount === 1
              ? "guest"
              : "guests"}
          </span>
        </div>

        <div className="text-left text-sm font-semibold sm:text-right">
          €{reservation.totalPrice}
        </div>
      </div>
    </button>
  );
}

function formatReservationDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getReservationStatusLabel(
  status: GuestReservation["status"],
) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "CONFIRMED":
      return "Confirmed";

    case "CHECKED_IN":
      return "Checked in";

    case "CHECKED_OUT":
      return "Checked out";

    case "CANCELLED":
      return "Cancelled";
  }
}

function getReservationStatusClass(
  status: GuestReservation["status"],
) {
  switch (status) {
    case "CHECKED_IN":
      return "border-primary/20 bg-primary/10 text-primary";

    case "CONFIRMED":
      return "border-secondary/20 bg-secondary/10 text-secondary";

    case "PENDING":
      return "border-white/10 bg-white/5 text-muted-foreground";

    case "CHECKED_OUT":
      return "border-white/10 bg-white/5 text-muted-foreground";

    case "CANCELLED":
      return "border-destructive/20 bg-destructive/10 text-destructive";
  }
}