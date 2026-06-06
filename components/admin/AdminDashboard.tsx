"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, LayoutDashboard } from "lucide-react"
import type { LogEntry } from "@/lib/types"
import StatsBar from "@/components/admin/StatsBar"
import RequestsTable from "@/components/admin/RequestsTable"

export default function AdminDashboard() {
  const [rows, setRows] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [completedTimestamps, setCompletedTimestamps] = useState<Set<string>>(new Set())

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/rows")
      const { rows: data } = await res.json()
      setRows(data ?? [])
      setLastUpdated(new Date())
      setSecondsAgo(0)
    } catch {
      // keep existing rows
    } finally {
      setLoading(false)
    }
  }, [])

  const handleToggleComplete = useCallback((ts: string) => {
    setCompletedTimestamps((prev) => {
      const next = new Set(prev)
      if (next.has(ts)) next.delete(ts)
      else next.add(ts)
      return next
    })
  }, [])

  useEffect(() => {
    fetchRows()
    const interval = setInterval(fetchRows, 30000)
    return () => clearInterval(interval)
  }, [fetchRows])

  useEffect(() => {
    if (!lastUpdated) return
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [lastUpdated])

  const updatedText = !lastUpdated ? "—" : secondsAgo < 5 ? "agora mesmo" : `há ${secondsAgo}s`

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="px-4 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              VS
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">Hotel</div>
              <div className="text-[10px] text-slate-400">Operações IA</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-indigo-50 rounded-lg">
            <LayoutDashboard size={14} className="text-indigo-600 flex-shrink-0" />
            <span className="text-sm font-medium text-indigo-700">Painel</span>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-xs text-slate-500">Monitorização em tempo real</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-slate-900">Pedidos dos Hóspedes</h1>
            <p className="text-xs text-slate-400 mt-0.5">Atualizado {updatedText}</p>
          </div>
          <button
            onClick={fetchRows}
            disabled={loading}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <StatsBar rows={rows} completedCount={completedTimestamps.size} />
          <RequestsTable
            rows={rows}
            loading={loading}
            completedTimestamps={completedTimestamps}
            onToggleComplete={handleToggleComplete}
          />
        </div>
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 py-1 flex-shrink-0">
          Desenvolvido por Dinis Fragata
        </p>
      </div>
    </div>
  )
}
