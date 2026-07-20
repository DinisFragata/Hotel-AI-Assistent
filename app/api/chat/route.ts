import { NextRequest, NextResponse } from "next/server"
import { getOpenAI, hasApiKey } from "@/lib/openai"
import {
  CHAT_SYSTEM_PROMPT,
  TICKET_SYSTEM_PROMPT,
  getMockResponse,
} from "@/lib/prompts"
import type { Message } from "@/lib/types"

export async function POST(request: NextRequest) {
  let userMessage = ""

  try {
    const { messages, message }: { messages: Message[]; message: string } =
      await request.json()
    userMessage = message

    if (!hasApiKey) {
      const mock = getMockResponse(message)
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))
      return NextResponse.json({
        reply: mock.reply,
        ticket: { request: mock.request, priority: mock.priority },
      })
    }


    const history = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))

    const client = getOpenAI()
    const [chatRes, ticketRes] = await Promise.all([
      client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 200,
        temperature: 0.7,
        messages: [
          { role: "system", content: CHAT_SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message },
        ],
      }),
      client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 60,
        temperature: 0,
        messages: [
          { role: "system", content: TICKET_SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message },
        ],
      }),
    ])

    const reply =
      chatRes.choices[0]?.message?.content ?? "I'm here to help! Could you repeat that?"

    let ticket = { request: "Guest inquiry", priority: "Low" as const }
    try {
      const raw = ticketRes.choices[0]?.message?.content ?? "{}"
      const parsed = JSON.parse(raw)
      ticket = {
        request: parsed.request ?? "Guest inquiry",
        priority: parsed.priority ?? "Low",
      }
    } catch {
      // keep default ticket
    }

    return NextResponse.json({ reply, ticket })
  } catch {
    // Fall back to mock responses — demo works even without a valid API key
    const mock = getMockResponse(userMessage)
    await new Promise((r) => setTimeout(r, 700))
    return NextResponse.json({
      reply: mock.reply,
      ticket: { request: mock.request, priority: mock.priority },
    })
  }
}
