import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool, isStepCount, type UIMessage } from "ai";
import { z } from "zod";

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
  computeOperationsSummary,
  computeMaintenanceSummary,
} from "@/lib/analytics/metrics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 30);
  periodStart.setHours(0, 0, 0, 0);

  const [rooms, reservations, operations, maintenance] = await Promise.all([
    getRoomsSnapshot(),
    getReservationsInPeriod(periodStart),
    getOperationsInPeriod(periodStart),
    getMaintenanceRecords(periodStart),
  ]);

  const occupancy = computeOccupancy(rooms);
  const roomBreakdown = computeRoomStatusBreakdown(rooms);
  const revenue = computeRevenue(reservations);
  const reservationStats = computeReservationStats(reservations);
  const operationsSummary = computeOperationsSummary(operations);
  const maintenanceSummary = computeMaintenanceSummary(maintenance, periodStart);

  const roomsByStatus = rooms.reduce<Record<string, string[]>>((acc, r) => {
    (acc[r.status] ??= []).push(r.number);
    return acc;
  }, {});
  const roomListText = Object.entries(roomsByStatus)
    .map(([s, nums]) => `${s} (${nums.length}): ${nums.join(", ")}`)
    .join("\n");

  const system = `You are an AI operations assistant for a hotel. You have access to real-time hotel data shown below. Be analytical — note trends, flag concerns, give actionable recommendations. Only answer questions related to hotel operations.

CURRENT HOTEL STATE:
- Total rooms: ${occupancy.total}
- Occupancy: ${occupancy.occupied}/${occupancy.total} (${occupancy.rate}%)

ROOMS BY STATUS:
${roomListText}

LAST 30 DAYS:
- Revenue: €${revenue.total} (${revenue.count} qualifying reservations)
- Check-ins: ${operationsSummary.checkIns}, Check-outs: ${operationsSummary.checkOuts}
- Active reservations (non-cancelled): ${reservationStats.count}
- Avg length of stay: ${reservationStats.avgStayNights} nights

MAINTENANCE:
- Active requests: ${maintenanceSummary.active} (${maintenanceSummary.urgentOrHigh} urgent or high priority)
- Completed in last 30 days: ${maintenanceSummary.completedInPeriod}

FORMATTING RULES:
Use ** around critical numbers and key metrics (e.g. **7 urgent** requests, **46%** occupancy).
Use ## to introduce each major section (e.g. ## Occupancy, ## Maintenance, ## Revenue).
Always use tools to show data visually — do not list numbers as plain text when a tool can show them better.
When someone asks which specific rooms have a given status, call showRoomList with those room numbers.
For the initial operational summary: call showMetricCards first with the top KPIs, then showRoomStatusChart, then showMaintenanceSummary, then provide analytical commentary with insights and any recommendations.`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system,
    messages: await convertToModelMessages(messages),
    tools: {
      showMetricCards: tool({
        description: "Display a row of KPI metric cards for key operational numbers.",
        inputSchema: z.object({
          metrics: z.array(
            z.object({
              label: z.string(),
              value: z.string(),
              suffix: z.string().optional(),
              description: z.string().optional(),
              highlighted: z.boolean().optional(),
            }),
          ),
        }),
        execute: async ({ metrics }) => ({ metrics }),
      }),
      showRoomStatusChart: tool({
        description: "Display a donut chart of the current room status distribution.",
        inputSchema: z.object({}),
        execute: async () => ({ breakdown: roomBreakdown, total: rooms.length }),
      }),
      showRoomList: tool({
        description: "Display a visual grid of room number badges, color-coded by status.",
        inputSchema: z.object({
          rooms: z.array(z.object({ number: z.string(), status: z.string() })),
          title: z.string().optional(),
        }),
        execute: async ({ rooms: roomsInput, title }) => ({ rooms: roomsInput, title }),
      }),
      showMaintenanceSummary: tool({
        description: "Display a maintenance statistics summary card.",
        inputSchema: z.object({}),
        execute: async () => ({
          summary: {
            active: maintenanceSummary.active,
            urgentOrHigh: maintenanceSummary.urgentOrHigh,
            completedInPeriod: maintenanceSummary.completedInPeriod,
          },
        }),
      }),
    },
    stopWhen: isStepCount(5),
  });

  return result.toUIMessageStreamResponse();
}
