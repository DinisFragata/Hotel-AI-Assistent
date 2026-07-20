import { NextRequest, NextResponse } from "next/server"
import { getOpenAI, hasApiKey } from "@/lib/openai"
import { EMAIL_SYSTEM_PROMPT, buildMockEmail } from "@/lib/prompts"
import { appendRow, hasSheetsConfig } from "@/lib/sheets"
import { sendOpsEmail, hasSendGridConfig } from "@/lib/sendgrid"
import { addEntry } from "@/lib/store"
import type { Message, LogEntry } from "@/lib/types"

function buildConversationText(messages: Message[]) {
  return messages
    .map((m) => `${m.role === "user" ? "Guest" : "Chatbot"}: ${m.content}`)
    .join("\n")
}

export async function POST(request: NextRequest) {
  try {
    const {
      guestName,
      guestMessage,
      request: reqSummary,
      priority,
      aiReply,
      messages,
    }: {
      guestName: string
      guestMessage: string
      request: string
      priority: "High" | "Medium" | "Low"
      aiReply: string
      messages: Message[]
    } = await request.json()

    // Generate email draft
    let subject: string
    let body: string

    if (hasApiKey) {
      try {
        const conversation = buildConversationText(messages)
        const res = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 180,
          temperature: 0.4,
          messages: [
            { role: "system", content: EMAIL_SYSTEM_PROMPT },
            { role: "user", content: `Guest: ${guestName}\nConversation:\n${conversation}` },
          ],
        })
        const emailText = res.choices[0]?.message?.content ?? ""
        const subjectMatch = emailText.match(/^Subject: (.+)$/m)
        subject = subjectMatch?.[1] ?? `Guest Request — ${reqSummary}`
        body = emailText.replace(/^Subject: .+\n\n?/, "")
      } catch (e){
        const mock = buildMockEmail(guestMessage, reqSummary)
        subject = mock.subject
        body = mock.body
      }
    } else {
      const mock = buildMockEmail(guestMessage, reqSummary)
      subject = mock.subject
      body = mock.body
    }

    // Send email first so we know the status before logging to Sheets
    const emailSent = hasSendGridConfig
      ? await sendOpsEmail(subject, body)
      : false

    console.log(
      `[log] request="${reqSummary}" priority=${priority} | email=${emailSent ? "sent" : hasSendGridConfig ? "FAILED" : "disabled"} | sheets=${hasSheetsConfig ? "saving" : "disabled"}`
    )

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      guestName,
      guestMessage,
      request: reqSummary,
      priority,
      aiReply,
      emailSent,
    }

    addEntry(entry)

    if (hasSheetsConfig) {
      await appendRow(entry)
    }

    return NextResponse.json({ logged: hasSheetsConfig, emailSent })
  } catch {
    return NextResponse.json({ logged: false, emailSent: false })
  }
}
