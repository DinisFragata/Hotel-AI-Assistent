import type { LogEntry } from "@/lib/types"

interface Props {
  rows: LogEntry[]
  completedCount: number
}

export default function StatsBar({ rows, completedCount }: Props) {
  const total = rows.length
  const highPriority = rows.filter((r) => r.priority === "High").length

  let lastActivity = "—"
  if (rows[0]) {
    try {
      lastActivity = new Date(rows[0].timestamp).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      lastActivity = "—"
    }
  }

  const stats = [
    { label: "Total de Pedidos", value: String(total) },
    { label: "Alta Prioridade", value: String(highPriority) },
    { label: "Concluídos", value: String(completedCount) },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
          <p className="text-xs text-slate-500 font-medium">{s.label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  )
}
