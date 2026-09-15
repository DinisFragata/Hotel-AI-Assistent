"use client";

import {
  useActionState,
  useMemo,
  useState,
} from "react";

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

import { toast } from "sonner";

import {
  LoaderCircle,
  Plus,
} from "lucide-react";

import GuestSelect from "@/components/reservation-management/guest-select";
import ReservationQuickGuest from "@/components/reservation-management/reservation-quick-guest";
import RoomSelect from "@/components/reservation-management/room-select";
import StatusSelect from "@/components/reservation-management/status-select";

import type { ReservationStatus } from "@/lib/reservations/status";

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

type CreatedGuest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
};

export default function ReservationCreateDialog({
  guests,
  rooms,
}: ReservationCreateDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [guestOptions, setGuestOptions] =
    useState<GuestOption[]>(guests);

  const [showQuickGuest, setShowQuickGuest] =
    useState(false);

  const [selectedGuestId, setSelectedGuestId] =
    useState("");

  const [selectedRoomId, setSelectedRoomId] =
    useState("");

  const [status, setStatus] =
    useState<ReservationStatus>("PENDING");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [guestsCount, setGuestsCount] =
    useState("");

  async function handleCreateReservation(
    previousState: CreateReservationState,
    formData: FormData,
  ) {
    const result = await createReservation(
      previousState,
      formData,
    );

    if (result.success) {
      toast.success(result.message);

      setOpen(false);

      resetForm();

      router.refresh();
    } else if (!result.fieldErrors) {
      toast.error(result.message);
    }

    return result;
  }

  const [state, formAction, isPending] =
    useActionState(
      handleCreateReservation,
      initialState,
    );

  function resetForm() {
    setSelectedGuestId("");
    setSelectedRoomId("");
    setStatus("PENDING");
    setCheckIn("");
    setCheckOut("");
    setGuestsCount("");
    setShowQuickGuest(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  function handleGuestCreated(
    guest: CreatedGuest,
  ) {
    const newGuestOption: GuestOption = {
      id: guest.id,
      name: `${guest.firstName} ${guest.lastName}`,
      email: guest.email,
    };

    setGuestOptions((currentGuests) => {
      const alreadyExists = currentGuests.some(
        (currentGuest) =>
          currentGuest.id === guest.id,
      );

      if (alreadyExists) {
        return currentGuests;
      }

      return [
        ...currentGuests,
        newGuestOption,
      ].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    });

    setSelectedGuestId(guest.id);
    setShowQuickGuest(false);
  }

  function handleCreateGuestCancel() {
    setShowQuickGuest(false);
  }

  const canSubmit =
    Boolean(selectedGuestId) &&
    Boolean(selectedRoomId) &&
    Boolean(checkIn) &&
    Boolean(checkOut) &&
    Boolean(guestsCount);

  const estimatedTotal = useMemo(() => {
    const room = rooms.find(
      (room) =>
        room.id === selectedRoomId,
    );

    if (
      !room ||
      !checkIn ||
      !checkOut
    ) {
      return null;
    }

    const start = new Date(
      `${checkIn}T00:00:00`,
    );

    const end = new Date(
      `${checkOut}T00:00:00`,
    );

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
  }, [
    rooms,
    selectedRoomId,
    checkIn,
    checkOut,
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={<Button />}
      >
        <Plus />
        Add Reservation
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add Reservation
          </DialogTitle>

          <DialogDescription>
            Create a new reservation for a
            hotel guest.
          </DialogDescription>
        </DialogHeader>

        <form
          action={formAction}
          className="space-y-6"
        >
          <fieldset
            disabled={isPending}
            className="space-y-5"
          >
            {/* Guest */}
            <div className="space-y-2">
              <Label htmlFor="guestId">
                Guest{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <input
                type="hidden"
                name="guestId"
                value={selectedGuestId}
              />

              {showQuickGuest ? (
                <ReservationQuickGuest
                  onCreated={handleGuestCreated}
                  onCancel={handleCreateGuestCancel}
                />
              ) : (
                <GuestSelect
                  guests={guestOptions}
                  value={selectedGuestId}
                  onValueChange={setSelectedGuestId}
                  disabled={isPending}
                  hasError={Boolean(
                    state.fieldErrors?.guestId,
                  )}
                  placeholder="Select a guest"
                  onCreateGuest={() =>
                    setShowQuickGuest(true)
                  }
                />
              )}

              {!showQuickGuest &&
                state.fieldErrors
                  ?.guestId && (
                  <p
                    className="text-sm text-destructive"
                    id="guestId-error"
                  >
                    {
                      state.fieldErrors
                        .guestId[0]
                    }
                  </p>
                )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="roomId">
                Room{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <input
                type="hidden"
                name="roomId"
                value={selectedRoomId}
              />

              <RoomSelect
                rooms={rooms}
                value={selectedRoomId}
                onValueChange={
                  setSelectedRoomId
                }
                disabled={isPending}
                hasError={Boolean(
                  state.fieldErrors
                    ?.roomId,
                )}
                placeholder="Select a room"
              />

              {state.fieldErrors?.roomId && (
                <p
                  className="text-sm text-destructive"
                  id="roomId-error"
                >
                  {
                    state.fieldErrors
                      .roomId[0]
                  }
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Check-in */}
              <div className="space-y-2">
                <Label htmlFor="checkIn">
                  Check-in{" "}
                  <span className="text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(event) =>
                    setCheckIn(
                      event.target.value,
                    )
                  }
                  aria-invalid={Boolean(
                    state.fieldErrors
                      ?.checkIn,
                  )}
                  className={
                    state.fieldErrors
                      ?.checkIn
                      ? "border-destructive"
                      : ""
                  }
                  required
                />

                {state.fieldErrors?.checkIn && (
                  <p
                    className="text-sm text-destructive"
                    id="checkIn-error"
                  >
                    {
                      state.fieldErrors
                        .checkIn[0]
                    }
                  </p>
                )}
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <Label htmlFor="checkOut">
                  Check-out{" "}
                  <span className="text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(event) =>
                    setCheckOut(
                      event.target.value,
                    )
                  }
                  aria-invalid={Boolean(
                    state.fieldErrors
                      ?.checkOut,
                  )}
                  className={
                    state.fieldErrors
                      ?.checkOut
                      ? "border-destructive"
                      : ""
                  }
                  required
                />

                {state.fieldErrors?.checkOut && (
                  <p
                    className="text-sm text-destructive"
                    id="checkOut-error"
                  >
                    {
                      state.fieldErrors
                        .checkOut[0]
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Guests count */}
            <div className="space-y-2">
              <Label htmlFor="guestsCount">
                Number of guests{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <Input
                id="guestsCount"
                name="guestsCount"
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={guestsCount}
                onChange={(event) =>
                  setGuestsCount(
                    event.target.value,
                  )
                }
                aria-invalid={Boolean(
                  state.fieldErrors
                    ?.guestsCount,
                )}
                className={
                  state.fieldErrors
                    ?.guestsCount
                    ? "border-destructive"
                    : ""
                }
                required
              />

              {state.fieldErrors
                ?.guestsCount && (
                <p
                  className="text-sm text-destructive"
                  id="guestsCount-error"
                >
                  {
                    state.fieldErrors
                      .guestsCount[0]
                  }
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Status{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <input
                type="hidden"
                name="status"
                value={status}
              />

              <StatusSelect
                value={status}
                onValueChange={setStatus}
                allowedStatuses={[
                  "PENDING",
                  "CONFIRMED",
                ]}
                disabled={isPending}
                hasError={Boolean(
                  state.fieldErrors
                    ?.status,
                )}
              />

              {state.fieldErrors?.status && (
                <p
                  className="text-sm text-destructive"
                  id="status-error"
                >
                  {
                    state.fieldErrors
                      .status[0]
                  }
                </p>
              )}
            </div>

            {/* Estimated total */}
            <div className="rounded-2xl border border-white/10 bg-white/2 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated total
                  </p>

                  {estimatedTotal && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        estimatedTotal.nights
                      }{" "}
                      {estimatedTotal.nights ===
                      1
                        ? "night"
                        : "nights"}{" "}
                      × selected room rate
                    </p>
                  )}
                </div>

                <span className="text-base font-semibold tabular-nums">
                  {estimatedTotal
                    ? `€${estimatedTotal.total.toFixed(
                        2,
                      )}`
                    : "Select room and dates"}
                </span>
              </div>
            </div>

            {/* General error */}
            {!state.success &&
              state.message &&
              !state.fieldErrors && (
                <p className="text-xs leading-5 text-destructive">
                  {state.message}
                </p>
              )}
          </fieldset>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isPending || !canSubmit
              }
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus />
                  Create Reservation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}