export type AnalyticsPeriod = "7d" | "30d" | "90d";

const VALID_PERIODS: AnalyticsPeriod[] = ["7d", "30d", "90d"];

export function parseAnalyticsPeriod(
  param: string | undefined,
): AnalyticsPeriod {
  if (param && (VALID_PERIODS as string[]).includes(param)) {
    return param as AnalyticsPeriod;
  }
  return "30d";
}

export function getPeriodStartDate(period: AnalyticsPeriod): Date {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getPeriodLabel(period: AnalyticsPeriod): string {
  return period === "7d"
    ? "Last 7 days"
    : period === "30d"
      ? "Last 30 days"
      : "Last 90 days";
}
