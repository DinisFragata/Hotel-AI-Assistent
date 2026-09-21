import type {
  MaintenanceHistoryType,
  MaintenancePriority,
  MaintenanceStatus,
} from "@/app/generated/prisma/client";

import MaintenanceStatusBadge from "@/components/maintenance/maintenance-status-badge";
import MaintenancePriorityBadge from "@/components/maintenance/maintenance-priority-badge";
import MaintenanceHistoryDialog from "@/components/maintenance/maintenance-history-dialog";
import EditMaintenanceDialog from "./edit-maintenance-dialog";
import MaintenanceStatusActions from "./maintenance-status-actions";

import {
  formatMaintenanceDueDate,
  getMaintenanceDueDateLabel,
  getMaintenanceDueDateState,
} from "@/lib/maintenance/due-date";

type MaintenanceCardData = {
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

type MaintenanceCardProps = {
  maintenance: MaintenanceCardData;
  rooms: RoomOption[];
  users: UserOption[];
};

export default function MaintenanceCard({
  maintenance,
  rooms,
  users,
}: MaintenanceCardProps) {
  const dueState = getMaintenanceDueDateState(
    maintenance.dueDate,
    maintenance.status === "COMPLETED",
  );

  const dueLabel =
    getMaintenanceDueDateLabel(dueState);

  return (
    <article className="px-4 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium">
            {maintenance.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {maintenance.room
              ? `Room ${maintenance.room.number}`
              : "No room assigned"}
          </p>
        </div>

        <MaintenanceStatusBadge
          status={maintenance.status}
        />
      </div>

      {maintenance.description && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {maintenance.description}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Priority
          </p>

          <div className="mt-1">
            <MaintenancePriorityBadge
              priority={maintenance.priority}
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Assigned To
          </p>

          <p className="mt-1 text-sm">
            {maintenance.assignedTo?.name ??
              "Unassigned"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Due Date
        </p>

        <p
          className={[
            "mt-1 text-sm",
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

          {maintenance.dueDate
            ? formatMaintenanceDueDate(
                maintenance.dueDate,
              )
            : "No due date"}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <MaintenanceHistoryDialog
          title={maintenance.title}
          history={maintenance.history}
        />

        <EditMaintenanceDialog
          maintenance={maintenance}
          rooms={rooms}
          users={users}
        />

        <MaintenanceStatusActions
          maintenanceId={maintenance.id}
          status={maintenance.status}
        />
      </div>
    </article>
  );
}