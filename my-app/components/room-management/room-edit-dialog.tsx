"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  updateRoom,
  type CreateRoomState,
} from "@/app/(dashboard)/room-management/actions";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";

import type { RoomStatus } from "@/app/generated/prisma/client";

type Room = {
  id: string;
  number: string;
  floor: number | null;
  capacity: number;
  pricePerNight: string;
  status: RoomStatus;
};

type RoomEditDialogProps = {
  room: Room;
};

const initialState: CreateRoomState = {
  success: false,
  message: "",
};

export default function RoomEditDialog({ room }: RoomEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="group h-8 rounded-lg px-2.5 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
          />
        }
      >
        <Pencil className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
        <span>Edit</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>

          <DialogDescription>
            Update the information and current status of room {room.number}.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <RoomEditForm
            key={room.id}
            room={room}
            initialState={initialState}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RoomEditForm({
  room,
  initialState,
  onCancel,
}: {
  room: Room;
  initialState: CreateRoomState;
  onCancel: () => void;
}) {
  const router = useRouter();

  const [number, setNumber] = useState(room.number);
  const [floor, setFloor] = useState(
    room.floor !== null ? String(room.floor) : "",
  );
  const [capacity, setCapacity] = useState(String(room.capacity));
  const [pricePerNight, setPricePerNight] = useState(
    room.pricePerNight,
  );
  const [status, setStatus] = useState<RoomStatus>(room.status);

  const [state, formAction, isPending] = useActionState(
    updateRoom,
    initialState,
  );

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.refresh();
      onCancel();
    } else if (!state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state, router, onCancel]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={room.id} />

      <div className="space-y-2">
        <label htmlFor={`number-${room.id}`} className="text-sm font-medium">
          Room number
        </label>

        <input
          id={`number-${room.id}`}
          name="number"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          required
        />

        {state.fieldErrors?.number && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.number[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`floor-${room.id}`} className="text-sm font-medium">
          Floor
        </label>

        <input
          id={`floor-${room.id}`}
          name="floor"
          type="number"
          value={floor}
          onChange={(event) => setFloor(event.target.value)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
        />

        {state.fieldErrors?.floor && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.floor[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`capacity-${room.id}`} className="text-sm font-medium">
          Capacity
        </label>

        <input
          id={`capacity-${room.id}`}
          name="capacity"
          type="number"
          min="1"
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          required
        />

        {state.fieldErrors?.capacity && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.capacity[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`price-${room.id}`} className="text-sm font-medium">
          Price per night
        </label>

        <input
          id={`price-${room.id}`}
          name="pricePerNight"
          type="number"
          min="0"
          step="0.01"
          value={pricePerNight}
          onChange={(event) => setPricePerNight(event.target.value)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          required
        />

        {state.fieldErrors?.pricePerNight && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.pricePerNight[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`status-${room.id}`} className="text-sm font-medium">
          Status
        </label>

        <select
          id={`status-${room.id}`}
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as RoomStatus)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
        >
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="CLEANING">Cleaning</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OUT_OF_ORDER">Out of Order</option>
        </select>

        {state.fieldErrors?.status && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.status[0]}
          </p>
        )}
      </div>

      {!state.success && state.message && !state.fieldErrors && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
