export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export type Ticket = {
  guest: string
  request: string
  priority: "High" | "Medium" | "Low"
  status: "Open"
  time: string
}

export type BehindState = {
  summary: string
  tickets: Ticket[]
  email: string
  notifications: string[]
}

export type LogEntry = {
  timestamp: string
  guestName: string
  guestMessage: string
  request: string
  priority: "High" | "Medium" | "Low"
  aiReply: string
  emailSent: boolean
}

export const formatTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

export const emptyBehind: BehindState = {
  summary: "",
  tickets: [],
  email: "",
  notifications: [],
}
