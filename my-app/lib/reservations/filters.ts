export const reservationStatuses = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
] as const;

export type ReservationFilterStatus =
  (typeof reservationStatuses)[number];

export const reservationDateFilters = [
  "UPCOMING",
  "TODAY",
  "PAST",
] as const;

export type ReservationDateFilter =
  (typeof reservationDateFilters)[number];

export function parseReservationStatus(
  value: string | undefined,
) {
  if (
    value &&
    reservationStatuses.includes(
      value as ReservationFilterStatus,
    )
  ) {
    return value as ReservationFilterStatus;
  }

  return null;
}

export function parseReservationDateFilter(
  value: string | undefined,
) {
  if (
    value &&
    reservationDateFilters.includes(
      value as ReservationDateFilter,
    )
  ) {
    return value as ReservationDateFilter;
  }

  return null;
}