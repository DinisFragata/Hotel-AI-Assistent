export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export const allowedTransitions: Record<
  ReservationStatus,
  readonly ReservationStatus[]
> = {
  PENDING: [
    "CONFIRMED",
    "CANCELLED",
  ],

  CONFIRMED: [
    "CHECKED_IN",
    "CANCELLED",
  ],

  CHECKED_IN: [
    "CHECKED_OUT",
  ],

  CHECKED_OUT: [],

  CANCELLED: [],
};

export function isValidReservationStatusTransition(
  currentStatus: ReservationStatus,
  nextStatus: ReservationStatus,
) {
  if (currentStatus === nextStatus) {
    return true;
  }

  return allowedTransitions[currentStatus].includes(
    nextStatus,
  );
}

export const reservationStatusConfig: Record<
  ReservationStatus,
  {
    label: string;
    dot: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-yellow-300",
    className:
      "border-yellow-300/20 bg-yellow-300/8 text-yellow-300",
  },

  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-primary",
    className:
      "border-primary/20 bg-primary/8 text-primary",
  },

  CHECKED_IN: {
    label: "Checked In",
    dot: "bg-secondary",
    className:
      "border-secondary/20 bg-secondary/8 text-secondary",
  },

  CHECKED_OUT: {
    label: "Checked Out",
    dot: "bg-muted-foreground",
    className:
      "border-muted-foreground/20 bg-muted/40 text-muted-foreground",
  },

  CANCELLED: {
    label: "Cancelled",
    dot: "bg-destructive",
    className:
      "border-destructive/20 bg-destructive/8 text-destructive",
  },
};