export type MaintenanceDueDateState =
  | "OVERDUE"
  | "DUE_TODAY"
  | "DUE_SOON"
  | null;

export function formatMaintenanceDueDate(
  date: Date | null,
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getMaintenanceDueDateState(
  date: Date | null,
  completed = false,
): MaintenanceDueDateState {
  if (!date || completed) {
    return null;
  }

  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const due = new Date(date);
  due.setHours(0, 0, 0, 0);

  if (due < today) {
    return "OVERDUE";
  }

  if (due.getTime() === today.getTime()) {
    return "DUE_TODAY";
  }

  const daysUntilDue =
    Math.round(
      (due.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );

  if (daysUntilDue <= 2) {
    return "DUE_SOON";
  }

  return null;
}

export function getMaintenanceDueDateLabel(
  state: MaintenanceDueDateState,
) {
  switch (state) {
    case "OVERDUE":
      return "Overdue";

    case "DUE_TODAY":
      return "Due today";

    case "DUE_SOON":
      return "Due soon";

    default:
      return null;
  }
}