"use client";

import { useActionState, useState } from "react";

import { toast } from "sonner";

import { LoaderCircle, Pencil,} from "lucide-react";

import {
  updateReservation,
  type UpdateReservationState,
} from "@/app/(dashboard)/reservations/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import GuestSelect from "@/components/reservation-management/guest-select";
import RoomSelect from "@/components/reservation-management/room-select";
import StatusSelect from "@/components/reservation-management/status-select";
import type { ReservationStatus } from "@/lib/reservations/status";

type GuestOption = {
  id: string;
  name: string;
  email: string | null;
};

type RoomOption = {
  id: string;
  number: string;
  capacity: number;
  pricePerNight: string;
};

type ReservationEditDialogProps = {
  reservation: {
    id: string;
    guestId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    status: ReservationStatus;
  };
  guests: GuestOption[];
  rooms: RoomOption[];
};

const initialState: UpdateReservationState = {
  success: false,
  message: "",
};

const availableStatuses: Record<
  ReservationStatus,
  ReservationStatus[]
> = {
  PENDING: ["PENDING", "CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CONFIRMED", "CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["CHECKED_IN", "CHECKED_OUT"],
  CHECKED_OUT: ["CHECKED_OUT"],
  CANCELLED: ["CANCELLED"],
};

export default function ReservationEditDialog({
  reservation,
  guests,
  rooms,
}: ReservationEditDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleUpdateReservation(
    previousState: UpdateReservationState,
    formData: FormData,
  ) {
    const result = await updateReservation(
      previousState,
      formData,
    );

    if (result.success) {
      toast.success(result.message);

      setOpen(false);
    } else if (!result.fieldErrors) {
      toast.error(result.message);
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleUpdateReservation,
    initialState,
  );

  const [guestId, setGuestId] = useState(
    reservation.guestId,
  );

  const [roomId, setRoomId] = useState(
    reservation.roomId,
  );

  const [status, setStatus] = useState<ReservationStatus>(
    reservation.status,
  );

  const [checkIn, setCheckIn] = useState(
    reservation.checkIn,
  );

  const [checkOut, setCheckOut] = useState(
    reservation.checkOut,
  );

  const [guestsCount, setGuestsCount] = useState(
    String(reservation.guestsCount),
  );

  const allowedStatuses =
    availableStatuses[reservation.status];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
          />
        }
      >
        <Pencil />
        Edit
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>

          <DialogDescription>
            Update the guest, room, dates or reservation status.
          </DialogDescription>
        </DialogHeader>

        <form
          action={formAction}
          className="space-y-6"
        >
          <input
            type="hidden"
            name="id"
            value={reservation.id}
          />

          <fieldset
            disabled={isPending}
            className="space-y-5"
          >
            {/* Guest */}
            <div className="space-y-2">
              <Label htmlFor={`guestId-${reservation.id}`}>
                Guest{" "}
                <span className="text-destructive">*</span>
              </Label>

              <input
                type="hidden"
                name="guestId"
                value={guestId}
              />

              <GuestSelect
                guests={guests}
                value={guestId}
                onValueChange={setGuestId}
                disabled={isPending}
                hasError={Boolean(state.fieldErrors?.guestId)}
                placeholder="Select a guest"
              />

              {state.fieldErrors?.guestId && (
                <p
                  className="text-sm text-destructive"
                  id={`guestId-${reservation.id}-error`}
                >
                  {state.fieldErrors.guestId[0]}
                </p>
              )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor={`roomId-${reservation.id}`}>
                Room{" "}
                <span className="text-destructive">*</span>
              </Label>

              <input
                type="hidden"
                name="roomId"
                value={roomId}
              />

              <RoomSelect
                rooms={rooms}
                value={roomId}
                onValueChange={setRoomId}
                disabled={isPending}
                hasError={Boolean(state.fieldErrors?.roomId)}
                placeholder="Select a room"
              />

              {state.fieldErrors?.roomId && (
                <p
                  className="text-sm text-destructive"
                  id={`roomId-${reservation.id}-error`}
                >
                  {state.fieldErrors.roomId[0]}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor={`checkIn-${reservation.id}`}
                >
                  Check-in{" "}
                  <span className="text-destructive">*</span>
                </Label>

                <Input
                  id={`checkIn-${reservation.id}`}
                  name="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(event) =>
                    setCheckIn(event.target.value)
                  }
                  aria-invalid={Boolean(
                    state.fieldErrors?.checkIn,
                  )}
                  className={
                    state.fieldErrors?.checkIn
                      ? "border-destructive"
                      : ""
                  }
                  required
                />

                {state.fieldErrors?.checkIn && (
                  <p
                    className="text-sm text-destructive"
                    id={`checkIn-${reservation.id}-error`}
                  >
                    {state.fieldErrors.checkIn[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`checkOut-${reservation.id}`}
                >
                  Check-out{" "}
                  <span className="text-destructive">*</span>
                </Label>

                <Input
                  id={`checkOut-${reservation.id}`}
                  name="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(event) =>
                    setCheckOut(event.target.value)
                  }
                  aria-invalid={Boolean(
                    state.fieldErrors?.checkOut,
                  )}
                  className={
                    state.fieldErrors?.checkOut
                      ? "border-destructive"
                      : ""
                  }
                  required
                />

                {state.fieldErrors?.checkOut && (
                  <p
                    className="text-sm text-destructive"
                    id={`checkOut-${reservation.id}-error`}
                  >
                    {state.fieldErrors.checkOut[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Guests count */}
            <div className="space-y-2">
              <Label
                htmlFor={`guestsCount-${reservation.id}`}
              >
                Number of guests{" "}
                <span className="text-destructive">*</span>
              </Label>

              <Input
                id={`guestsCount-${reservation.id}`}
                name="guestsCount"
                type="number"
                min="1"
                value={guestsCount}
                onChange={(event) =>
                  setGuestsCount(event.target.value)
                }
                aria-invalid={Boolean(
                  state.fieldErrors?.guestsCount,
                )}
                className={
                  state.fieldErrors?.guestsCount
                    ? "border-destructive"
                    : ""
                }
                required
              />

              {state.fieldErrors?.guestsCount && (
                <p
                  className="text-sm text-destructive"
                  id={`guestsCount-${reservation.id}-error`}
                >
                  {state.fieldErrors.guestsCount[0]}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor={`status-${reservation.id}`}>
                Status{" "}
                <span className="text-destructive">*</span>
              </Label>

              <input
                type="hidden"
                name="status"
                value={status}
              />

              <StatusSelect
                value={status}
                onValueChange={setStatus}
                allowedStatuses={allowedStatuses}
                disabled={isPending}
                hasError={Boolean(state.fieldErrors?.status)}
              />

              {state.fieldErrors?.status && (
                <p
                  className="text-sm text-destructive"
                  id={`status-${reservation.id}-error`}
                >
                  {state.fieldErrors.status[0]}
                </p>
              )}
            </div>

            {/* General error */}
            {!state.success &&
              state.message &&
              !state.fieldErrors && (
                <p className="text-sm text-destructive">
                  {state.message}
                </p>
              )}
          </fieldset>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}