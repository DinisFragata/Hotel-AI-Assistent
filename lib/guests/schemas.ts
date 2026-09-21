import { z } from "zod";

const guestSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(80, "First name is too long."),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(80, "Last name is too long."),

    email: z
      .string()
      .trim()
      .max(160, "Email is too long.")
      .refine(
        (value) =>
          value === "" ||
          z
            .string()
            .email()
            .safeParse(value).success,
        "Please enter a valid email address.",
      ),

    phone: z
      .string()
      .trim()
      .max(
        40,
        "Phone number is too long.",
      ),

    preferredLanguage: z
      .string()
      .trim()
      .max(
        40,
        "Preferred language is too long.",
      ),

    preferredRoomType: z
      .string()
      .trim()
      .max(
        80,
        "Room preference is too long.",
      ),

    specialRequests: z
      .string()
      .trim()
      .max(
        500,
        "Special requests are too long.",
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      const message =
        "Email or phone number is required.";

      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message,
      });

      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message,
      });
    }
  });

export const createGuestSchema = guestSchema;
export const updateGuestSchema = guestSchema;

export type CreateGuestState = {
  success: boolean;
  message: string;
  fieldErrors?: GuestFieldErrors;
  createdGuest?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
  };
};

export type UpdateGuestState = {
  success: boolean;
  message: string;
  fieldErrors?: GuestFieldErrors;
};

export type GuestFieldErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  phone?: string[];
  preferredLanguage?: string[];
  preferredRoomType?: string[];
  specialRequests?: string[];
};