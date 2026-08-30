import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const rooms = await prisma.room.findMany();

  const guests = await prisma.guest.findMany();

  const reservations = await prisma.reservation.findMany();

  const operations = await prisma.operation.findMany();

  const maintenance = await prisma.maintenance.findMany();

  const aiInsights = await prisma.aIInsight.findMany();

  return {
    rooms,
    guests,
    reservations,
    operations,
    maintenance,
    aiInsights,
  };
}