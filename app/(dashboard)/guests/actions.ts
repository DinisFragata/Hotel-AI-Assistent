"use server";

import { prisma } from "@/lib/prisma";
import {
  createGuestSchema,
  updateGuestSchema,
  type CreateGuestState,
  type UpdateGuestState,
} from "@/lib/guests/schemas";
import { revalidatePath } from "next/cache";

export async function createGuest(
  _previousState: CreateGuestState,
  formData: FormData,
): Promise<CreateGuestState> {
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredLanguage:
      formData.get("preferredLanguage"),
    preferredRoomType:
      formData.get("preferredRoomType"),
    specialRequests:
      formData.get("specialRequests"),
  };

  const parsed =
    createGuestSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const firstName = parsed.data.firstName;
  const lastName = parsed.data.lastName;

  const email = parsed.data.email
    ? parsed.data.email.toLowerCase()
    : null;

  const phone = parsed.data.phone || null;
  const preferredLanguage =
    parsed.data.preferredLanguage || null;
  const preferredRoomType =
    parsed.data.preferredRoomType || null;
  const specialRequests =
    parsed.data.specialRequests || null;

  if (email) {
    const existingGuest =
      await prisma.guest.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

    if (existingGuest) {
      return {
        success: false,
        message:
          "A guest with this email already exists.",
        fieldErrors: {
          email: [
            "A guest with this email already exists.",
          ],
        },
      };
    }
  }

  try {
    const guest = await prisma.guest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        preferredLanguage,
        preferredRoomType,
        specialRequests,
      },
    });

    revalidatePath("/guests");
    revalidatePath("/reservations");

    return {
      success: true,
      message: `Guest ${guest.firstName} ${guest.lastName} was created successfully.`,
      createdGuest: {
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
      },
    };
  } catch (error) {
    console.error(
      "Failed to create guest:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while creating the guest.",
    };
  }
}

export async function updateGuest(
  guestId: string,
  _previousState: UpdateGuestState,
  formData: FormData,
): Promise<UpdateGuestState> {
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredLanguage: formData.get("preferredLanguage"),
    preferredRoomType: formData.get("preferredRoomType"),
    specialRequests: formData.get("specialRequests"),
  };

  const parsed = updateGuestSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email
    ? parsed.data.email.toLowerCase()
    : null;

  const phone = parsed.data.phone || null;
  const preferredLanguage = parsed.data.preferredLanguage || null;
  const preferredRoomType = parsed.data.preferredRoomType || null;
  const specialRequests = parsed.data.specialRequests || null;

  const guest = await prisma.guest.findUnique({
    where: {
      id: guestId,
    },
    select: {
      id: true,
    },
  });

  if (!guest) {
    return {
      success: false,
      message: "Guest not found.",
    };
  }

  if (email) {
    const existingGuest = await prisma.guest.findFirst({
      where: {
        email,
        NOT: {
          id: guestId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingGuest) {
      return {
        success: false,
        message: "A guest with this email already exists.",
        fieldErrors: {
          email: ["A guest with this email already exists."],
        },
      };
    }
  }

  try {
    await prisma.guest.update({
      where: {
        id: guestId,
      },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email,
        phone,
        preferredLanguage,
        preferredRoomType,
        specialRequests,
      },
    });

    revalidatePath("/guests");

    return {
      success: true,
      message: "Guest updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update guest:", error);

    return {
      success: false,
      message: "Something went wrong while updating the guest.",
    };
  }
}