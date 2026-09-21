"use client";

import { Check, ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import type { MaintenancePriority } from "@/app/generated/prisma/client";

const options: {
  value: MaintenancePriority;
  label: string;
}[] = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
];

export default function MaintenancePrioritySelect({
  value,
  onValueChange,
  disabled,
  hasError,
}: {
  value: MaintenancePriority;
  onValueChange: (value: MaintenancePriority) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const selected = options.find(
    (option) => option.value === value,
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={hasError}
            className={[
              "w-full justify-between font-normal",
              hasError ? "border-destructive" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        }
      >
        <span>{selected?.label ?? "Select priority"}</span>
        <ChevronDown />
      </PopoverTrigger>

      <PopoverContent className="w-(--anchor-width) p-1">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onValueChange(option.value)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <span>{option.label}</span>

              {isSelected && <Check />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}