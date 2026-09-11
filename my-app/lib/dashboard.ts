import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [
    rooms,
    guests,
    reservations,
    operations,
    maintenance,
    aiInsights,
  ] = await Promise.all([
    prisma.room.findMany({
      orderBy: {
        number: "asc",
      },
    }),

    prisma.guest.findMany({
      orderBy: {
        lastName: "asc",
      },
    }),

    prisma.reservation.findMany({
      orderBy: {
        checkIn: "asc",
      },
    }),

    prisma.operation.findMany({
      include: {
        room: true,
      },
      orderBy: {
        time: "asc",
      },
    }),

    prisma.maintenance.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.aIInsight.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    rooms,
    guests,
    reservations,
    operations,
    maintenance,
    aiInsights,
  };
}