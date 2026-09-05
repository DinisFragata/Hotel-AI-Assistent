"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createRoomSchema = z.object({
  number: z
    .string()
    .trim()
    .min(1, "Room number is required.")
    .max(10, "Room number is too long."),

  floor: z
    .string()
    .trim()
    .refine((value) => value === "" || Number.isInteger(Number(value)), {
      message: "Floor must be a whole number.",
    }),

  capacity: z
    .string()
    .trim()
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, {
      message: "Capacity must be a positive whole number.",
    }),

  pricePerNight: z
    .string()
    .trim()
    .refine(
      (value) => value !== "" && !Number.isNaN(Number(value)) && Number(value) >= 0,
      {
        message: "Price must be a valid positive number.",
      },
    ),

  status: z.enum([
    "AVAILABLE",
    "OCCUPIED",
    "CLEANING",
    "MAINTENANCE",
    "OUT_OF_ORDER",
  ]),
});

export type CreateRoomState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    number?: string[];
    floor?: string[];
    capacity?: string[];
    pricePerNight?: string[];
    status?: string[];
  };
};

export async function createRoom(
  _previousState: CreateRoomState,
  formData: FormData,
): Promise<CreateRoomState> {
  const rawData = {
    number: formData.get("number"),
    floor: formData.get("floor"),
    capacity: formData.get("capacity"),
    pricePerNight: formData.get("pricePerNight"),
    status: formData.get("status"),
  };

  const parsed = createRoomSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const existingRoom = await prisma.room.findUnique({
      where: {
        number: data.number,
      },
    });

    if (existingRoom) {
      return {
        success: false,
        message: "A room with this number already exists.",
        fieldErrors: {
          number: ["This room number is already in use."],
        },
      };
    }

    await prisma.room.create({
      data: {
        number: data.number,
        floor: data.floor === "" ? null : Number(data.floor),
        capacity: Number(data.capacity),
        pricePerNight: data.pricePerNight,
        status: data.status,
      },
    });

    revalidatePath("/room-management");

    return {
      success: true,
      message: `Room ${data.number} was created successfully.`,
    };
  } catch (error) {
    console.error("Failed to create room:", error);

    return {
      success: false,
      message: "Something went wrong while creating the room.",
    };
  }
}

const updateRoomSchema = z.object({
  id: z.string().min(1, "Room ID is required."),

  number: z
    .string()
    .trim()
    .min(1, "Room number is required.")
    .max(10, "Room number is too long."),

  floor: z
    .string()
    .trim()
    .refine((value) => value === "" || Number.isInteger(Number(value)), {
      message: "Floor must be a whole number.",
    }),

  capacity: z
    .string()
    .trim()
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, {
      message: "Capacity must be a positive whole number.",
    }),

  pricePerNight: z
    .string()
    .trim()
    .refine(
      (value) =>
        value !== "" &&
        !Number.isNaN(Number(value)) &&
        Number(value) >= 0,
      {
        message: "Price must be a valid positive number.",
      },
    ),

  status: z.enum([
    "AVAILABLE",
    "OCCUPIED",
    "CLEANING",
    "MAINTENANCE",
    "OUT_OF_ORDER",
  ]),
});

export async function updateRoom(
  _previousState: CreateRoomState,
  formData: FormData,
): Promise<CreateRoomState> {
  const rawData = {
    id: formData.get("id"),
    number: formData.get("number"),
    floor: formData.get("floor"),
    capacity: formData.get("capacity"),
    pricePerNight: formData.get("pricePerNight"),
    status: formData.get("status"),
  };

  const parsed = updateRoomSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const existingRoom = await prisma.room.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!existingRoom) {
      return {
        success: false,
        message: "Room not found.",
      };
    }

    const roomWithSameNumber = await prisma.room.findFirst({
      where: {
        number: data.number,
        NOT: {
          id: data.id,
        },
      },
    });

    if (roomWithSameNumber) {
      return {
        success: false,
        message: "A room with this number already exists.",
        fieldErrors: {
          number: ["This room number is already in use."],
        },
      };
    }

    await prisma.room.update({
      where: {
        id: data.id,
      },

      data: {
        number: data.number,
        floor: data.floor === "" ? null : Number(data.floor),
        capacity: Number(data.capacity),
        pricePerNight: data.pricePerNight,
        status: data.status,
      },
    });

    revalidatePath("/room-management");

    return {
      success: true,
      message: `Room ${data.number} was updated successfully.`,
    };
  } catch (error) {
    console.error("Failed to update room:", error);

    return {
      success: false,
      message: "Something went wrong while updating the room.",
    };
  }
}

export type DeleteRoomState = {
  success: boolean;
  message: string;
};

export async function deleteRoom(
  _previousState: DeleteRoomState,
  formData: FormData,
): Promise<DeleteRoomState> {
  const roomId = formData.get("id");
  console.log("DELETE START", roomId);

  if (typeof roomId !== "string" || !roomId) {
    return {
      success: false,
      message: "Invalid room.",
    };
  }

  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        reservations: {
          select: {
            id: true,
          },
          take: 1,
        },
        maintenance: {
          select: {
            id: true,
          },
          take: 1,
        },
        operations: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

    if (!room) {
      return {
        success: false,
        message: "Room not found.",
      };
    }

    if (room.reservations.length > 0) {
      return {
        success: false,
        message:
          "This room cannot be deleted because it has reservation history. Consider changing its status instead.",
      };
    }

    if (room.maintenance.length > 0) {
      return {
        success: false,
        message:
          "This room cannot be deleted because it has maintenance records associated with it.",
      };
    }

    if (room.operations.length > 0) {
      return {
        success: false,
        message:
          "This room cannot be deleted because it has operations associated with it.",
      };
    }

    await prisma.room.delete({
      where: {
        id: roomId,
      },
    });
    console.log("DELETE SUCCESS", room.number);

    //revalidatePath("/room-management");

    return {
      success: true,
      message: `Room ${room.number} was deleted successfully.`,
    };
  } catch (error) {
    console.error("Failed to delete room:", error);

    return {
      success: false,
      message: "Something went wrong while deleting the room.",
    };
  }
}