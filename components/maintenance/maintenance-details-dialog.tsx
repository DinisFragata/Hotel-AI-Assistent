"use client";

import { useState } from "react";

import {
  Calendar,
  Clock3,
  History,
  UserRound,
  Wrench,
} from "lucide-react";

import type {
  MaintenanceHistoryType,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/app/generated/prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import MaintenancePriorityBadge from "@/components/maintenance/maintenance-priority-badge";
import MaintenanceStatusBadge from "@/components/maintenance/maintenance-status-badge";
import MaintenanceStatusActions from "@/components/maintenance/maintenance-status-actions";
import EditMaintenanceDialog from "@/components/maintenance/edit-maintenance-dialog";

import {
  formatMaintenanceDueDate,
  getMaintenanceDueDateLabel,
  getMaintenanceDueDateState,
} from "@/lib/maintenance/due-date";

type MaintenanceHistoryItem = {
  id: string;
  type: MaintenanceHistoryType;
  description: string;
  createdAt: Date;
  user: {
    name: string;
  } | null;
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

type MaintenanceDetails = {
  id: string;
  title: string;
  description: string | null;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  dueDate: Date | null;

  room: {
    id: string;
    number: string;
  } | null;

  assignedTo: {
    id: string;
    name: string;
  } | null;

  history: MaintenanceHistoryItem[];
};

type MaintenanceDetailsDialogProps = {
  maintenance: MaintenanceDetails;
  rooms: RoomOption[];
  users: UserOption[];
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const historyTypeLabel: Record<
  MaintenanceHistoryType,
  string
> = {
  CREATED: "Created",
  UPDATED: "Updated",
  ASSIGNED: "Assigned",
  UNASSIGNED: "Unassigned",
  STATUS_CHANGED: "Status changed",
  PRIORITY_CHANGED: "Priority changed",
  DUE_DATE_CHANGED: "Due date changed",
  COMPLETED: "Completed",
};

function formatHistoryTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatHistoryDay(date: Date) {
  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (
    eventDate.getTime() ===
    yesterday.getTime()
  ) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function MaintenanceDetailsDialog({
  maintenance,
  rooms,
  users,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: MaintenanceDetailsDialogProps) {
  const [internalOpen, setInternalOpen] =
    useState(false);

  const isControlled =
    controlledOpen !== undefined;

  const open = isControlled
    ? controlledOpen
    : internalOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  const dueState = getMaintenanceDueDateState(
    maintenance.dueDate,
    maintenance.status === "COMPLETED",
  );

  const dueLabel =
    getMaintenanceDueDateLabel(dueState);

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      {trigger && (
        <DialogTrigger render={trigger} />
      )}

      <DialogContent className="w-[calc(100%-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto px-5 pb-6 pt-5 sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:px-7 sm:pb-8 sm:pt-6 lg:max-w-5xl">
        <DialogHeader className="pr-10">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Wrench className="size-4" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Maintenance Request
            </span>
          </div>

          <DialogTitle className="mt-3 text-2xl tracking-[-0.03em] sm:text-3xl">
            {maintenance.title}
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-2xl text-sm leading-6">
            Review the request, manage its status and inspect its activity.
          </DialogDescription>

          <div className="flex flex-wrap items-center gap-2 pt-4">
            <MaintenanceStatusBadge
              status={maintenance.status}
            />

            <MaintenancePriorityBadge
              priority={maintenance.priority}
            />
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-8">
          {/* Primary actions */}
          <section className="rounded-2xl border border-primary/15 bg-primary/4 p-4 sm:p-5">
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Actions
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage the request or update its current state.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <MaintenanceStatusActions
                maintenanceId={maintenance.id}
                status={maintenance.status}
              />

              <EditMaintenanceDialog
                maintenance={maintenance}
                rooms={rooms}
                users={users}
              />
            </div>
          </section>

          {/* Overview */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="size-4 text-primary" />

              <h2 className="text-sm font-semibold">
                Overview
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wrench className="size-4" />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Room
                  </p>
                </div>

                <p className="mt-3 text-sm font-medium">
                  {maintenance.room
                    ? `Room ${maintenance.room.number}`
                    : "No room assigned"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Assigned To
                  </p>
                </div>

                <p className="mt-3 text-sm font-medium">
                  {maintenance.assignedTo?.name ??
                    "Unassigned"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Due Date
                  </p>
                </div>

                <p
                  className={[
                    "mt-3 text-sm font-medium",
                    dueState === "OVERDUE" &&
                      "text-destructive",
                    dueState === "DUE_TODAY" &&
                      "text-yellow-300",
                    dueState === "DUE_SOON" &&
                      "text-secondary",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {dueLabel
                    ? `${dueLabel} · `
                    : ""}

                  {maintenance.dueDate
                    ? formatMaintenanceDueDate(
                        maintenance.dueDate,
                      )
                    : "No due date"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Status
                  </p>
                </div>

                <div className="mt-3">
                  <MaintenanceStatusBadge
                    status={maintenance.status}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="text-sm font-semibold">
              Description
            </h2>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/2 px-4 py-5 sm:px-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {maintenance.description ??
                  "No description provided."}
              </p>
            </div>
          </section>

          {/* Activity */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <History className="size-4 text-primary" />

              <h2 className="text-sm font-semibold">
                Activity
              </h2>

              <span className="text-xs text-muted-foreground">
                {maintenance.history.length}{" "}
                {maintenance.history.length === 1
                  ? "event"
                  : "events"}
              </span>
            </div>

            {maintenance.history.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/2 px-4 py-10 text-center">
                <History className="mx-auto size-5 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  No activity yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Changes to this request will appear here.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4 sm:p-5">
                <div className="relative">
                  <div className="absolute bottom-2 left-1.75 top-2 w-px bg-border" />

                  <div className="space-y-7">
                    {maintenance.history.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="relative flex gap-4"
                        >
                          <div className="relative z-10 mt-1.5 size-3.75 shrink-0 rounded-full border-2 border-primary bg-background" />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <p className="text-sm font-medium">
                                {historyTypeLabel[item.type]}
                              </p>

                              <span className="text-xs text-muted-foreground">
                                {formatHistoryDay(
                                  item.createdAt,
                                )}{" "}
                                ·{" "}
                                {formatHistoryTime(
                                  item.createdAt,
                                )}
                              </span>
                            </div>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {item.description}
                            </p>

                            {item.user && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                By {item.user.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}