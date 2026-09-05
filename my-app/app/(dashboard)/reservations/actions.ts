"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createReservationSchema = z
  .object({
    guestId: z
      .string()
      .trim()
      .min(1, "Guest is required."),

    roomId: z
      .string()
      .trim()
      .min(1, "Room is required."),

    checkIn: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-in date is invalid."),

    checkOut: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-out date is invalid."),

    guestsCount: z
      .string()
      .trim()
      .refine(
        (value) =>
          Number.isInteger(Number(value)) &&
          Number(value) > 0,
        {
          message:
            "Number of guests must be a positive whole number.",
        },
      ),

    status: z.enum(["PENDING", "CONFIRMED"]),
  })
  .superRefine((data, context) => {
    if (data.checkOut <= data.checkIn) {
      context.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
  });

export type CreateReservationState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    guestId?: string[];
    roomId?: string[];
    checkIn?: string[];
    checkOut?: string[];
    guestsCount?: string[];
    status?: string[];
  };
};

export type UpdateReservationState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    id?: string[];
    guestId?: string[];
    roomId?: string[];
    checkIn?: string[];
    checkOut?: string[];
    guestsCount?: string[];
    status?: string[];
  };
};

export async function createReservation(
  _previousState: CreateReservationState,
  formData: FormData,
): Promise<CreateReservationState> {
  const rawData = {
    guestId: formData.get("guestId"),
    roomId: formData.get("roomId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guestsCount: formData.get("guestsCount"),
    status: formData.get("status"),
  };

  const parsed = createReservationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const [guest, room] = await Promise.all([
      prisma.guest.findUnique({
        where: {
          id: data.guestId,
        },
      }),

      prisma.room.findUnique({
        where: {
          id: data.roomId,
        },
      }),
    ]);

    if (!guest) {
      return {
        success: false,
        message: "Guest not found.",
        fieldErrors: {
          guestId: ["The selected guest could not be found."],
        },
      };
    }

    if (!room) {
      return {
        success: false,
        message: "Room not found.",
        fieldErrors: {
          roomId: ["The selected room could not be found."],
        },
      };
    }

    const checkIn = new Date(
      `${data.checkIn}T00:00:00.000Z`,
    );

    const checkOut = new Date(
      `${data.checkOut}T00:00:00.000Z`,
    );

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOut.getTime() - checkIn.getTime()) /
        millisecondsPerDay,
    );

    if (nights <= 0) {
      return {
        success: false,
        message: "Invalid reservation dates.",
        fieldErrors: {
          checkOut: [
            "Check-out must be after check-in.",
          ],
        },
      };
    }

    const conflictingReservation =
      await prisma.reservation.findFirst({
        where: {
          roomId: room.id,

          status: {
            not: "CANCELLED",
          },

          checkIn: {
            lt: checkOut,
          },

          checkOut: {
            gt: checkIn,
          },
        },
      });

    if (conflictingReservation) {
      return {
        success: false,
        message:
          "This room is already reserved for the selected dates.",
        fieldErrors: {
          roomId: [
            "This room is not available for the selected dates.",
          ],
        },
      };
    }

    const totalPrice = room.pricePerNight.mul(nights);

    await prisma.reservation.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guestsCount: Number(data.guestsCount),
        status: data.status,
        totalPrice,
      },
    });

    revalidatePath("/reservations");

    return {
      success: true,
      message: `Reservation for ${guest.firstName} ${guest.lastName} was created successfully.`,
    };
  } catch (error) {
    console.error(
      "Failed to create reservation:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while creating the reservation.",
    };
  }
}

const updateReservationSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, "Reservation ID is required."),

    guestId: z
      .string()
      .trim()
      .min(1, "Guest is required."),

    roomId: z
      .string()
      .trim()
      .min(1, "Room is required."),

    checkIn: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-in date is invalid."),

    checkOut: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-out date is invalid."),

    guestsCount: z
      .string()
      .trim()
      .refine(
        (value) =>
          Number.isInteger(Number(value)) &&
          Number(value) > 0,
        {
          message:
            "Number of guests must be a positive whole number.",
        },
      ),

    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ]),
  })
  .superRefine((data, context) => {
    if (data.checkOut <= data.checkIn) {
      context.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
  });

  export async function updateReservation(
  _previousState: UpdateReservationState,
  formData: FormData,
): Promise<UpdateReservationState> {
  const rawData = {
    id: formData.get("id"),
    guestId: formData.get("guestId"),
    roomId: formData.get("roomId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guestsCount: formData.get("guestsCount"),
    status: formData.get("status"),
  };

  const parsed = updateReservationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!reservation) {
      return {
        success: false,
        message: "Reservation not found.",
      };
    }

    const [guest, room] = await Promise.all([
      prisma.guest.findUnique({
        where: {
          id: data.guestId,
        },
      }),

      prisma.room.findUnique({
        where: {
          id: data.roomId,
        },
      }),
    ]);

    if (!guest) {
      return {
        success: false,
        message: "Guest not found.",
        fieldErrors: {
          guestId: [
            "The selected guest could not be found.",
          ],
        },
      };
    }

    if (!room) {
      return {
        success: false,
        message: "Room not found.",
        fieldErrors: {
          roomId: [
            "The selected room could not be found.",
          ],
        },
      };
    }

    const checkIn = new Date(
      `${data.checkIn}T00:00:00.000Z`,
    );

    const checkOut = new Date(
      `${data.checkOut}T00:00:00.000Z`,
    );

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOut.getTime() - checkIn.getTime()) /
        millisecondsPerDay,
    );

    if (nights <= 0) {
      return {
        success: false,
        message: "Invalid reservation dates.",
        fieldErrors: {
          checkOut: [
            "Check-out must be after check-in.",
          ],
        },
      };
    }

    const conflictingReservation =
      await prisma.reservation.findFirst({
        where: {
          id: {
            not: reservation.id,
          },

          roomId: room.id,

          status: {
            not: "CANCELLED",
          },

          checkIn: {
            lt: checkOut,
          },

          checkOut: {
            gt: checkIn,
          },
        },
      });

    if (conflictingReservation) {
      return {
        success: false,
        message:
          "This room is already reserved for the selected dates.",
        fieldErrors: {
          roomId: [
            "This room is not available for the selected dates.",
          ],
        },
      };
    }

    const totalPrice = room.pricePerNight.mul(nights);

    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },

      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guestsCount: Number(data.guestsCount),
        status: data.status,
        totalPrice,
      },
    });

    revalidatePath("/reservations");

    return {
      success: true,
      message:
        "Reservation was updated successfully.",
    };
  } catch (error) {
    console.error(
      "Failed to update reservation:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while updating the reservation.",
    };
  }
}