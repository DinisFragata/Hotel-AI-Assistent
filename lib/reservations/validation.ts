import { prisma } from "@/lib/prisma";

export function calculateReservationNights(
  checkIn: Date,
  checkOut: Date,
) {
  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return Math.round(
    (checkOut.getTime() - checkIn.getTime()) /
      millisecondsPerDay,
  );
}

export async function findReservationConflict({
  roomId,
  checkIn,
  checkOut,
  excludeReservationId,
}: {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  excludeReservationId?: string;
}) {
  return prisma.reservation.findFirst({
    where: {
      ...(excludeReservationId
        ? {
            id: {
              not: excludeReservationId,
            },
          }
        : {}),

      roomId,

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
}

export function isRoomCapacityExceeded(
  roomCapacity: number,
  guestsCount: number,
) {
  return guestsCount > roomCapacity;
}

export function isValidDateString(
  value: string,
) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}