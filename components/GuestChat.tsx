"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import type { Message } from "@/lib/types"
import { formatTime } from "@/lib/types"
import MessageBubble from "@/components/MessageBubble"

const QUICK_PROMPTS = [
  { label: "Check-in tardio", message: "Vou chegar por volta das 23h, há problema?" },
  { label: "Estacionamento", message: "O hotel tem estacionamento disponível?" },
  { label: "Palavra-passe Wi-Fi", message: "Qual é a palavra-passe do Wi-Fi?" },
  { label: "Pequeno-almoço", message: "A que horas é o pequeno-almoço e o que está incluído?" },
  { label: "Toalhas extra", message: "É possível enviar uma toalha extra para o quarto 204?" },
  { label: "Animais", message: "Viajo com um cão pequeno. É permitido?" },
  { label: "Transfer aeroporto", message: "Eu preciso de um transfer para o aeroporto na quarta feira às 8h, é possível?" },
]

const INITIAL_MESSAGE = "Olá! Em que lhe posso ser útil?"

export default function GuestChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      { id: "0", role: "assistant", content: INITIAL_MESSAGE, timestamp: formatTime() },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  async function sendMessage(content: string) {
    if (!content.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: formatTime(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInputValue("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, message: content }),
      })
      const { reply, ticket } = await res.json()

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: formatTime(),
      }

      const finalMessages = [...updatedMessages, assistantMsg]
      setMessages(finalMessages)
      setIsTyping(false)

      // Fire-and-forget: log to Google Sheets + send email
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: "",
          guestMessage: content,
          request: ticket.request,
          priority: ticket.priority,
          aiReply: reply,
          messages: finalMessages,
        }),
      }).catch(() => {})
    } catch {
      setIsTyping(false)
    }
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col px-6 sm:px-10 py-5">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 min-h-0 gap-3">

        {/* Chat card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Header */}
          <div className="flex items-center px-5 h-14 border-b border-gray-100 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
              D
            </div>
            <div>
              <div className="text-gray-900 text-sm font-semibold">Chatbot</div>
              <div className="text-gray-400 text-[11px]">Demonstração12</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-gray-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                animate={i === messages.length - 1 && msg.role === "assistant" && i > 0}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                  D
                </div>
                <div className="px-4 py-3 bg-slate-100 border border-gray-200 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex-shrink-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Perguntas rápidas</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  disabled={isTyping}
                  onClick={() => sendMessage(p.message)}
                  className="cursor-pointer flex-shrink-0 px-3 py-1.5 text-xs rounded-full border border-gray-300 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-3">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(inputValue)
                  }
                }}
                placeholder="Faça uma pergunta..."
                disabled={isTyping}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-colors disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="cursor-pointer w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 py-1 flex-shrink-0">
          Desenvolvido por Dinis Fragata
        </p>

      </div>
    </div>
  )
}
