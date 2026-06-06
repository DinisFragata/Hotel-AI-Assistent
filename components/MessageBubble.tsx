"use client"

import { useEffect, useState } from "react"
import type { Message } from "@/lib/types"

interface Props {
  message: Message
  animate?: boolean
  variant?: "light" | "dark"
}

export default function MessageBubble({ message, animate = false, variant = "light" }: Props) {
  const [mounted, setMounted] = useState(!animate)

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setMounted(true), 20)
      return () => clearTimeout(t)
    }
  }, [animate])

  const isUser = message.role === "user"
  const dark = variant === "dark"

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 transition-all duration-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {!isUser && (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-auto flex-shrink-0 ${
            dark
              ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
              : "bg-gradient-to-br from-blue-500 to-violet-600 text-white"
          }`}
        >
          A
        </div>
      )}
      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            dark
              ? isUser
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-[#27272a] border border-white/5 text-[#f4f4f5] rounded-tl-sm"
              : isUser
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-slate-100 text-slate-800 rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>
        <span className={`text-[11px] mt-1 px-1 ${dark ? "text-zinc-500" : "text-slate-400"}`}>
          {message.timestamp}
        </span>
      </div>
    </div>
  )
}
