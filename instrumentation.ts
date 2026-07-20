export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const ok = "✅"
    const warn = "⚠️ "
    const lines: string[] = [
      "",
      "---",
    ]

    const hasOpenAI = !!process.env.OPENAI_API_KEY
    lines.push(
      `  ${hasOpenAI ? ok : warn} OpenAI       ${hasOpenAI ? "live (gpt-4o-mini)" : "NOT SET — mock mode"}`
    )
  }
}