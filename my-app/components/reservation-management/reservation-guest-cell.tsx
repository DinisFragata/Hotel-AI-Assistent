"use client";

import { useState } from "react";

import GuestDetailsDialog, {
  type GuestDetails,
} from "@/components/guests/guest-details-dialog";

type ReservationGuestCellProps = {
  guest: GuestDetails;
};

export default function ReservationGuestCell({
  guest,
}: ReservationGuestCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group block min-w-0 cursor-pointer text-left"
        aria-label={`View ${guest.firstName} ${guest.lastName} profile`}
      >
        <p className="font-medium leading-5 transition-colors group-hover:text-primary">
          {guest.firstName} {guest.lastName}
        </p>

        {guest.email && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {guest.email}
          </p>
        )}
      </button>

      <GuestDetailsDialog
        guest={guest}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}