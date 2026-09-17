import { prisma } from "@/lib/prisma";

export async function getRoomsSnapshot() {
  return prisma.room.findMany({
    select: {
      id: true,
      number: true,
      status: true,
    },
  });
}

export async function getReservationsInPeriod(periodStart: Date) {
  return prisma.reservation.findMany({
    where: {
      createdAt: {
        gte: periodStart,
      },
    },
    select: {
      id: true,
      status: true,
      totalPrice: true,
      checkIn: true,
      checkOut: true,
      createdAt: true,
    },
  });
}

export async function getOperationsInPeriod(periodStart: Date) {
  return prisma.operation.findMany({
    where: {
      time: {
        gte: periodStart,
      },
    },
    select: {
      id: true,
      type: true,
      time: true,
    },
    orderBy: {
      time: "asc",
    },
  });
}

export async function getMaintenanceRecords(periodStart: Date) {
  return prisma.maintenance.findMany({
    select: {
      id: true,
      status: true,
      priority: true,
      createdAt: true,
      completedAt: true,
    },
  });
}
