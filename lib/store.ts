import type { LogEntry } from "@/lib/types"

const _store: LogEntry[] = []

export function addEntry(entry: LogEntry) {
  _store.unshift(entry)
}

export function getEntries(): LogEntry[] {
  return [..._store]
}
