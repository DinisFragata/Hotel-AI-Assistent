import type { MaintenanceStatus } from "@/app/generated/prisma/client";

export const maintenanceStatusConfig = {
  OPEN: {
    label: "Open",
    dot: "bg-yellow-300",
    className:
      "border-yellow-300/20 bg-yellow-300/8 text-yellow-300",
  },

  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-sky-300",
    className:
      "border-sky-300/20 bg-sky-300/8 text-sky-300 text-nowrap",
  },

  COMPLETED: {
    label: "Completed",
    dot: "bg-primary",
    className:
      "border-primary/20 bg-primary/8 text-primary",
  },
} satisfies Record<
  MaintenanceStatus,
  {
    label: string;
    dot: string;
    className: string;
  }
>;

export const maintenanceAllowedTransitions: Record<
  MaintenanceStatus,
  MaintenanceStatus[]
> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: ["OPEN"],
};

export function isValidMaintenanceStatusTransition(
  currentStatus: MaintenanceStatus,
  nextStatus: MaintenanceStatus,
) {
  return maintenanceAllowedTransitions[
    currentStatus
  ].includes(nextStatus);
}