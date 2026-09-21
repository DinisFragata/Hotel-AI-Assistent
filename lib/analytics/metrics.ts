import type { AnalyticsPeriod } from "./filters";

// ─── Types inferred from query return shapes ────────────────────────────────

type RoomRecord = {
  id: string;
  number: string;
  status: string;
};

type ReservationRecord = {
  id: string;
  status: string;
  totalPrice: { toNumber: () => number } | number | string;
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
};

type OperationRecord = {
  id: string;
  type: string;
  time: Date;
};

type MaintenanceRecord = {
  id: string;
  status: string;
  priority: string;
  createdAt: Date;
  completedAt: Date | null;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function toNumber(value: ReservationRecord["totalPrice"]): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value);
  return value.toNumber();
}

function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ─── Occupancy ───────────────────────────────────────────────────────────────

export function computeOccupancy(rooms: RoomRecord[]) {
  const total = rooms.length;
  const occupied = rooms.filter((r) => r.status === "OCCUPIED").length;
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
  return { occupied, total, rate };
}

// ─── Room status breakdown ────────────────────────────────────────────────────

const ROOM_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  CLEANING: "Cleaning",
  MAINTENANCE: "Maintenance",
  OUT_OF_ORDER: "Out of Order",
};

export function computeRoomStatusBreakdown(rooms: RoomRecord[]) {
  const total = rooms.length;
  const counts: Record<string, number> = {};

  for (const room of rooms) {
    counts[room.status] = (counts[room.status] ?? 0) + 1;
  }

  const ORDER = [
    "AVAILABLE",
    "OCCUPIED",
    "CLEANING",
    "MAINTENANCE",
    "OUT_OF_ORDER",
  ];

  return ORDER.filter((s) => (counts[s] ?? 0) > 0 || s === "AVAILABLE").map(
    (status) => ({
      status,
      label: ROOM_STATUS_LABELS[status] ?? status,
      count: counts[status] ?? 0,
      percent: total > 0 ? Math.round(((counts[status] ?? 0) / total) * 100) : 0,
    }),
  );
}

// ─── Revenue ─────────────────────────────────────────────────────────────────

export function computeRevenue(reservations: ReservationRecord[]) {
  const eligible = reservations.filter(
    (r) => r.status === "CHECKED_IN" || r.status === "CHECKED_OUT",
  );
  const total = eligible.reduce((sum, r) => sum + toNumber(r.totalPrice), 0);
  return {
    total: total.toFixed(2),
    count: eligible.length,
  };
}

// ─── Reservation stats ────────────────────────────────────────────────────────

export function computeReservationStats(reservations: ReservationRecord[]) {
  const nonCancelled = reservations.filter((r) => r.status !== "CANCELLED");
  const checkedOut = reservations.filter((r) => r.status === "CHECKED_OUT");

  const avgStayNights =
    checkedOut.length > 0
      ? checkedOut.reduce(
          (sum, r) => sum + nightsBetween(r.checkIn, r.checkOut),
          0,
        ) / checkedOut.length
      : 0;

  return {
    count: nonCancelled.length,
    avgStayNights: Math.round(avgStayNights * 10) / 10,
  };
}

// ─── Reservation status breakdown ────────────────────────────────────────────

export function computeReservationBreakdown(reservations: ReservationRecord[]) {
  const counts: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    CHECKED_IN: 0,
    CHECKED_OUT: 0,
    CANCELLED: 0,
  };

  for (const r of reservations) {
    if (r.status in counts) {
      counts[r.status]++;
    }
  }

  return counts as Record<
    "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED",
    number
  >;
}

// ─── Operations summary ───────────────────────────────────────────────────────

export function computeOperationsSummary(operations: OperationRecord[]) {
  const checkIns = operations.filter((o) => o.type === "CHECK_IN").length;
  const checkOuts = operations.filter((o) => o.type === "CHECK_OUT").length;
  return { checkIns, checkOuts };
}

// ─── Operations trend (daily) ─────────────────────────────────────────────────

export function computeOperationsTrend(
  operations: OperationRecord[],
  periodStart: Date,
  period: AnalyticsPeriod,
) {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

  // Build a day-keyed map: "YYYY-MM-DD" → { checkIns, checkOuts }
  const byDay: Record<string, { checkIns: number; checkOuts: number }> = {};

  // Pre-fill every day in the range with zeros
  for (let i = 0; i < days; i++) {
    const d = new Date(periodStart);
    d.setDate(d.getDate() + i);
    const key = formatDay(d);
    byDay[key] = { checkIns: 0, checkOuts: 0 };
  }

  for (const op of operations) {
    const key = formatDay(op.time);
    if (key in byDay) {
      if (op.type === "CHECK_IN") byDay[key].checkIns++;
      else byDay[key].checkOuts++;
    }
  }

  return Object.entries(byDay).map(([date, counts]) => ({
    date,
    label: formatDayLabel(new Date(date + "T12:00:00")),
    ...counts,
  }));
}

function formatDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
}

// ─── Maintenance summary ──────────────────────────────────────────────────────

export function computeMaintenanceSummary(
  maintenance: MaintenanceRecord[],
  periodStart: Date,
) {
  const active = maintenance.filter(
    (m) => m.status === "OPEN" || m.status === "IN_PROGRESS",
  );

  const urgentOrHigh = active.filter(
    (m) => m.priority === "URGENT" || m.priority === "HIGH",
  ).length;

  const completedInPeriod = maintenance.filter(
    (m) =>
      m.status === "COMPLETED" &&
      m.completedAt !== null &&
      m.completedAt >= periodStart,
  ).length;

  return {
    active: active.length,
    urgentOrHigh,
    completedInPeriod,
  };
}
