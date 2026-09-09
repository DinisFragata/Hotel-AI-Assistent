import { isValidDateString } from "@/lib/reservations/validation";

import { z } from "zod";

export const createReservationSchema = z
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
        message: "Check-out must be after check-in.",
      });
    }
  });

export const updateReservationSchema = z
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
    .refine(
        isValidDateString,
        "Check-in date is invalid.",
    ),

    checkOut: z
    .string()
    .trim()
    .refine(
        isValidDateString,
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
        message: "Check-out must be after check-in.",
      });
    }
  });