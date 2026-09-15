"use client";

import { useState } from "react";

import GuestDetailsDialog, {
  type GuestDetails,
} from "@/components/guests/guest-details-dialog";

type GuestRowProps = {
  guest: GuestDetails;
};

export default function GuestRow({
  guest,
}: GuestRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        tabIndex={0}
        role="button"
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            setOpen(true);
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
          <span className="text-sm">
            {guest.reservationCount}
          </span>
        </td>

        <td className="px-6 py-4 align-middle text-right">
          <span className="text-xs text-muted-foreground">
            View details
          </span>
        </td>
      </tr>

      <GuestDetailsDialog
        guest={guest}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}