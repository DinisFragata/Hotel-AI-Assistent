"use client"

import { useState } from "react"
import { CheckCircle, MinusCircle, Check, Circle } from "lucide-react"
import type { LogEntry } from "@/lib/types"
import RequestDetailModal from "@/components/admin/RequestDetailModal"

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
}

const PRIORITY_LABELS: Record<string, string> = {
  High: "Alta",
  Medium: "Média",
  Low: "Baixa",
}

interface Props {
  rows: LogEntry[]
  loading: boolean
  completedTimestamps: Set<string>
  onToggleComplete: (ts: string) => void
}

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

type StatusFilter = "Todos" | "Pendentes" | "Concluídos"

export default function RequestsTable({ rows, loading, completedTimestamps, onToggleComplete }: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [selectedRow, setSelectedRow] = useState<LogEntry | null>(null)

  const filtered = rows.filter((row) => {
    const isCompleted = completedTimestamps.has(row.timestamp)
    if (statusFilter === "Pendentes" && isCompleted) return false
    if (statusFilter === "Concluídos" && !isCompleted) return false
    if (priorityFilter && row.priority !== priorityFilter) return false
    return true
  })

  if (loading && rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-400">A carregar pedidos...</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-400">Ainda não há pedidos. Inicie uma conversa na página do hóspede.</p>
      </div>
    )
  }

  return (
    <>
      {selectedRow && (
        <RequestDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Filter bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/40 flex-wrap">
          <div className="cursor-pointer flex items-center gap-1">
            {(["Todos", "Pendentes", "Concluídos"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="cursor-pointer ml-auto text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 bg-white focus:outline-none focus:border-indigo-400"
          >
            <option value="">Todas as prioridades</option>
            <option value="High">Alta</option>
            <option value="Medium">Média</option>
            <option value="Low">Baixa</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400">Nenhum pedido corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Hora</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Hóspede</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Mensagem</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Pedido</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridade</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Resposta IA</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const isCompleted = completedTimestamps.has(row.timestamp)
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedRow(row)}
                    className={`border-b border-slate-50 last:border-0 transition-colors cursor-pointer ${
                      isCompleted ? "opacity-50 bg-slate-50/50 hover:bg-slate-100/60" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{formatTimestamp(row.timestamp)}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">{row.guestName}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px]">
                      <span title={row.guestMessage}>
                        {row.guestMessage.length > 50 ? row.guestMessage.slice(0, 50) + "…" : row.guestMessage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.request}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[row.priority] ?? "bg-slate-100 text-slate-600"}`}>
                        {PRIORITY_LABELS[row.priority] ?? row.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[220px]">
                      <span title={row.aiReply}>
                        {row.aiReply.length > 60 ? row.aiReply.slice(0, 60) + "…" : row.aiReply}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.emailSent ? (
                        <CheckCircle size={15} className="text-emerald-500 mx-auto" />
                      ) : (
                        <MinusCircle size={15} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleComplete(row.timestamp)}
                        className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer select-none transition-all duration-150 active:scale-95 ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                            : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Check size={11} className="group-hover:hidden" />
                            <span className="group-hover:hidden">Concluído</span>
                            <span className="hidden group-hover:inline">Reabrir</span>
                          </>
                        ) : (
                          <>
                            <Circle size={11} />
                            Concluir
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
