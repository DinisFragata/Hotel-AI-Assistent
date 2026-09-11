"use client";

import { useActionState, useState } from "react";

import { LoaderCircle, X } from "lucide-react";

import { toast } from "sonner";

import {
  cancelReservation,
  type CancelReservationState,
} from "@/app/(dashboard)/reservations/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ReservationCancelDialogProps = {
  reservationId: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  totalPrice: string;
};

const initialState: CancelReservationState = {
  success: false,
  message: "",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function ReservationCancelDialog({
  reservationId,
  guestName,
  roomNumber,
  checkIn,
  checkOut,
  totalPrice,
}: ReservationCancelDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleCancelReservation(
    previousState: CancelReservationState,
    formData: FormData,
  ) {
    const result = await cancelReservation(
      previousState,
      formData,
    );

    if (result.success) {
      toast.success(result.message);

      setOpen(false);
    } else {
      toast.error(result.message);
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleCancelReservation,
    initialState,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <X />
        Cancel
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Reservation</DialogTitle>

          <DialogDescription>
            Are you sure you want to cancel this reservation?
          </DialogDescription>
        </DialogHeader>

        <fieldset
          disabled={isPending}
          className="space-y-5"
        >
          {/* Reservation summary */}
          <div className="rounded-2xl border border-destructive/15 bg-destructive/5 px-4 py-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {guestName}
              </p>

              <p className="text-sm text-muted-foreground">
                Room {roomNumber}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-destructive/10 pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Stay
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(checkIn)} → {formatDate(checkOut)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Total
                </p>

                <p className="mt-1 text-sm font-semibold">
                  €{totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <p className="text-sm leading-6 text-muted-foreground">
            The reservation will remain in the system as{" "}
            <span className="font-medium text-foreground">
              cancelled
            </span>
            . It will not be deleted.
          </p>
        </fieldset>

        <form action={formAction}>
          <input
            type="hidden"
            name="id"
            value={reservationId}
          />

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Keep Reservation
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X />
                  Cancel Reservation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}