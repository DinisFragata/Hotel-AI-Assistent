"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteRoom,
  type DeleteRoomState,
} from "@/app/(dashboard)/room-management/actions";

import { Trash2 } from "lucide-react";
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

import { toast } from "sonner";

type RoomDeleteDialogProps = {
  roomId: string;
  roomNumber: string;
};

const initialState: DeleteRoomState = {
  success: false,
  message: "",
};

export default function RoomDeleteDialog({
  roomId,
  roomNumber,
}: RoomDeleteDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    deleteRoom,
    initialState,
  );

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="group h-8 rounded-lg px-2.5 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Room {roomNumber}?</DialogTitle>

          <DialogDescription>
            This action cannot be undone. The room will be permanently removed
            from the system if it has no associated records.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <input type="hidden" name="id" value={roomId} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
