"use server";

import { prisma } from "@/lib/prisma";
import {
  isValidReservationStatusTransition,
  type ReservationStatus,
} from "@/lib/reservations/status";
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
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Check-in date is invalid.",
      ),

    checkOut: z
      .string()
      .trim()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Check-out date is invalid.",
      ),

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
        message:
          "Check-out must be after check-in.",
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

export type CancelReservationState = {
  success: boolean;
  message: string;
};

export type UpdateReservationStatusState = {
  success: boolean;
  message: string;
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

  const parsed =
    createReservationSchema.safeParse(
      rawData,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const [guest, room] =
      await Promise.all([
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
      (checkOut.getTime() -
        checkIn.getTime()) /
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

    const totalPrice =
      room.pricePerNight.mul(nights);

    await prisma.reservation.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guestsCount: Number(
          data.guestsCount,
        ),
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
      .min(
        1,
        "Reservation ID is required.",
      ),

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
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Check-in date is invalid.",
      ),

    checkOut: z
      .string()
      .trim()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Check-out date is invalid.",
      ),

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
        message:
          "Check-out must be after check-in.",
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

  const parsed =
    updateReservationSchema.safeParse(
      rawData,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const reservation =
      await prisma.reservation.findUnique({
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

    const isValidTransition =
      isValidReservationStatusTransition(
        reservation.status,
        data.status,
      );

    if (!isValidTransition) {
      return {
        success: false,
        message: `Reservation cannot change from ${reservation.status} to ${data.status}.`,
        fieldErrors: {
          status: [
            "This status transition is not allowed.",
          ],
        },
      };
    }

    const [guest, room] =
      await Promise.all([
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
      (checkOut.getTime() -
        checkIn.getTime()) /
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

    const totalPrice =
      room.pricePerNight.mul(nights);

    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },

      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guestsCount: Number(
          data.guestsCount,
        ),
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

export async function cancelReservation(
  _previousState: CancelReservationState,
  formData: FormData,
): Promise<CancelReservationState> {
  const reservationId =
    formData.get("id");

  if (
    typeof reservationId !== "string" ||
    !reservationId.trim()
  ) {
    return {
      success: false,
      message: "Reservation ID is required.",
    };
  }

  try {
    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {
      return {
        success: false,
        message: "Reservation not found.",
      };
    }

    const isValidTransition =
      isValidReservationStatusTransition(
        reservation.status,
        "CANCELLED",
      );

    if (!isValidTransition) {
      return {
        success: false,
        message:
          "This reservation cannot be cancelled.",
      };
    }

    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },

      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/reservations");

    return {
      success: true,
      message:
        "Reservation was cancelled successfully.",
    };
  } catch (error) {
    console.error(
      "Failed to cancel reservation:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while cancelling the reservation.",
    };
  }
}

export async function updateReservationStatus(
  _previousState: UpdateReservationStatusState,
  formData: FormData,
): Promise<UpdateReservationStatusState> {
  const reservationId = formData.get("id");
  const nextStatus = formData.get("status");

  if (
    typeof reservationId !== "string" ||
    !reservationId.trim()
  ) {
    return {
      success: false,
      message: "Reservation ID is required.",
    };
  }

  if (
    typeof nextStatus !== "string" ||
    ![
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ].includes(nextStatus)
  ) {
    return {
      success: false,
      message: "Invalid reservation status.",
    };
  }

  const parsedNextStatus =
    nextStatus as ReservationStatus;

  try {
    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {
      return {
        success: false,
        message: "Reservation not found.",
      };
    }

    const isValidTransition =
      isValidReservationStatusTransition(
        reservation.status,
        parsedNextStatus,
      );

    if (!isValidTransition) {
      return {
        success: false,
        message: `Reservation cannot change from ${reservation.status} to ${parsedNextStatus}.`,
      };
    }

    await prisma.$transaction(async (tx) => {
      /*
       * Re-read the reservation inside the transaction.
       *
       * This protects the workflow against another
       * request changing the reservation between the
       * initial read and the transaction.
       */
      const currentReservation =
        await tx.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });

      if (!currentReservation) {
        throw new Error(
          "Reservation not found.",
        );
      }

      const transitionStillValid =
        isValidReservationStatusTransition(
          currentReservation.status,
          parsedNextStatus,
        );

      if (!transitionStillValid) {
        throw new Error(
          `Reservation cannot change from ${currentReservation.status} to ${parsedNextStatus}.`,
        );
      }

      /*
       * CONFIRMED → CHECKED_IN
       *
       * The room must still be AVAILABLE at the
       * moment the transaction performs the workflow.
       */
      if (parsedNextStatus === "CHECKED_IN") {
        const room =
          await tx.room.findUnique({
            where: {
              id: currentReservation.roomId,
            },
            select: {
              id: true,
              number: true,
              status: true,
            },
          });

        if (!room) {
          throw new Error(
            "The reservation room could not be found.",
          );
        }

        if (room.status !== "AVAILABLE") {
          throw new Error(
            `Room ${room.number} is not currently available for check-in.`,
          );
        }

        const guest =
          await tx.guest.findUnique({
            where: {
              id: currentReservation.guestId,
            },
            select: {
              firstName: true,
              lastName: true,
            },
          });

        if (!guest) {
          throw new Error(
            "Reservation guest not found.",
          );
        }

        await tx.reservation.update({
          where: {
            id: currentReservation.id,
          },
          data: {
            status: "CHECKED_IN",
          },
        });

        await tx.room.update({
          where: {
            id: room.id,
          },
          data: {
            status: "OCCUPIED",
          },
        });

        await tx.operation.create({
          data: {
            type: "CHECK_IN",
            guestName: `${guest.firstName} ${guest.lastName}`,
            time: new Date(),
            roomId: room.id,
            reservationId:
              currentReservation.id,
          },
        });

        return;
      }

      /*
       * CHECKED_IN → CHECKED_OUT
       */
      if (parsedNextStatus === "CHECKED_OUT") {
        const room =
          await tx.room.findUnique({
            where: {
              id: currentReservation.roomId,
            },
            select: {
              id: true,
              status: true,
            },
          });

        if (!room) {
          throw new Error(
            "The reservation room could not be found.",
          );
        }

        const guest =
          await tx.guest.findUnique({
            where: {
              id: currentReservation.guestId,
            },
            select: {
              firstName: true,
              lastName: true,
            },
          });

        if (!guest) {
          throw new Error(
            "Reservation guest not found.",
          );
        }

        await tx.reservation.update({
          where: {
            id: currentReservation.id,
          },
          data: {
            status: "CHECKED_OUT",
          },
        });

        /*
         * A normal checkout moves an occupied room
         * into CLEANING.
         *
         * If the room is already in another operational
         * state, preserve that state.
         */
        if (room.status === "OCCUPIED") {
          await tx.room.update({
            where: {
              id: room.id,
            },
            data: {
              status: "CLEANING",
            },
          });
        }

        await tx.operation.create({
          data: {
            type: "CHECK_OUT",
            guestName: `${guest.firstName} ${guest.lastName}`,
            time: new Date(),
            roomId: room.id,
            reservationId:
              currentReservation.id,
          },
        });

        return;
      }

      /*
       * CONFIRMED / other supported status changes.
       *
       * These don't require room/operation workflow
       * synchronization.
       */
      await tx.reservation.update({
        where: {
          id: currentReservation.id,
        },
        data: {
          status: parsedNextStatus,
        },
      });
    });

    revalidatePath("/reservations");
    revalidatePath("/operations");
    revalidatePath("/room-management");
    revalidatePath("/");

    return {
      success: true,
      message:
        parsedNextStatus === "CHECKED_IN"
          ? "Guest checked in successfully."
          : parsedNextStatus === "CHECKED_OUT"
            ? "Guest checked out successfully."
            : "Reservation status was updated successfully.",
    };
  } catch (error) {
    console.error(
      "Failed to update reservation status:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "";

    if (
      message ===
        "Reservation not found." ||
      message ===
        "The reservation room could not be found." ||
      message ===
        "Reservation guest not found."
    ) {
      return {
        success: false,
        message,
      };
    }

    if (
      message.startsWith(
        "Reservation cannot change from ",
      )
    ) {
      return {
        success: false,
        message,
      };
    }

    if (
      message.startsWith(
        "Room ",
      ) &&
      message.endsWith(
        " is not currently available for check-in.",
      )
    ) {
      return {
        success: false,
        message,
      };
    }

    return {
      success: false,
      message:
        "Something went wrong while updating the reservation status.",
    };
  }
}