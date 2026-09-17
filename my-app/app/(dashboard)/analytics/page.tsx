import {
  parseAnalyticsPeriod,
  getPeriodStartDate,
  getPeriodLabel,
} from "@/lib/analytics/filters";

import {
  getRoomsSnapshot,
  getReservationsInPeriod,
  getOperationsInPeriod,
  getMaintenanceRecords,
} from "@/lib/analytics/queries";

import {
  computeOccupancy,
  computeRoomStatusBreakdown,
  computeRevenue,
  computeReservationStats,
  computeReservationBreakdown,
  computeOperationsSummary,
  computeOperationsTrend,
  computeMaintenanceSummary,
} from "@/lib/analytics/metrics";

import AnalyticsPeriodSelector from "@/components/analytics/analytics-period-selector";
import AnalyticsKpiCard from "@/components/analytics/analytics-kpi-card";
import AnalyticsRoomStatusChart from "@/components/analytics/analytics-room-status-chart";
import AnalyticsOperationsTrendChart from "@/components/analytics/analytics-operations-trend-chart";
import AnalyticsReservationBreakdown from "@/components/analytics/analytics-reservation-breakdown";
import AnalyticsMaintenanceSummary from "@/components/analytics/analytics-maintenance-summary";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = parseAnalyticsPeriod(params.period);
  const periodStart = getPeriodStartDate(period);

  const [rooms, reservations, operations, maintenance] = await Promise.all([
    getRoomsSnapshot(),
    getReservationsInPeriod(periodStart),
    getOperationsInPeriod(periodStart),
    getMaintenanceRecords(periodStart),
  ]);

  // ── Metrics ──────────────────────────────────────────────────────────────
  const occupancy = computeOccupancy(rooms);
  const roomStatusBreakdown = computeRoomStatusBreakdown(rooms);
  const revenue = computeRevenue(reservations);
  const reservationStats = computeReservationStats(reservations);
  const reservationBreakdown = computeReservationBreakdown(reservations);
  const operationsSummary = computeOperationsSummary(operations);
  const operationsTrend = computeOperationsTrend(operations, periodStart, period);
  const maintenanceSummary = computeMaintenanceSummary(maintenance, periodStart);

  // ── Avg stay formatting ───────────────────────────────────────────────────
  const avgStayLabel =
    reservationStats.avgStayNights === 0
      ? "—"
      : reservationStats.avgStayNights === 1
        ? "1"
        : String(reservationStats.avgStayNights);

  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Insights
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
              Analytics
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-[1.6]">
              Operational metrics derived from live hotel data.{" "}
              {getPeriodLabel(period).toLowerCase()} period.
            </p>
          </div>

          <div className="shrink-0">
            <AnalyticsPeriodSelector selected={period} />
          </div>
        </div>

        {/* ── KPI Row ───────────────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AnalyticsKpiCard
            label="Occupancy"
            value={String(occupancy.rate)}
            suffix="%"
            description={`${occupancy.occupied} of ${occupancy.total} rooms`}
            highlighted
          />

          <AnalyticsKpiCard
            label="Revenue"
            value={`€${revenue.total}`}
            description={`${revenue.count} eligible reservations`}
          />

          <AnalyticsKpiCard
            label="Reservations"
            value={String(reservationStats.count)}
            description="Excluding cancelled"
          />

          <AnalyticsKpiCard
            label="Avg Stay"
            value={avgStayLabel}
            suffix={reservationStats.avgStayNights !== 0 ? "nights" : undefined}
            description="Based on checked-out stays"
          />
        </div>

        {/* ── Charts Row ────────────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AnalyticsOperationsTrendChart
              data={operationsTrend}
              period={period}
            />
          </div>

          <div className="lg:col-span-2">
            <AnalyticsRoomStatusChart
              breakdown={roomStatusBreakdown}
              total={rooms.length}
            />
          </div>
        </div>

        {/* ── Breakdowns Row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnalyticsReservationBreakdown
            breakdown={reservationBreakdown}
            period={period}
          />

          <AnalyticsMaintenanceSummary
            summary={maintenanceSummary}
            period={period}
          />
        </div>

      </div>
    </section>
  );
}
