import "dotenv/config";
import {
  PrismaClient,
  RoomStatus,
  ReservationStatus,
  OperationType,
  MaintenanceStatus,
} from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // --------------------------------------------------
  // USERS
  // --------------------------------------------------

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@dinisfragata.pt",
    },
    update: {},
    create: {
      name: "Dinis Fragata",
      email: "admin@dinisfragata.pt",
      role: "PROPERTY_MANAGER",
    },
  });

  // --------------------------------------------------
  // ROOMS
  // --------------------------------------------------

  const roomsData = [
    {
      number: "201",
      floor: 2,
      status: RoomStatus.AVAILABLE,
      capacity: 2,
      pricePerNight: 120,
    },
    {
      number: "202",
      floor: 2,
      status: RoomStatus.OCCUPIED,
      capacity: 2,
      pricePerNight: 135,
    },
    {
      number: "203",
      floor: 2,
      status: RoomStatus.CLEANING,
      capacity: 2,
      pricePerNight: 110,
    },
    {
      number: "204",
      floor: 2,
      status: RoomStatus.OCCUPIED,
      capacity: 3,
      pricePerNight: 160,
    },
    {
      number: "205",
      floor: 2,
      status: RoomStatus.AVAILABLE,
      capacity: 2,
      pricePerNight: 125,
    },
    {
      number: "301",
      floor: 3,
      status: RoomStatus.OCCUPIED,
      capacity: 2,
      pricePerNight: 145,
    },
    {
      number: "302",
      floor: 3,
      status: RoomStatus.MAINTENANCE,
      capacity: 2,
      pricePerNight: 130,
    },
    {
      number: "303",
      floor: 3,
      status: RoomStatus.AVAILABLE,
      capacity: 4,
      pricePerNight: 190,
    },
    {
      number: "401",
      floor: 4,
      status: RoomStatus.OCCUPIED,
      capacity: 2,
      pricePerNight: 175,
    },
    {
      number: "402",
      floor: 4,
      status: RoomStatus.AVAILABLE,
      capacity: 2,
      pricePerNight: 180,
    },
    {
      number: "510",
      floor: 5,
      status: RoomStatus.OCCUPIED,
      capacity: 3,
      pricePerNight: 210,
    },
  ];

  const rooms = [];

  for (const roomData of roomsData) {
    const room = await prisma.room.upsert({
      where: {
        number: roomData.number,
      },
      update: roomData,
      create: roomData,
    });

    rooms.push(room);
  }

  const room201 = rooms.find((room) => room.number === "201")!;
  const room202 = rooms.find((room) => room.number === "202")!;
  const room204 = rooms.find((room) => room.number === "204")!;
  const room301 = rooms.find((room) => room.number === "301")!;
  const room302 = rooms.find((room) => room.number === "302")!;
  const room401 = rooms.find((room) => room.number === "401")!;
  const room402 = rooms.find((room) => room.number === "402")!;
  const room510 = rooms.find((room) => room.number === "510")!;

  // --------------------------------------------------
  // GUESTS
  // --------------------------------------------------

  const guestsData = [
    {
      firstName: "Eleanor",
      lastName: "Vance",
      email: "eleanor.vance@example.com",
      phone: "+44 7700 900101",
    },
    {
      firstName: "Arthur",
      lastName: "Pendelton",
      email: "arthur.pendelton@example.com",
      phone: "+44 7700 900102",
    },
    {
      firstName: "Theodore",
      lastName: "Montague",
      email: "theodore.montague@example.com",
      phone: "+44 7700 900103",
    },
    {
      firstName: "Clara",
      lastName: "Bow",
      email: "clara.bow@example.com",
      phone: "+1 202 555 0104",
    },
    {
      firstName: "James",
      lastName: "Sterling",
      email: "james.sterling@example.com",
      phone: "+44 7700 900105",
    },
    {
      firstName: "Sophia",
      lastName: "Whitmore",
      email: "sophia.whitmore@example.com",
      phone: "+44 7700 900106",
    },
    {
      firstName: "Oliver",
      lastName: "Harrington",
      email: "oliver.harrington@example.com",
      phone: "+44 7700 900107",
    },
    {
      firstName: "Amelia",
      lastName: "Crawford",
      email: "amelia.crawford@example.com",
      phone: "+44 7700 900108",
    },
  ];

  const guests = [];

  for (const guestData of guestsData) {
    const guest = await prisma.guest.upsert({
      where: {
        email: guestData.email,
      },
      update: guestData,
      create: guestData,
    });

    guests.push(guest);
  }

  const eleanor = guests[0];
  const arthur = guests[1];
  const theodore = guests[2];
  const clara = guests[3];
  const sterling = guests[4];
  const sophia = guests[5];
  const oliver = guests[6];
  const amelia = guests[7];

  // --------------------------------------------------
  // RESERVATIONS
  // --------------------------------------------------

  const today = new Date();

  const date = (daysFromToday: number, hour: number) => {
    const result = new Date(today);
    result.setDate(result.getDate() + daysFromToday);
    result.setHours(hour, 0, 0, 0);
    return result;
  };

  await prisma.reservation.create({
    data: {
      checkIn: date(0, 14),
      checkOut: date(3, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 435,
      guestId: eleanor.id,
      roomId: room202.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(0, 15),
      checkOut: date(4, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 640,
      guestId: theodore.id,
      roomId: room204.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(-1, 15),
      checkOut: date(2, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 435,
      guestId: sophia.id,
      roomId: room301.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(-2, 14),
      checkOut: date(1, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 525,
      guestId: oliver.id,
      roomId: room401.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(-1, 14),
      checkOut: date(2, 12),
      guestsCount: 3,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 630,
      guestId: amelia.id,
      roomId: room510.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(0, 14),
      checkOut: date(3, 11),
      guestsCount: 2,
      status: ReservationStatus.CONFIRMED,
      totalPrice: 540,
      guestId: arthur.id,
      roomId: room402.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(2, 15),
      checkOut: date(5, 11),
      guestsCount: 2,
      status: ReservationStatus.CONFIRMED,
      totalPrice: 375,
      guestId: clara.id,
      roomId: room201.id,
    },
  });

  await prisma.reservation.create({
    data: {
      checkIn: date(5, 14),
      checkOut: date(8, 11),
      guestsCount: 2,
      status: ReservationStatus.PENDING,
      totalPrice: 435,
      guestId: sterling.id,
      roomId: room302.id,
    },
  });

  // --------------------------------------------------
  // TODAY'S OPERATIONS
  // --------------------------------------------------

  await prisma.operation.createMany({
    data: [
      {
        type: OperationType.CHECK_IN,
        guestName: "Eleanor Vance",
        time: date(0, 14),
        roomId: room202.id,
      },
      {
        type: OperationType.CHECK_OUT,
        guestName: "Arthur Pendelton",
        time: date(0, 11),
        roomId: room301.id,
      },
      {
        type: OperationType.CHECK_IN,
        guestName: "Theodore Montague",
        time: date(0, 15),
        roomId: room204.id,
      },
      {
        type: OperationType.CHECK_OUT,
        guestName: "Clara Bow",
        time: date(0, 12),
        roomId: room510.id,
      },
      {
        type: OperationType.CHECK_IN,
        guestName: "Sophia Whitmore",
        time: date(0, 16),
        roomId: room401.id,
      },
      {
        type: OperationType.CHECK_OUT,
        guestName: "Oliver Harrington",
        time: date(0, 11),
        roomId: room402.id,
      },
      {
        type: OperationType.CHECK_IN,
        guestName: "Amelia Crawford",
        time: date(0, 15),
        roomId: room510.id,
      },
      {
        type: OperationType.CHECK_IN,
        guestName: "James Sterling",
        time: date(0, 17),
        roomId: room201.id,
      },
    ],
  });

  // --------------------------------------------------
  // MAINTENANCE
  // --------------------------------------------------

  await prisma.maintenance.createMany({
    data: [
      {
        title: "Air conditioning inspection",
        description: "AC unit making unusual noise.",
        status: MaintenanceStatus.OPEN,
        roomId: room302.id,
        userId: admin.id,
      },
      {
        title: "Bathroom faucet replacement",
        description: "Guest reported a leaking faucet.",
        status: MaintenanceStatus.IN_PROGRESS,
        roomId: room204.id,
        userId: admin.id,
      },
      {
        title: "Replace bedside lamp",
        description: "Lamp not powering on.",
        status: MaintenanceStatus.OPEN,
        roomId: room201.id,
        userId: admin.id,
      },
      {
        title: "Window lock inspection",
        description: "Check window lock before next arrival.",
        status: MaintenanceStatus.COMPLETED,
        roomId: room401.id,
        userId: admin.id,
        completedAt: new Date(),
      },
      {
        title: "TV remote replacement",
        description: "Remote control batteries and buttons faulty.",
        status: MaintenanceStatus.OPEN,
        roomId: room510.id,
        userId: admin.id,
      },
    ],
  });

  // --------------------------------------------------
  // AI INSIGHTS
  // --------------------------------------------------

  await prisma.aIInsight.createMany({
    data: [
      {
        room: "Room 204",
        title: "Guest preference detected",
        text: "Mr. Sterling prefers non-feather pillows. Room service notified.",
        action: "CONFIRM",
        confirmed: false,
      },
      {
        room: "Room 205",
        title: "Celebration detected",
        text: "Anniversary celebration. Champagne delivery scheduled for 18:00.",
        action: "SCHEDULED",
        confirmed: true,
      },
      {
        room: "Room 401",
        title: "Early arrival",
        text: "Guest arriving 45 minutes earlier than originally expected.",
        action: "REVIEW",
        confirmed: false,
      },
      {
        room: "Room 302",
        title: "Maintenance risk",
        text: "Recurring AC issue detected. Consider scheduling a preventive inspection.",
        action: "REVIEW",
        confirmed: false,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created/updated ${rooms.length} rooms.`);
  console.log(`Created/updated ${guests.length} guests.`);
  console.log("Created reservations, operations, maintenance requests and AI insights.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });