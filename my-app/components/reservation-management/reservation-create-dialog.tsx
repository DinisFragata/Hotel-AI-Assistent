"use client";

import { useActionState, useEffect, useMemo, useState,} from "react";

import { useRouter } from "next/navigation";

import {
  createReservation,
  type CreateReservationState,
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
import { toast } from "sonner";

const initialState: CreateReservationState = {
  success: false,
  message: "",
};

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

type ReservationCreateDialogProps = {
  guests: GuestOption[];
  rooms: RoomOption[];
};

export default function ReservationCreateDialog({
guests,
rooms,
}: ReservationCreateDialogProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const [state, formAction, isPending] = useActionState(
        createReservation,
        initialState,
    );

    const canSubmit =
        Boolean(selectedRoomId) &&
        Boolean(checkIn) &&
        Boolean(checkOut);

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

    const estimatedTotal = useMemo(() => {
        const room = rooms.find(
            (room) => room.id === selectedRoomId,
        );

        if (!room || !checkIn || !checkOut) {
            return null;
        }

        const start = new Date(`${checkIn}T00:00:00`);
        const end = new Date(`${checkOut}T00:00:00`);

        const difference =
            end.getTime() - start.getTime();

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        const nights = Math.round(
            difference / millisecondsPerDay,
        );

        if (nights <= 0) {
            return null;
        }

        const total =
            Number(room.pricePerNight) * nights;

        return {
            nights,
            total,
        };
        }, [rooms, selectedRoomId, checkIn, checkOut]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>
            Add Reservation
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
            <DialogTitle>Add Reservation</DialogTitle>

            <DialogDescription>
                Create a new reservation for a hotel guest.
            </DialogDescription>
            </DialogHeader>

            <form action={formAction} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="guestId">Guest</Label>

                <Select name="guestId">
                <SelectTrigger id="guestId">
                    <SelectValue placeholder="Select a guest" />
                </SelectTrigger>

                    <SelectContent>
                        {guests.length === 0 ? (
                            <SelectItem value="no-guests" disabled>
                            No guests available
                            </SelectItem>
                        ) : (
                            guests.map((guest) => (
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
                            ))
                        )}
                    </SelectContent>
                </Select>

                {state.fieldErrors?.guestId && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.guestId[0]}
                </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="roomId">Room</Label>

                <Select
                    name="roomId"
                    value={selectedRoomId}
                    onValueChange={(value) => setSelectedRoomId(value ?? "")}
                >
                <SelectTrigger id="roomId">
                    <SelectValue placeholder="Select a room" />
                </SelectTrigger>

                    <SelectContent>
                        {rooms.length === 0 ? (
                            <SelectItem value="no-rooms" disabled>
                            No rooms available
                            </SelectItem>
                        ) : (
                            rooms.map((room) => (
                            <SelectItem
                                key={room.id}
                                value={room.id}
                            >
                                <div className="flex items-center justify-between gap-6">
                                <span>
                                    Room {room.number}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    €{room.pricePerNight}/night
                                </span>
                                </div>
                            </SelectItem>
                            ))
                        )}
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
                <Label htmlFor="checkIn">Check-in</Label>

                <Input
                    id="checkIn"
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
                <Label htmlFor="checkOut">Check-out</Label>

                <Input
                    id="checkOut"
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
                <Label htmlFor="guestsCount">
                Number of guests
                </Label>

                <Input
                id="guestsCount"
                name="guestsCount"
                type="number"
                min="1"
                placeholder="e.g. 2"
                required
                />

                {state.fieldErrors?.guestsCount && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.guestsCount[0]}
                </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>

                <Select
                name="status"
                defaultValue="PENDING"
                >
                <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="PENDING">
                    Pending
                    </SelectItem>

                    <SelectItem value="CONFIRMED">
                    Confirmed
                    </SelectItem>
                </SelectContent>
                </Select>

                {state.fieldErrors?.status && (
                <p className="text-sm text-destructive">
                    {state.fieldErrors.status[0]}
                </p>
                )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/2 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                    <p className="text-sm text-muted-foreground">
                        Estimated total
                    </p>

                    {estimatedTotal && (
                        <p className="mt-1 text-xs text-muted-foreground">
                        {estimatedTotal.nights}{" "}
                        {estimatedTotal.nights === 1
                            ? "night"
                            : "nights"}{" "}
                        × selected room rate
                        </p>
                    )}
                    </div>

                    <span className="text-sm font-semibold">
                    {estimatedTotal
                        ? `€${estimatedTotal.total.toFixed(2)}`
                        : "Select room and dates"}
                    </span>
                </div>
            </div>

            {!state.success &&
                state.message &&
                !state.fieldErrors && (
                <p className="text-sm text-destructive">
                    {state.message}
                </p>
                )}

            <div className="flex justify-end gap-2">
                <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                >
                Cancel
                </Button>

                <Button type="submit" disabled={isPending || !canSubmit}>
                    {isPending ? "Creating..." : "Create Reservation"}
                </Button>
            </div>
            </form>
        </DialogContent>
        </Dialog>
    );
}