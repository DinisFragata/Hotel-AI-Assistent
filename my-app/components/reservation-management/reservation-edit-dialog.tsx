"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    status:
      | "PENDING"
      | "CONFIRMED"
      | "CHECKED_IN"
      | "CHECKED_OUT"
      | "CANCELLED";
  };
  guests: GuestOption[];
  rooms: RoomOption[];
};

const initialState: UpdateReservationState = { success: false, message: "",};


export default function ReservationEditDialog({
    reservation,
    guests,
    rooms,
}: ReservationEditDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState( updateReservation, initialState,);

    const [guestId, setGuestId] = useState(reservation.guestId);

    const [roomId, setRoomId] = useState(reservation.roomId);
    const [status, setStatus] = useState(reservation.status);

    const [checkIn, setCheckIn] = useState(reservation.checkIn);
    const [checkOut, setCheckOut] = useState(reservation.checkOut);
    const [guestsCount, setGuestsCount] = useState(
    String(reservation.guestsCount),
    );

    useEffect(() => {
        if (!state.message) {
            return;
        }

        if (state.success) {
            toast.success(state.message);
            router.refresh();
        } else if (!state.fieldErrors) {
            toast.error(state.message);
        }
    }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>

          <DialogDescription>
            Update the guest, room, dates or reservation status.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <input
                type="hidden"
                name="id"
                value={reservation.id}
            />
            <Label htmlFor={`guestId-${reservation.id}`}>
              Guest
            </Label>

            <Select
                name="guestId"
                value={guestId}
                onValueChange={(value) => setGuestId(value ?? "")}
            >
              <SelectTrigger id={`guestId-${reservation.id}`}>
                <SelectValue placeholder="Select a guest" />
              </SelectTrigger>

              <SelectContent>
                {guests.map((guest) => (
                  <SelectItem
                    key={guest.id}
                    value={guest.id}
                  >
                    <div className="flex flex-col">
                      <span>{guest.name}</span>

                      {guest.email && (
                        <span className="text-xs text-muted-foreground">
                          {guest.email}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.guestId && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.guestId[0]}
                </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`roomId-${reservation.id}`}>
              Room
            </Label>

            <Select
                name="roomId"
                value={roomId}
                onValueChange={(value) => setRoomId(value ?? "")}
            >
                <SelectTrigger id={`roomId-${reservation.id}`}>
                    <SelectValue placeholder="Select a room" />
                </SelectTrigger>

                <SelectContent>
                    {rooms.map((room) => (
                    <SelectItem
                        key={room.id}
                        value={room.id}
                    >
                        <div className="flex items-center justify-between gap-6">
                        <span>Room {room.number}</span>

                        <span className="text-xs text-muted-foreground">
                            €{room.pricePerNight}/night
                        </span>
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.fieldErrors?.roomId && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.roomId[0]}
                </p>
            )}
        </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor={`checkIn-${reservation.id}`}>
                    Check-in
                    </Label>

                <Input
                    id={`checkIn-${reservation.id}`}
                    name="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                    required
                />

                    {state.fieldErrors?.checkIn && (
                    <p className="text-sm text-destructive">
                        {state.fieldErrors.checkIn[0]}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`checkOut-${reservation.id}`}>
                    Check-out
                    </Label>

                    <Input
                        id={`checkOut-${reservation.id}`}
                        name="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={(event) => setCheckOut(event.target.value)}
                        required
                    />

                    {state.fieldErrors?.checkOut && (
                    <p className="text-sm text-destructive">
                        {state.fieldErrors.checkOut[0]}
                    </p>
                    )}
                </div>
                </div>

          <div className="space-y-2">
            <Label htmlFor={`guestsCount-${reservation.id}`}>
              Number of guests
            </Label>

            <Input
                id={`guestsCount-${reservation.id}`}
                name="guestsCount"
                type="number"
                min="1"
                value={guestsCount}
                onChange={(event) => setGuestsCount(event.target.value)}
                required
            />
            {state.fieldErrors?.guestsCount && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.guestsCount[0]}
                </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`status-${reservation.id}`}>
              Status
            </Label>

            <Select
                name="status"
                value={status}
                onValueChange={(value) =>
                    setStatus(
                    value as
                        | "PENDING"
                        | "CONFIRMED"
                        | "CHECKED_IN"
                        | "CHECKED_OUT"
                        | "CANCELLED",
                    )
                }
            >
                <SelectTrigger id={`status-${reservation.id}`}>
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="PENDING">
                    Pending
                    </SelectItem>

                    <SelectItem value="CONFIRMED">
                    Confirmed
                    </SelectItem>

                    <SelectItem value="CHECKED_IN">
                    Checked In
                    </SelectItem>

                    <SelectItem value="CHECKED_OUT">
                    Checked Out
                    </SelectItem>

                    <SelectItem value="CANCELLED">
                    Cancelled
                    </SelectItem>
                </SelectContent>
            </Select>
            {state.fieldErrors?.status && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.status[0]}
                </p>
            )}
        </div>

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
                {isPending
                    ? "Saving..."
                    : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}