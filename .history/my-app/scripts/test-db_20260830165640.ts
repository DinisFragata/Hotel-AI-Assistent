import { prisma } from "@/lib/prisma";

async function main() {
  const room = await prisma.room.create({
    data: {
      number: "201",
      floor: 2,
      status: "AVAILABLE",
      capacity: 2,
      pricePerNight: 120,
    },
  });

  console.log("Room created:");
  console.log(room);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });