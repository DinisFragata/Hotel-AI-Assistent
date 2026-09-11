"use client";

import { useState } from "react";

import type {
  MaintenanceHistoryType,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/app/generated/prisma/client";

import MaintenanceDetailsDialog from "@/components/maintenance/maintenance-details-dialog";
import MaintenancePriorityBadge from "@/components/maintenance/maintenance-priority-badge";
import MaintenanceStatusBadge from "@/components/maintenance/maintenance-status-badge";

import {
  formatMaintenanceDueDate,
  getMaintenanceDueDateLabel,
  getMaintenanceDueDateState,
} from "@/lib/maintenance/due-date";

type MaintenanceRowProps = {
  maintenance: {
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

    history: {
      id: string;
      type: MaintenanceHistoryType;
      description: string;
      createdAt: Date;
      user: {
        name: string;
      } | null;
    }[];
  };

  rooms: {
    id: string;
    number: string;
    capacity: number;
    pricePerNight: string;
  }[];

  users: {
    id: string;
    name: string;
  }[];
};

export default function MaintenanceRow({
  maintenance,
  rooms,
  users,
}: MaintenanceRowProps) {
  const [open, setOpen] = useState(false);

  const dueState = getMaintenanceDueDateState(
    maintenance.dueDate,
    maintenance.status === "COMPLETED",
  );

  const dueLabel =
    getMaintenanceDueDateLabel(dueState);

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <>
      <tr
        tabIndex={0}
        role="button"
        aria-label={`View details for ${maintenance.title}`}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={[
          "cursor-pointer border-b border-white/10",
          "transition-colors duration-150",
          "last:border-0 hover:bg-white/2.5",
          "focus:outline-none focus:bg-white/4",
        ].join(" ")}
      >
        {/* Issue */}
        <td className="px-6 py-4 align-middle">
          <div className="min-w-0">
            <p className="truncate font-medium">
              {maintenance.title}
            </p>

            {maintenance.description && (
              <p className="mt-1 max-w-xl truncate text-sm text-muted-foreground">
                {maintenance.description}
              </p>
            )}
          </div>
        </td>

        {/* Room */}
        <td className="whitespace-nowrap px-4 py-4 align-middle text-muted-foreground">
          {maintenance.room
            ? `Room ${maintenance.room.number}`
            : "—"}
        </td>

        {/* Priority */}
        <td className="px-4 py-4 align-middle">
          <MaintenancePriorityBadge
            priority={maintenance.priority}
          />
        </td>

        {/* Assigned To */}
        <td className="px-4 py-4 align-middle">
          <span className="block truncate text-muted-foreground">
            {maintenance.assignedTo?.name ??
              "Unassigned"}
          </span>
        </td>

        {/* Due Date */}
        <td className="whitespace-nowrap px-4 py-4 align-middle">
          <span
            className={[
              dueState === "OVERDUE" &&
                "font-medium text-destructive",
              dueState === "DUE_TODAY" &&
                "font-medium text-yellow-300",
              dueState === "DUE_SOON" &&
                "font-medium text-secondary",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {dueLabel
              ? `${dueLabel} · `
              : ""}

            {formatMaintenanceDueDate(
              maintenance.dueDate,
            )}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-4 align-middle">
          <MaintenanceStatusBadge
            status={maintenance.status}
          />
        </td>
      </tr>

      <MaintenanceDetailsDialog
        maintenance={maintenance}
        rooms={rooms}
        users={users}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}