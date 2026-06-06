import { google } from "googleapis"
import type { LogEntry } from "@/lib/types"

export const hasSheetsConfig = !!(
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_SHEET_ID
)

const SHEET_RANGE = "DemonstraçãoHotel"

function getAuth() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() })
}

export async function ensureHeaders(): Promise<void> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEET_RANGE}!A1:G1`,
  })
  const firstRow = res.data.values?.[0]
  if (!firstRow || firstRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `${SHEET_RANGE}!A1:G1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["Timestamp", "Hóspede", "Mensagem", "Pedido", "Prioridade", "Resposta IA", "Email Enviado"]],
      },
    })
  }
}

export async function appendRow(entry: LogEntry): Promise<void> {
  const sheets = getSheets()
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEET_RANGE}!A:G`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        entry.timestamp,
        entry.guestName,
        entry.guestMessage,
        entry.request,
        entry.priority,
        entry.aiReply,
        entry.emailSent ? "Yes" : "No",
      ]],
    },
  })
}

export async function getRows(): Promise<LogEntry[]> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEET_RANGE}!A2:G`,
  })

  const rows = res.data.values ?? []
  return rows
    .filter((r) => r[0])
    .map((r) => ({
      timestamp: r[0] ?? "",
      guestName: r[1] ?? "",
      guestMessage: r[2] ?? "",
      request: r[3] ?? "",
      priority: (r[4] ?? "Low") as "High" | "Medium" | "Low",
      aiReply: r[5] ?? "",
      emailSent: r[6] === "Yes",
    }))
    .reverse()
}
