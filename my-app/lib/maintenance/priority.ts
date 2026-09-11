import type { MaintenancePriority } from "@/app/generated/prisma/client";

export const maintenancePriorityConfig = {
  URGENT: {
    label: "Urgent",
    dot: "bg-destructive",
    className:
      "border-destructive/20 bg-destructive/8 text-destructive",
  },

  HIGH: {
    label: "High",
    dot: "bg-yellow-300",
    className:
      "border-yellow-300/20 bg-yellow-300/8 text-yellow-300",
  },

  MEDIUM: {
    label: "Medium",
    dot: "bg-secondary",
    className:
      "border-secondary/20 bg-secondary/8 text-secondary",
  },

  LOW: {
    label: "Low",
    dot: "bg-muted-foreground",
    className:
      "border-border/60 bg-muted/30 text-muted-foreground",
  },
} satisfies Record<
  MaintenancePriority,
  {
    label: string;
    dot: string;
    className: string;
  }
>;

export const maintenancePriorityOrder: MaintenancePriority[] = [
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
];