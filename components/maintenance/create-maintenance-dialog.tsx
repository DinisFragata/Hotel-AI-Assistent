"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createMaintenance } from "@/app/(dashboard)/maintenance/actions";

import type { CreateMaintenanceState } from "@/lib/maintenance/schemas";

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

import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import RoomSelect from "@/components/maintenance/room-select";
import UserSelect from "@/components/maintenance/user-select";
import PrioritySelect from "@/components/maintenance/priority-select";

import type { MaintenancePriority } from "@/app/generated/prisma/client";

const initialState: CreateMaintenanceState = {
  success: false,
  message: "",
};

type RoomOption = {
  id: string;
  number: string;
  capacity: number;
  pricePerNight: string;
};

type UserOption = {
  id: string;
  name: string;
};

type CreateMaintenanceDialogProps = {
  rooms: RoomOption[];
  users: UserOption[];
};

export default function CreateMaintenanceDialog({
  rooms,
  users,
}: CreateMaintenanceDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [priority, setPriority] =
    useState<MaintenancePriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [selectedAssignedToId, setSelectedAssignedToId] =
    useState("");

  const [state, formAction, isPending] = useActionState(
    createMaintenance,
    initialState,
  );

  const canSubmit =
    Boolean(title.trim()) &&
    Boolean(priority);

  const today = new Date();
  const minimumDate =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`;

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.refresh();

      const timeout = window.setTimeout(() => {
        setOpen(false);
        setTitle("");
        setDescription("");
        setSelectedRoomId("");
        setPriority("MEDIUM");
        setDueDate("");
        setSelectedAssignedToId("");
      }, 0);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    if (!state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Add Maintenance
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Maintenance Request</DialogTitle>

          <DialogDescription>
            Create a maintenance request and optionally assign it
            to a room and team member.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-6">
          <fieldset
            disabled={isPending}
            className="space-y-5"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title{" "}
                <span className="text-destructive">*</span>
              </Label>

              <Input
                id="title"
                name="title"
                placeholder="e.g. Air conditioning inspection"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                aria-invalid={Boolean(
                  state.fieldErrors?.title,
                )}
                className={
                  state.fieldErrors?.title
                    ? "border-destructive"
                    : ""
                }
                maxLength={120}
                required
              />

              {state.fieldErrors?.title && (
                <p
                  className="text-sm text-destructive"
                  id="title-error"
                >
                  {state.fieldErrors.title[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the issue..."
                maxLength={500}
                rows={4}
                aria-invalid={Boolean(
                  state.fieldErrors?.description,
                )}
                className={[
                  "flex w-full rounded-xl border bg-background/40 px-3 py-2",
                  "text-sm shadow-xs outline-none",
                  "placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "resize-none",
                  state.fieldErrors?.description &&
                    "border-destructive",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />

              {state.fieldErrors?.description && (
                <p
                  className="text-sm text-destructive"
                  id="description-error"
                >
                  {state.fieldErrors.description[0]}
                </p>
              )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="roomId">
                Room
              </Label>

              <input
                type="hidden"
                name="roomId"
                value={selectedRoomId}
              />

              <RoomSelect
                rooms={rooms}
                value={selectedRoomId}
                onValueChange={setSelectedRoomId}
                disabled={isPending}
                hasError={Boolean(
                  state.fieldErrors?.roomId,
                )}
                placeholder="Select a room"
              />

              {state.fieldErrors?.roomId && (
                <p
                  className="text-sm text-destructive"
                  id="roomId-error"
                >
                  {state.fieldErrors.roomId[0]}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority{" "}
                <span className="text-destructive">*</span>
              </Label>

              <input
                type="hidden"
                name="priority"
                value={priority}
              />

              <PrioritySelect
                value={priority}
                onValueChange={setPriority}
                disabled={isPending}
                hasError={Boolean(
                  state.fieldErrors?.priority,
                )}
              />

              {state.fieldErrors?.priority && (
                <p
                  className="text-sm text-destructive"
                  id="priority-error"
                >
                  {state.fieldErrors.priority[0]}
                </p>
              )}
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date
              </Label>

              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                min={minimumDate}
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                aria-invalid={Boolean(
                  state.fieldErrors?.dueDate,
                )}
                className={
                  state.fieldErrors?.dueDate
                    ? "border-destructive"
                    : ""
                }
              />

              {state.fieldErrors?.dueDate && (
                <p
                  className="text-sm text-destructive"
                  id="dueDate-error"
                >
                  {state.fieldErrors.dueDate[0]}
                </p>
              )}
            </div>

            {/* Assigned to */}
            <div className="space-y-2">
              <Label htmlFor="assignedToId">
                Assigned To
              </Label>

              <input
                type="hidden"
                name="assignedToId"
                value={selectedAssignedToId}
              />

              <UserSelect
                users={users}
                value={selectedAssignedToId}
                onValueChange={setSelectedAssignedToId}
                disabled={isPending}
                hasError={Boolean(
                  state.fieldErrors?.assignedToId,
                )}
                placeholder="Select a team member"
              />

              {state.fieldErrors?.assignedToId && (
                <p
                  className="text-sm text-destructive"
                  id="assignedToId-error"
                >
                  {state.fieldErrors.assignedToId[0]}
                </p>
              )}
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
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending || !canSubmit}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus />
                  Create Maintenance
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}