"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  updateMaintenance,
} from "@/app/(dashboard)/maintenance/actions";

import type { UpdateMaintenanceState } from "@/lib/maintenance/schemas";

import type {
  MaintenancePriority,
  MaintenanceStatus,
} from "@/app/generated/prisma/client";

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
  LoaderCircle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import RoomSelect from "@/components/maintenance/room-select";
import UserSelect from "@/components/maintenance/user-select";
import PrioritySelect from "@/components/maintenance/priority-select";

const initialState: UpdateMaintenanceState = {
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

type MaintenanceData = {
  id: string;
  title: string;
  description: string | null;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  dueDate: Date | null;
  room: {
    id: string;
  } | null;
  assignedTo: {
    id: string;
  } | null;
};

type EditMaintenanceDialogProps = {
  maintenance: MaintenanceData;
  rooms: RoomOption[];
  users: UserOption[];
};

function formatDateForInput(date: Date | null) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EditMaintenanceDialog({
  maintenance,
  rooms,
  users,
}: EditMaintenanceDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(maintenance.title);
  const [description, setDescription] = useState(
    maintenance.description ?? "",
  );
  const [selectedRoomId, setSelectedRoomId] = useState(
    maintenance.room?.id ?? "",
  );
  const [priority, setPriority] = useState<MaintenancePriority>(
    maintenance.priority,
  );
  const [dueDate, setDueDate] = useState(
    formatDateForInput(maintenance.dueDate),
  );
  const [selectedAssignedToId, setSelectedAssignedToId] =
    useState(
      maintenance.assignedTo?.id ?? "",
    );

  const [state, formAction, isPending] = useActionState(
    updateMaintenance,
    initialState,
  );

  const canSubmit = Boolean(title.trim());

  const minimumDate = useMemo(() => {
    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.refresh();

      const timeout = window.setTimeout(() => {
        setOpen(false);
      }, 0);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    if (!state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state, router]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setTitle(maintenance.title);
      setDescription(maintenance.description ?? "");
      setSelectedRoomId(maintenance.room?.id ?? "");
      setPriority(maintenance.priority);
      setDueDate(
        formatDateForInput(maintenance.dueDate),
      );
      setSelectedAssignedToId(
        maintenance.assignedTo?.id ?? "",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
          />
        }
      >
        <Pencil />
        Edit
      </DialogTrigger>

      <DialogContent
        forceRenderOverlay
        className="w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>
            Edit Maintenance Request
          </DialogTitle>

          <DialogDescription>
            Update the maintenance request details.
          </DialogDescription>
        </DialogHeader>

        <form
          action={formAction}
          className="space-y-6"
        >
          <input
            type="hidden"
            name="id"
            value={maintenance.id}
          />

          <fieldset
            disabled={isPending}
            className="space-y-5"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor={`title-${maintenance.id}`}>
                Title{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <Input
                id={`title-${maintenance.id}`}
                name="title"
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
                <p className="text-sm text-destructive">
                  {state.fieldErrors.title[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor={`description-${maintenance.id}`}>
                Description
              </Label>

              <textarea
                id={`description-${maintenance.id}`}
                name="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                maxLength={500}
                rows={4}
                aria-invalid={Boolean(
                  state.fieldErrors?.description,
                )}
                className={[
                  "flex w-full resize-none rounded-xl border bg-background/40 px-3 py-2",
                  "text-sm shadow-xs outline-none",
                  "placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  state.fieldErrors?.description &&
                    "border-destructive",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />

              {state.fieldErrors?.description && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.description[0]}
                </p>
              )}
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor={`room-${maintenance.id}`}>
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
                <p className="text-sm text-destructive">
                  {state.fieldErrors.roomId[0]}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor={`priority-${maintenance.id}`}>
                Priority{" "}
                <span className="text-destructive">
                  *
                </span>
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
                <p className="text-sm text-destructive">
                  {state.fieldErrors.priority[0]}
                </p>
              )}
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <Label htmlFor={`dueDate-${maintenance.id}`}>
                Due Date
              </Label>

              <Input
                id={`dueDate-${maintenance.id}`}
                name="dueDate"
                type="date"
                min={
                  maintenance.status === "COMPLETED"
                    ? undefined
                    : minimumDate
                }
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
                <p className="text-sm text-destructive">
                  {state.fieldErrors.dueDate[0]}
                </p>
              )}
            </div>

            {/* Assigned to */}
            <div className="space-y-2">
              <Label htmlFor={`assignedTo-${maintenance.id}`}>
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
                <p className="text-sm text-destructive">
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
              disabled={
                isPending ||
                !canSubmit
              }
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