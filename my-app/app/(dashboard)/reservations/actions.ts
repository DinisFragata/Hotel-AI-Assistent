"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import {
  createReservationSchema,
  updateReservationSchema,
} from "@/lib/reservations/schemas";

import {
  isValidReservationStatusTransition,
  type ReservationStatus,
} from "@/lib/reservations/status";

import {
  calculateReservationNights,
  findReservationConflict,
  isRoomCapacityExceeded,
} from "@/lib/reservations/validation";

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
    createReservationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
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

    const nights = calculateReservationNights(
      checkIn,
      checkOut,
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

    const guestsCount = Number(data.guestsCount);

    if (
      isRoomCapacityExceeded(
        room.capacity,
        guestsCount,
      )
    ) {
      return {
        success: false,
        message:
          "The selected room cannot accommodate that many guests.",
        fieldErrors: {
          guestsCount: [
            `This room can accommodate a maximum of ${room.capacity} guests.`,
          ],
        },
      };
    }

    const conflictingReservation =
      await findReservationConflict({
        roomId: room.id,
        checkIn,
        checkOut,
      });

    if (conflictingReservation) {
      return {
        success: false,
        message: `Room ${room.number} is already reserved for the selected dates.`,
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
        guestsCount,
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
    updateReservationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
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
        data.status as ReservationStatus,
      );

    if (!isValidTransition) {
      return {
        success: false,
        message: "This reservation cannot be moved directly from Pending to Checked In.",
        fieldErrors: {
          status: [
            "This status transition is not allowed.",
          ],
        },
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

    const nights = calculateReservationNights(
      checkIn,
      checkOut,
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

    const guestsCount = Number(data.guestsCount);

    if (
      isRoomCapacityExceeded(
        room.capacity,
        guestsCount,
      )
    ) {
      return {
        success: false,
        message:
          "The selected room cannot accommodate that many guests.",
        fieldErrors: {
          guestsCount: [
            `This room can accommodate a maximum of ${room.capacity} guests.`,
          ],
        },
      };
    }

    const conflictingReservation =
      await findReservationConflict({
        roomId: room.id,
        checkIn,
        checkOut,
        excludeReservationId: reservation.id,
      });

    if (conflictingReservation) {
      return {
        success: false,
        message: `Room ${room.number} is already reserved for the selected dates.`,
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
        guestsCount,
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
  const reservationId = formData.get("id");

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
        message: "This reservation cannot be cancelled.",
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
        nextStatus as ReservationStatus,
      );

    if (!isValidTransition) {
      return {
        success: false,
        message: `Reservation cannot change from ${reservation.status} to ${nextStatus}.`,
      };
    }

    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        status: nextStatus as ReservationStatus,
      },
    });

    revalidatePath("/reservations");

    return {
      success: true,
      message:
        "Reservation status was updated successfully.",
    };
  } catch (error) {
    console.error(
      "Failed to update reservation status:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while updating the reservation status.",
    };
  }
}