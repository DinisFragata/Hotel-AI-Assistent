"use server";

import { revalidatePath } from "next/cache";

import { MaintenanceHistoryType, MaintenancePriority, MaintenanceStatus,} from "@/app/generated/prisma/client";
import { isValidMaintenanceStatusTransition,} from "@/lib/maintenance/status";

import { prisma } from "@/lib/prisma";

import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  type CreateMaintenanceState,
  type UpdateMaintenanceState,
} from "@/lib/maintenance/schemas";



export async function createMaintenance(
  _previousState: CreateMaintenanceState,
  formData: FormData,
): Promise<CreateMaintenanceState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    roomId: formData.get("roomId"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    assignedToId: formData.get("assignedToId"),
  };

  const parsed = createMaintenanceSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (
    typeof rawData.roomId !== "string" ||
    typeof rawData.assignedToId !== "string" ||
    typeof rawData.dueDate !== "string"
  ) {
    return {
      success: false,
      message: "Invalid maintenance data.",
    };
  }

  try {
    const room =
      data.roomId === ""
        ? null
        : await prisma.room.findUnique({
            where: {
              id: data.roomId,
            },
            select: {
              id: true,
              number: true,
            },
          });

    if (data.roomId !== "" && !room) {
      return {
        success: false,
        message: "The selected room could not be found.",
        fieldErrors: {
          roomId: ["The selected room is no longer available."],
        },
      };
    }

    const assignedUser =
      data.assignedToId === ""
        ? null
        : await prisma.user.findUnique({
            where: {
              id: data.assignedToId,
            },
            select: {
              id: true,
              name: true,
            },
          });

    if (data.assignedToId !== "" && !assignedUser) {
      return {
        success: false,
        message: "The selected user could not be found.",
        fieldErrors: {
          assignedToId: ["The selected user is no longer available."],
        },
      };
    }

    let dueDate: Date | null = null;

    if (data.dueDate !== "") {
      const parsedDate = new Date(`${data.dueDate}T00:00:00`);

      if (Number.isNaN(parsedDate.getTime())) {
        return {
          success: false,
          message: "Please correct the highlighted fields.",
          fieldErrors: {
            dueDate: ["Please enter a valid date."],
          },
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (parsedDate < today) {
        return {
          success: false,
          message: "Please correct the highlighted fields.",
          fieldErrors: {
            dueDate: ["Due date cannot be in the past."],
          },
        };
      }

      dueDate = parsedDate;
    }

    const maintenance = await prisma.$transaction(async (tx) => {
      const createdMaintenance = await tx.maintenance.create({
        data: {
          title: data.title,
          description:
            data.description === ""
              ? null
              : data.description,
          priority: data.priority as MaintenancePriority,
          dueDate,
          roomId: room?.id ?? null,
          assignedToId: assignedUser?.id ?? null,
        },
      });

      await tx.maintenanceHistory.create({
        data: {
          type: MaintenanceHistoryType.CREATED,
          description: "Maintenance request created.",
          maintenanceId: createdMaintenance.id,
        },
      });

      if (assignedUser) {
        await tx.maintenanceHistory.create({
          data: {
            type: MaintenanceHistoryType.ASSIGNED,
            description: `Maintenance request assigned to ${assignedUser.name}.`,
            maintenanceId: createdMaintenance.id,
          },
        });
      }

      return createdMaintenance;
    });

    revalidatePath("/maintenance");

    return {
      success: true,
      message: `"${maintenance.title}" was created successfully.`,
    };
  } catch (error) {
    console.error("Failed to create maintenance:", error);

    return {
      success: false,
      message:
        "Something went wrong while creating the maintenance request.",
    };
  }
}

export async function updateMaintenance(
  _previousState: UpdateMaintenanceState,
  formData: FormData,
): Promise<UpdateMaintenanceState> {
  const rawData = {
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    roomId: formData.get("roomId"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    assignedToId: formData.get("assignedToId"),
  };

  if (typeof rawData.id !== "string" || rawData.id.trim() === "") {
    return {
      success: false,
      message: "Invalid maintenance request.",
    };
  }

  const parsed = updateMaintenanceSchema.safeParse({
    title: rawData.title,
    description: rawData.description,
    roomId: rawData.roomId,
    priority: rawData.priority,
    dueDate: rawData.dueDate,
    assignedToId: rawData.assignedToId,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (
    typeof rawData.roomId !== "string" ||
    typeof rawData.assignedToId !== "string" ||
    typeof rawData.dueDate !== "string"
  ) {
    return {
      success: false,
      message: "Invalid maintenance data.",
    };
  }

  const data = parsed.data;

  try {
    const existingMaintenance =
      await prisma.maintenance.findUnique({
        where: {
          id: rawData.id,
        },
        include: {
          room: {
            select: {
              id: true,
              number: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    if (!existingMaintenance) {
      return {
        success: false,
        message:
          "The maintenance request could not be found.",
      };
    }

    const room =
      data.roomId === ""
        ? null
        : await prisma.room.findUnique({
            where: {
              id: data.roomId,
            },
            select: {
              id: true,
              number: true,
            },
          });

    if (data.roomId !== "" && !room) {
      return {
        success: false,
        message: "The selected room could not be found.",
        fieldErrors: {
          roomId: ["The selected room is no longer available."],
        },
      };
    }

    const assignedUser =
      data.assignedToId === ""
        ? null
        : await prisma.user.findUnique({
            where: {
              id: data.assignedToId,
            },
            select: {
              id: true,
              name: true,
            },
          });

    if (data.assignedToId !== "" && !assignedUser) {
      return {
        success: false,
        message: "The selected user could not be found.",
        fieldErrors: {
          assignedToId: ["The selected user is no longer available."],
        },
      };
    }

    let dueDate: Date | null = null;

    if (data.dueDate !== "") {
      const parsedDate = new Date(`${data.dueDate}T00:00:00`);

      if (Number.isNaN(parsedDate.getTime())) {
        return {
          success: false,
          message: "Please correct the highlighted fields.",
          fieldErrors: {
            dueDate: ["Please enter a valid date."],
          },
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        parsedDate < today &&
        existingMaintenance.status !== "COMPLETED"
      ) {
        return {
          success: false,
          message: "Please correct the highlighted fields.",
          fieldErrors: {
            dueDate: ["Due date cannot be in the past."],
          },
        };
      }

      dueDate = parsedDate;
    }

    const roomChanged =
      (existingMaintenance.room?.id ?? null) !==
      (room?.id ?? null);

    const assignmentChanged =
      (existingMaintenance.assignedTo?.id ?? null) !==
      (assignedUser?.id ?? null);

    const priorityChanged =
      existingMaintenance.priority !== data.priority;

    const oldDueDate = existingMaintenance.dueDate
      ? existingMaintenance.dueDate.toISOString().slice(0, 10)
      : "";

    const newDueDate = dueDate
      ? dueDate.toISOString().slice(0, 10)
      : "";

    const dueDateChanged =
      oldDueDate !== newDueDate;

    const basicFieldsChanged =
      existingMaintenance.title !== data.title ||
      (existingMaintenance.description ?? "") !==
        data.description ||
      roomChanged;

    await prisma.$transaction(async (tx) => {
      await tx.maintenance.update({
        where: {
          id: existingMaintenance.id,
        },
        data: {
          title: data.title,
          description:
            data.description === ""
              ? null
              : data.description,
          roomId: room?.id ?? null,
          priority: data.priority as MaintenancePriority,
          dueDate,
          assignedToId: assignedUser?.id ?? null,
        },
      });

      if (basicFieldsChanged) {
        await tx.maintenanceHistory.create({
          data: {
            type: MaintenanceHistoryType.UPDATED,
            description:
              "Maintenance request details were updated.",
            maintenanceId: existingMaintenance.id,
          },
        });
      }

      if (assignmentChanged) {
        if (assignedUser) {
          await tx.maintenanceHistory.create({
            data: {
              type: MaintenanceHistoryType.ASSIGNED,
              description: `Maintenance request assigned to ${assignedUser.name}.`,
              maintenanceId: existingMaintenance.id,
            },
          });
        } else {
          await tx.maintenanceHistory.create({
            data: {
              type: MaintenanceHistoryType.UNASSIGNED,
              description:
                "Maintenance request was unassigned.",
              maintenanceId: existingMaintenance.id,
            },
          });
        }
      }

      if (priorityChanged) {
        await tx.maintenanceHistory.create({
          data: {
            type: MaintenanceHistoryType.PRIORITY_CHANGED,
            description: `Priority changed from ${existingMaintenance.priority.toLowerCase()} to ${data.priority.toLowerCase()}.`,
            maintenanceId: existingMaintenance.id,
          },
        });
      }

      if (dueDateChanged) {
        await tx.maintenanceHistory.create({
          data: {
            type: MaintenanceHistoryType.DUE_DATE_CHANGED,
            description: dueDate
              ? `Due date changed to ${newDueDate}.`
              : "Due date was removed.",
            maintenanceId: existingMaintenance.id,
          },
        });
      }
    });

    revalidatePath("/maintenance");

    return {
      success: true,
      message: `"${data.title}" was updated successfully.`,
    };
  } catch (error) {
    console.error("Failed to update maintenance:", error);

    return {
      success: false,
      message:
        "Something went wrong while updating the maintenance request.",
    };
  }
}

export type UpdateMaintenanceStatusState = {
  success: boolean;
  message: string;
};

export async function updateMaintenanceStatus(
  _previousState: UpdateMaintenanceStatusState,
  formData: FormData,
): Promise<UpdateMaintenanceStatusState> {
  const maintenanceId = formData.get("id");
  const nextStatus = formData.get("status");

  if (
    typeof maintenanceId !== "string" ||
    maintenanceId.trim() === ""
  ) {
    return {
      success: false,
      message: "Invalid maintenance request.",
    };
  }

  if (
    typeof nextStatus !== "string" ||
    !["OPEN", "IN_PROGRESS", "COMPLETED"].includes(
      nextStatus,
    )
  ) {
    return {
      success: false,
      message: "Invalid maintenance status.",
    };
  }

  const parsedNextStatus =
    nextStatus as MaintenanceStatus;

  try {
    const maintenance =
      await prisma.maintenance.findUnique({
        where: {
          id: maintenanceId,
        },
        select: {
          id: true,
          title: true,
          status: true,
        },
      });

    if (!maintenance) {
      return {
        success: false,
        message:
          "The maintenance request could not be found.",
      };
    }

    if (
      !isValidMaintenanceStatusTransition(
        maintenance.status,
        parsedNextStatus,
      )
    ) {
      return {
        success: false,
        message: `Cannot change status from ${maintenance.status
          .toLowerCase()
          .replace("_", " ")} to ${parsedNextStatus
          .toLowerCase()
          .replace("_", " ")}.`,
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.maintenance.update({
        where: {
          id: maintenance.id,
        },
        data: {
          status: parsedNextStatus,
          completedAt:
            parsedNextStatus === "COMPLETED"
              ? new Date()
              : null,
        },
      });

      await tx.maintenanceHistory.create({
        data: {
          type: MaintenanceHistoryType.STATUS_CHANGED,
          description: `Status changed from ${maintenance.status
            .toLowerCase()
            .replace("_", " ")} to ${parsedNextStatus
            .toLowerCase()
            .replace("_", " ")}.`,
          maintenanceId: maintenance.id,
        },
      });
    });

    revalidatePath("/maintenance");

    return {
      success: true,
      message: `"${maintenance.title}" status was updated.`,
    };
  } catch (error) {
    console.error(
      "Failed to update maintenance status:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while updating the maintenance status.",
    };
  }
}