import { NextResponse } from "next/server"
import { getRows, hasSheetsConfig } from "@/lib/sheets"
import { getEntries } from "@/lib/store"
import { MOCK_LOG_ROWS } from "@/lib/prompts"

export async function GET() {
  const storeRows = getEntries()

  if (hasSheetsConfig) {
    try {
      const sheetsRows = await getRows()
      const seen = new Set(sheetsRows.map((r) => r.timestamp))
      const merged = [...sheetsRows, ...storeRows.filter((r) => !seen.has(r.timestamp))]
      return NextResponse.json({ rows: merged, lastUpdated: new Date().toISOString() })
    } catch {
      return NextResponse.json({ rows: storeRows, lastUpdated: new Date().toISOString() })
    }
  }

  // No Sheets config — pure demo mode
  return NextResponse.json({ rows: storeRows.length ? storeRows : MOCK_LOG_ROWS, lastUpdated: new Date().toISOString() })
}
