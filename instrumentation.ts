export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const ok = "✅"
    const warn = "⚠️ "
    const lines: string[] = [
      "",
      "┌─────────────────────────────────────────┐",
      "│        Hotel — Config         │",
      "└─────────────────────────────────────────┘",
    ]

    const hasOpenAI = !!process.env.OPENAI_API_KEY
    lines.push(
      `  ${hasOpenAI ? ok : warn} OpenAI       ${hasOpenAI ? "live (gpt-4o-mini)" : "NOT SET — mock mode"}`
    )

    const hasSheets = !!(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_SHEET_ID)
    lines.push(
      `  ${hasSheets ? ok : warn} Google Sheets ${hasSheets ? "connected" : "NOT SET — logs disabled"}`
    )

    const hasSendGrid = !!(
      process.env.SENDGRID_API_KEY &&
      process.env.SENDGRID_FROM_EMAIL &&
      process.env.SENDGRID_TO_EMAIL
    )
    lines.push(
      `  ${hasSendGrid ? ok : warn} SendGrid     ${hasSendGrid ? `emails → ${process.env.SENDGRID_TO_EMAIL}` : "NOT SET — emails disabled"}`
    )

    lines.push("")
    console.log(lines.join("\n"))

    if (hasSheets) {
      const { ensureHeaders } = await import("@/lib/sheets")
      ensureHeaders().catch(() => {})
    }
  }
}
