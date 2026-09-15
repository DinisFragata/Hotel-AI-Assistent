import "dotenv/config";
import {
  PrismaClient,
  RoomStatus,
  ReservationStatus,
  OperationType,
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceHistoryType,
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
      id: "user_admin_dinis",
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
      preferredLanguage: "English",
      preferredRoomType: "Double",
      specialRequests: "Prefers a quiet room away from the elevator.",
    },
    {
      firstName: "Arthur",
      lastName: "Pendelton",
      email: "arthur.pendelton@example.com",
      phone: "+44 7700 900102",
      preferredLanguage: "English",
      preferredRoomType: "Suite",
      specialRequests: "Requests early breakfast when available.",
    },
    {
      firstName: "Theodore",
      lastName: "Montague",
      email: "theodore.montague@example.com",
      phone: "+44 7700 900103",
      preferredLanguage: "English",
      preferredRoomType: "Double",
      specialRequests: "Non-feather pillows.",
    },
    {
      firstName: "Clara",
      lastName: "Bow",
      email: "clara.bow@example.com",
      phone: "+1 202 555 0104",
      preferredLanguage: "English",
      preferredRoomType: "Quiet room",
      specialRequests: "Prefers minimal room noise.",
    },
    {
      firstName: "James",
      lastName: "Sterling",
      email: "james.sterling@example.com",
      phone: "+44 7700 900105",
      preferredLanguage: "English",
      preferredRoomType: "Double",
      specialRequests: "Non-feather pillows and late check-out when possible.",
    },
    {
      firstName: "Sophia",
      lastName: "Whitmore",
      email: "sophia.whitmore@example.com",
      phone: "+44 7700 900106",
      preferredLanguage: "English",
      preferredRoomType: "Suite",
      specialRequests: null,
    },
    {
      firstName: "Oliver",
      lastName: "Harrington",
      email: "oliver.harrington@example.com",
      phone: "+44 7700 900107",
      preferredLanguage: "English",
      preferredRoomType: "Double",
      specialRequests: "Prefers a room on a higher floor.",
    },
    {
      firstName: "Amelia",
      lastName: "Crawford",
      email: "amelia.crawford@example.com",
      phone: "+44 7700 900108",
      preferredLanguage: "English",
      preferredRoomType: "Double",
      specialRequests: "Prefers extra pillows.",
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
  // DATE HELPERS
  // --------------------------------------------------

  const today = new Date();

  const date = (daysFromToday: number, hour: number) => {
    const result = new Date(today);
    result.setDate(result.getDate() + daysFromToday);
    result.setHours(hour, 0, 0, 0);
    return result;
  };

  // --------------------------------------------------
  // RESERVATIONS
  // --------------------------------------------------

  const reservationData = [
    {
      id: "reservation_eleanor_202",
      checkIn: date(0, 14),
      checkOut: date(3, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 435,
      guestId: eleanor.id,
      roomId: room202.id,
    },
    {
      id: "reservation_theodore_204",
      checkIn: date(0, 15),
      checkOut: date(4, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 640,
      guestId: theodore.id,
      roomId: room204.id,
    },
    {
      id: "reservation_sophia_301",
      checkIn: date(-1, 15),
      checkOut: date(2, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 435,
      guestId: sophia.id,
      roomId: room301.id,
    },
    {
      id: "reservation_oliver_401",
      checkIn: date(-2, 14),
      checkOut: date(1, 11),
      guestsCount: 2,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 525,
      guestId: oliver.id,
      roomId: room401.id,
    },
    {
      id: "reservation_amelia_510",
      checkIn: date(-1, 14),
      checkOut: date(2, 12),
      guestsCount: 3,
      status: ReservationStatus.CHECKED_IN,
      totalPrice: 630,
      guestId: amelia.id,
      roomId: room510.id,
    },
    {
      id: "reservation_arthur_402",
      checkIn: date(0, 14),
      checkOut: date(3, 11),
      guestsCount: 2,
      status: ReservationStatus.CONFIRMED,
      totalPrice: 540,
      guestId: arthur.id,
      roomId: room402.id,
    },
    {
      id: "reservation_clara_201",
      checkIn: date(2, 15),
      checkOut: date(5, 11),
      guestsCount: 2,
      status: ReservationStatus.CONFIRMED,
      totalPrice: 375,
      guestId: clara.id,
      roomId: room201.id,
    },
    {
      id: "reservation_sterling_302",
      checkIn: date(5, 14),
      checkOut: date(8, 11),
      guestsCount: 2,
      status: ReservationStatus.PENDING,
      totalPrice: 435,
      guestId: sterling.id,
      roomId: room302.id,
    },
  ];

  for (const reservation of reservationData) {
    await prisma.reservation.upsert({
      where: {
        id: reservation.id,
      },
      update: reservation,
      create: reservation,
    });
  }

  // --------------------------------------------------
  // TODAY'S OPERATIONS
  // --------------------------------------------------

  const operationData = [
    {
      id: "operation_checkin_eleanor",
      type: OperationType.CHECK_IN,
      guestName: "Eleanor Vance",
      time: date(0, 14),
      roomId: room202.id,
    },
    {
      id: "operation_checkout_arthur",
      type: OperationType.CHECK_OUT,
      guestName: "Arthur Pendelton",
      time: date(0, 11),
      roomId: room301.id,
    },
    {
      id: "operation_checkin_theodore",
      type: OperationType.CHECK_IN,
      guestName: "Theodore Montague",
      time: date(0, 15),
      roomId: room204.id,
    },
    {
      id: "operation_checkout_clara",
      type: OperationType.CHECK_OUT,
      guestName: "Clara Bow",
      time: date(0, 12),
      roomId: room510.id,
    },
    {
      id: "operation_checkin_sophia",
      type: OperationType.CHECK_IN,
      guestName: "Sophia Whitmore",
      time: date(0, 16),
      roomId: room401.id,
    },
    {
      id: "operation_checkout_oliver",
      type: OperationType.CHECK_OUT,
      guestName: "Oliver Harrington",
      time: date(0, 11),
      roomId: room402.id,
    },
    {
      id: "operation_checkin_amelia",
      type: OperationType.CHECK_IN,
      guestName: "Amelia Crawford",
      time: date(0, 15),
      roomId: room510.id,
    },
    {
      id: "operation_checkin_sterling",
      type: OperationType.CHECK_IN,
      guestName: "James Sterling",
      time: date(0, 17),
      roomId: room201.id,
    },
  ];

  for (const operation of operationData) {
    await prisma.operation.upsert({
      where: {
        id: operation.id,
      },
      update: operation,
      create: operation,
    });
  }

  // --------------------------------------------------
  // MAINTENANCE
  // --------------------------------------------------

  const maintenanceData = [
    {
      id: "maintenance_ac_inspection",
      title: "Air conditioning inspection",
      description: "AC unit making unusual noise.",
      status: MaintenanceStatus.OPEN,
      priority: MaintenancePriority.HIGH,
      dueDate: date(1, 17),
      roomId: room302.id,
      assignedToId: admin.id,
      completedAt: null,
    },
    {
      id: "maintenance_faucet_replacement",
      title: "Bathroom faucet replacement",
      description: "Guest reported a leaking faucet.",
      status: MaintenanceStatus.IN_PROGRESS,
      priority: MaintenancePriority.URGENT,
      dueDate: date(0, 16),
      roomId: room204.id,
      assignedToId: admin.id,
      completedAt: null,
    },
    {
      id: "maintenance_bedside_lamp",
      title: "Replace bedside lamp",
      description: "Lamp not powering on.",
      status: MaintenanceStatus.OPEN,
      priority: MaintenancePriority.MEDIUM,
      dueDate: date(3, 12),
      roomId: room201.id,
      assignedToId: null,
      completedAt: null,
    },
    {
      id: "maintenance_window_lock",
      title: "Window lock inspection",
      description: "Check window lock before next arrival.",
      status: MaintenanceStatus.COMPLETED,
      priority: MaintenancePriority.LOW,
      dueDate: date(-2, 17),
      roomId: room401.id,
      assignedToId: admin.id,
      completedAt: date(-1, 16),
    },
    {
      id: "maintenance_tv_remote",
      title: "TV remote replacement",
      description: "Remote control batteries and buttons faulty.",
      status: MaintenanceStatus.OPEN,
      priority: MaintenancePriority.HIGH,
      dueDate: date(5, 14),
      roomId: room510.id,
      assignedToId: admin.id,
      completedAt: null,
    },
  ];

  for (const maintenance of maintenanceData) {
    await prisma.maintenance.upsert({
      where: {
        id: maintenance.id,
      },
      update: maintenance,
      create: maintenance,
    });
  }

  // --------------------------------------------------
  // MAINTENANCE HISTORY
  // --------------------------------------------------

  const maintenanceHistoryData = [
    {
      id: "maintenance_history_ac_created",
      type: MaintenanceHistoryType.CREATED,
      description: "Maintenance request created.",
      maintenanceId: "maintenance_ac_inspection",
      userId: admin.id,
    },
    {
      id: "maintenance_history_ac_assigned",
      type: MaintenanceHistoryType.ASSIGNED,
      description: "Maintenance request assigned to Dinis Fragata.",
      maintenanceId: "maintenance_ac_inspection",
      userId: admin.id,
    },
    {
      id: "maintenance_history_ac_priority",
      type: MaintenanceHistoryType.PRIORITY_CHANGED,
      description: "Priority set to HIGH.",
      maintenanceId: "maintenance_ac_inspection",
      userId: admin.id,
    },

    {
      id: "maintenance_history_faucet_created",
      type: MaintenanceHistoryType.CREATED,
      description: "Maintenance request created.",
      maintenanceId: "maintenance_faucet_replacement",
      userId: admin.id,
    },
    {
      id: "maintenance_history_faucet_assigned",
      type: MaintenanceHistoryType.ASSIGNED,
      description: "Maintenance request assigned to Dinis Fragata.",
      maintenanceId: "maintenance_faucet_replacement",
      userId: admin.id,
    },
    {
      id: "maintenance_history_faucet_priority",
      type: MaintenanceHistoryType.PRIORITY_CHANGED,
      description: "Priority set to URGENT.",
      maintenanceId: "maintenance_faucet_replacement",
      userId: admin.id,
    },
    {
      id: "maintenance_history_faucet_status",
      type: MaintenanceHistoryType.STATUS_CHANGED,
      description: "Status changed to IN_PROGRESS.",
      maintenanceId: "maintenance_faucet_replacement",
      userId: admin.id,
    },

    {
      id: "maintenance_history_lamp_created",
      type: MaintenanceHistoryType.CREATED,
      description: "Maintenance request created.",
      maintenanceId: "maintenance_bedside_lamp",
      userId: admin.id,
    },

    {
      id: "maintenance_history_window_created",
      type: MaintenanceHistoryType.CREATED,
      description: "Maintenance request created.",
      maintenanceId: "maintenance_window_lock",
      userId: admin.id,
    },
    {
      id: "maintenance_history_window_assigned",
      type: MaintenanceHistoryType.ASSIGNED,
      description: "Maintenance request assigned to Dinis Fragata.",
      maintenanceId: "maintenance_window_lock",
      userId: admin.id,
    },
    {
      id: "maintenance_history_window_status",
      type: MaintenanceHistoryType.STATUS_CHANGED,
      description: "Status changed to IN_PROGRESS.",
      maintenanceId: "maintenance_window_lock",
      userId: admin.id,
    },
    {
      id: "maintenance_history_window_completed",
      type: MaintenanceHistoryType.COMPLETED,
      description: "Maintenance request marked as completed.",
      maintenanceId: "maintenance_window_lock",
      userId: admin.id,
    },

    {
      id: "maintenance_history_tv_created",
      type: MaintenanceHistoryType.CREATED,
      description: "Maintenance request created.",
      maintenanceId: "maintenance_tv_remote",
      userId: admin.id,
    },
    {
      id: "maintenance_history_tv_assigned",
      type: MaintenanceHistoryType.ASSIGNED,
      description: "Maintenance request assigned to Dinis Fragata.",
      maintenanceId: "maintenance_tv_remote",
      userId: admin.id,
    },
    {
      id: "maintenance_history_tv_priority",
      type: MaintenanceHistoryType.PRIORITY_CHANGED,
      description: "Priority set to HIGH.",
      maintenanceId: "maintenance_tv_remote",
      userId: admin.id,
    },
  ];

  for (const history of maintenanceHistoryData) {
    await prisma.maintenanceHistory.upsert({
      where: {
        id: history.id,
      },
      update: history,
      create: history,
    });
  }

  // --------------------------------------------------
  // AI INSIGHTS
  // --------------------------------------------------

  const aiInsightData = [
    {
      id: "ai_guest_preference_204",
      room: "Room 204",
      title: "Guest preference detected",
      text: "Mr. Sterling prefers non-feather pillows. Room service notified.",
      action: "CONFIRM",
      confirmed: false,
    },
    {
      id: "ai_celebration_205",
      room: "Room 205",
      title: "Celebration detected",
      text: "Anniversary celebration. Champagne delivery scheduled for 18:00.",
      action: "SCHEDULED",
      confirmed: true,
    },
    {
      id: "ai_early_arrival_401",
      room: "Room 401",
      title: "Early arrival",
      text: "Guest arriving 45 minutes earlier than originally expected.",
      action: "REVIEW",
      confirmed: false,
    },
    {
      id: "ai_maintenance_risk_302",
      room: "Room 302",
      title: "Maintenance risk",
      text: "Recurring AC issue detected. Consider scheduling a preventive inspection.",
      action: "REVIEW",
      confirmed: false,
    },
  ];

  for (const insight of aiInsightData) {
    await prisma.aIInsight.upsert({
      where: {
        id: insight.id,
      },
      update: insight,
      create: insight,
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created/updated ${rooms.length} rooms.`);
  console.log(`Created/updated ${guests.length} guests.`);
  console.log(`Created/updated ${maintenanceData.length} maintenance requests.`);
  console.log("Created/updated reservations, operations, maintenance history and AI insights.");
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