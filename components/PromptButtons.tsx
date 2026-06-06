"use client"

import { Button } from "@/components/ui/button"

const PROMPTS = [
  { label: "Late check-in", message: "I'll be arriving late tonight around 11pm. Is that okay?" },
  { label: "Parking", message: "Do you have parking available at the hotel?" },
  { label: "Wi-Fi password", message: "What's the Wi-Fi password for my room?" },
  { label: "Breakfast", message: "What time does breakfast start and what's included?" },
  { label: "Extra towels", message: "Could I get some extra towels sent to room 204?" },
  { label: "Pet policy", message: "I'm traveling with a small dog. Is that allowed?" },
  { label: "Airport transfer", message: "Can you arrange an airport transfer for tomorrow morning at 8am?" },
]

interface Props {
  onSelect: (message: string) => void
  disabled: boolean
}

export default function PromptButtons({ onSelect, disabled }: Props) {
  return (
    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Quick questions</p>
      <div className="flex flex-wrap gap-1.5">
        {PROMPTS.map((p) => (
          <Button
            key={p.label}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSelect(p.message)}
            className="h-7 text-xs rounded-full border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all"
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
