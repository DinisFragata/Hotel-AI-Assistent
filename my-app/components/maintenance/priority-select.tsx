"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import type { MaintenancePriority } from "@/app/generated/prisma/client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { maintenancePriorityConfig } from "@/lib/maintenance/priority";

type PrioritySelectProps = {
  value: MaintenancePriority;
  onValueChange: (value: MaintenancePriority) => void;
  disabled?: boolean;
  hasError?: boolean;
};

const priorities: MaintenancePriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export default function PrioritySelect({
  value,
  onValueChange,
  disabled = false,
  hasError = false,
}: PrioritySelectProps) {
  const [open, setOpen] = useState(false);

  const selected = maintenancePriorityConfig[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={[
              "w-full justify-between font-normal",
              hasError && "border-destructive",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{selected.label}</span>

            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        }
      />

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1"
      >
        <div className="space-y-1">
          {priorities.map((priority) => {
            const config = maintenancePriorityConfig[priority];
            const isSelected = priority === value;

            return (
              <button
                key={priority}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onValueChange(priority);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
              >
                <span>{config.label}</span>

                {isSelected && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}