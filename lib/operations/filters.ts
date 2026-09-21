export const operationTypes = [
  "CHECK_IN",
  "CHECK_OUT",
] as const;

export const operationDateFilters = [
  "ALL",
  "TODAY",
  "UPCOMING",
  "PAST",
] as const;

export type OperationType =
  (typeof operationTypes)[number];

export type OperationDateFilter =
  (typeof operationDateFilters)[number];

export function parseOperationType(
  value: string | null | undefined,
): OperationType | undefined {
  if (
    value &&
    operationTypes.includes(
      value as OperationType,
    )
  ) {
    return value as OperationType;
  }

  return undefined;
}

export function parseOperationDateFilter(
  value: string | null | undefined,
): OperationDateFilter {
  if (
    value &&
    operationDateFilters.includes(
      value as OperationDateFilter,
    )
  ) {
    return value as OperationDateFilter;
  }

  return "ALL";
}