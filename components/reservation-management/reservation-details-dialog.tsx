"use client";

import { CalendarDays } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ReservationStatusBadge from "@/components/reservation-management/reservation-status-badge";

import ReservationDetailsContent, {
  type ReservationDetailsContentData,
} from "@/components/reservation-management/reservation-details-content";

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
  const contentData: ReservationDetailsContentData =
    {
      guest: reservation.guest,
      room: reservation.room,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestsCount: reservation.guestsCount,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
    };

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

        <ReservationDetailsContent
          reservation={contentData}
          showStatus={false}
        />
      </DialogContent>
    </Dialog>
  );
}