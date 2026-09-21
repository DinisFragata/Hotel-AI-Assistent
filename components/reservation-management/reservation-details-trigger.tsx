"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import ReservationDetailsDialog, {
  type ReservationDetails,
} from "@/components/reservation-management/reservation-details-dialog";

type ReservationDetailsTriggerProps = {
  reservation: ReservationDetails;
  label?: string;
};

export default function ReservationDetailsTrigger({
  reservation,
  label = "View details",
}: ReservationDetailsTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Eye className="size-3.5" />
        {label}
      </Button>

      <ReservationDetailsDialog
        reservation={reservation}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}