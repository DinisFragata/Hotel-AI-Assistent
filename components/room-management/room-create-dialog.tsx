"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createRoom,
  type CreateRoomState,
} from "@/app/(dashboard)/room-management/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

const initialState: CreateRoomState = {
  success: false,
  message: "",
};

export default function RoomCreateDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createRoom,
    initialState,
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
      <DialogTrigger render={<Button />}>Add Room</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>

          <DialogDescription>
            Create a new hotel room and add it to the system.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="number">Room number</Label>

            <Input id="number" name="number" placeholder="e.g. 204" required />

            {state.fieldErrors?.number && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.number[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>

            <Input id="floor" name="floor" type="number" placeholder="e.g. 2" />

            {state.fieldErrors?.floor && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.floor[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>

            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g. 2"
              required
            />

            {state.fieldErrors?.capacity && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.capacity[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price per night</Label>

            <Input
              id="pricePerNight"
              name="pricePerNight"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 120.00"
              required
            />

            {state.fieldErrors?.pricePerNight && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.pricePerNight[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>

            <Select name="status" defaultValue="AVAILABLE">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="CLEANING">Cleaning</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="OUT_OF_ORDER">Out of Order</SelectItem>
              </SelectContent>
            </Select>

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
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
