export function parseGuestSearch(
  value: string | string[] | undefined,
) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}