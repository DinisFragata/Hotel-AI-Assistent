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
      orderBy: [
        {
          lastName: "asc",
        },
        {
          firstName: "asc",
        },
      ],
      include: {
        reservations: {
          orderBy: {
            checkIn: "desc",
          },
          select: {
            id: true,
            guestId: true,
            roomId: true,
            checkIn: true,
            checkOut: true,
            guestsCount: true,
            totalPrice: true,
            status: true,
            room: {
              select: {
                number: true,
              },
            },
          },
        },
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