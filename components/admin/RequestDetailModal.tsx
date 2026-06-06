"use client"

import { useEffect } from "react"
import { X, CheckCircle, MinusCircle } from "lucide-react"
import type { LogEntry } from "@/lib/types"

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-red-50 text-red-600 border border-red-200",
  Medium: "bg-amber-50 text-amber-600 border border-amber-200",
  Low: "bg-emerald-50 text-emerald-600 border border-emerald-200",
}

const PRIORITY_LABELS: Record<string, string> = {
  High: "Alta",
  Medium: "Média",
  Low: "Baixa",
}

interface Props {
  row: LogEntry
  onClose: () => void
}

function formatFull(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch {
    return iso
  }
}

export default function RequestDetailModal({ row, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{row.request}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{formatFull(row.timestamp)}</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0 ml-4"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                {row.guestName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700">{row.guestName}</span>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${PRIORITY_STYLES[row.priority] ?? "bg-slate-100 text-slate-600"}`}>
              Prioridade {PRIORITY_LABELS[row.priority] ?? row.priority}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              {row.emailSent
                ? <><CheckCircle size={13} className="text-emerald-500" /> Email enviado</>
                : <><MinusCircle size={13} className="text-slate-300" /> Email não enviado</>
              }
            </div>
          </div>

          {/* Guest message */}
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Mensagem do Hóspede</p>
            <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed border border-slate-100">
              {row.guestMessage}
            </div>
          </div>

          {/* AI reply */}
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Resposta do Chatbot</p>
            <div className="bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-900 leading-relaxed border border-indigo-100">
              {row.aiReply}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
