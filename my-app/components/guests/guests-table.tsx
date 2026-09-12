"use client";

import { useState } from "react";

import GuestDetailsDialog, {
  type GuestDetails,
  type GuestReservation,
} from "@/components/guests/guest-details-dialog";

import { EditGuestDialog } from "@/components/guests/edit-guest-dialog";

import ReservationDetailsDialog, {
  type ReservationDetails,
} from "@/components/reservation-management/reservation-details-dialog";

type GuestData = GuestDetails & {
  reservations: GuestReservation[];
};

export default function GuestsTable({
  guests,
}: {
  guests: GuestData[];
}) {
  const [selectedGuest, setSelectedGuest] =
    useState<GuestData | null>(null);

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetails | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [reservationDetailsOpen, setReservationDetailsOpen] =
    useState(false);

  function handleSelectGuest(guest: GuestData) {
    setSelectedGuest(guest);
    setSelectedReservation(null);
    setDetailsOpen(true);
    setEditOpen(false);
    setReservationDetailsOpen(false);
  }

  function handleDetailsOpenChange(open: boolean) {
    setDetailsOpen(open);

    if (!open) {
      setSelectedGuest(null);
      setEditOpen(false);
    }
  }

  function handleEdit() {
    if (!selectedGuest) {
      return;
    }

    setDetailsOpen(false);
    setEditOpen(true);
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open);

    if (!open) {
      setSelectedGuest(null);
    }
  }

  function handleReservationClick(
    reservation: GuestReservation,
  ) {
    if (!selectedGuest) {
      return;
    }

    setSelectedReservation({
      id: reservation.id,

      guestId: reservation.guestId,

      guest: {
        firstName: selectedGuest.firstName,
        lastName: selectedGuest.lastName,
        email: selectedGuest.email,
        phone: selectedGuest.phone,
      },

      roomId: reservation.roomId,

      room: {
        number: reservation.roomNumber,
      },

      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestsCount: reservation.guestsCount,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
    });

    setDetailsOpen(false);
    setReservationDetailsOpen(true);
  }

  function handleReservationDetailsOpenChange(
    open: boolean,
  ) {
    setReservationDetailsOpen(open);

    if (!open) {
      setSelectedReservation(null);
    }
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-190 text-sm">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[27%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
            <col className="w-[10%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Guest
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Email
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Phone
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Reservations
              </th>

              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {guests.map((guest) => (
              <tr
                key={guest.id}
                tabIndex={0}
                role="button"
                onClick={() =>
                  handleSelectGuest(guest)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleSelectGuest(guest);
                  }
                }}
                className="cursor-pointer border-b border-white/10 outline-none transition-colors duration-150 last:border-0 hover:bg-white/2.5 focus-visible:bg-white/2.5 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary/40"
              >
                <td className="px-6 py-4 align-middle">
                  <p className="truncate font-medium">
                    {guest.firstName}{" "}
                    {guest.lastName}
                  </p>
                </td>

                <td className="px-4 py-4 align-middle">
                  <span className="block truncate text-muted-foreground">
                    {guest.email ?? "No email"}
                  </span>
                </td>

                <td className="px-4 py-4 align-middle">
                  <span className="block truncate text-muted-foreground">
                    {guest.phone ?? "No phone"}
                  </span>
                </td>

                <td className="px-4 py-4 align-middle">
                  {guest.reservationCount}
                </td>

                <td className="px-6 py-4 align-middle text-right">
                  <span className="text-xs text-muted-foreground">
                    View details
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-white/10 md:hidden">
        {guests.map((guest) => (
          <button
            key={guest.id}
            type="button"
            onClick={() =>
              handleSelectGuest(guest)
            }
            className="block w-full cursor-pointer px-4 py-5 text-left transition-colors duration-150 hover:bg-white/2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-medium">
                  {guest.firstName}{" "}
                  {guest.lastName}
                </h3>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {guest.email ?? "No email"}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/3 px-2.5 py-1 text-xs text-muted-foreground">
                {guest.reservationCount}{" "}
                {guest.reservationCount === 1
                  ? "reservation"
                  : "reservations"}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {guest.phone ??
                  "No phone number"}
              </p>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Click to view details
            </p>
          </button>
        ))}
      </div>

      {/* Guest details */}
      {selectedGuest && (
        <GuestDetailsDialog
          guest={selectedGuest}
          open={detailsOpen}
          onOpenChange={handleDetailsOpenChange}
          onEdit={handleEdit}
          onReservationClick={
            handleReservationClick
          }
        />
      )}

      {/* Guest edit */}
      {selectedGuest && (
        <EditGuestDialog
          guest={selectedGuest}
          open={editOpen}
          onOpenChange={handleEditOpenChange}
        />
      )}

      {/* Reservation details */}
      {selectedReservation && (
        <ReservationDetailsDialog
          reservation={selectedReservation}
          open={reservationDetailsOpen}
          onOpenChange={
            handleReservationDetailsOpenChange
          }
        />
      )}
    </>
  );
}