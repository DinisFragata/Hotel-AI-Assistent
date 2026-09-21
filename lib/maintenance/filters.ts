import type {
  MaintenancePriority,
  MaintenanceStatus,
  Prisma,
} from "@/app/generated/prisma/client";

const validStatuses: MaintenanceStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
];

const validPriorities: MaintenancePriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export type MaintenanceSearchParams = {
  search: string;
  status: MaintenanceStatus | null;
  priority: MaintenancePriority | null;
  assignedToId: string;
};

export function parseMaintenanceSearchParams(
  params: Record<
    string,
    string | string[] | undefined
  >,
): MaintenanceSearchParams {
  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : "";

  const status =
    typeof params.status === "string" &&
    validStatuses.includes(
      params.status as MaintenanceStatus,
    )
      ? (params.status as MaintenanceStatus)
      : null;

  const priority =
    typeof params.priority === "string" &&
    validPriorities.includes(
      params.priority as MaintenancePriority,
    )
      ? (params.priority as MaintenancePriority)
      : null;

  const assignedToId =
    typeof params.assignedToId === "string"
      ? params.assignedToId.trim()
      : "";

  return {
    search,
    status,
    priority,
    assignedToId,
  };
}

export function getMaintenanceFilters({
  search,
  status,
  priority,
  assignedToId,
}: MaintenanceSearchParams): Prisma.MaintenanceWhereInput {
  const where: Prisma.MaintenanceWhereInput = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        room: {
          number: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        assignedTo: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

if (assignedToId === "unassigned") {
  where.assignedToId = null;
} else if (assignedToId?.trim()) {
  where.assignedToId = assignedToId;
}

  return where;
}