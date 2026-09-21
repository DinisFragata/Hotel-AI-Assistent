"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  reservationStatusConfig,
  type ReservationStatus,
} from "@/lib/reservations/status";

type StatusSelectProps = {
  value: ReservationStatus;
  onValueChange: (value: ReservationStatus) => void;
  allowedStatuses: ReservationStatus[];
  disabled?: boolean;
  hasError?: boolean;
};

export default function StatusSelect({
  value,
  onValueChange,
  allowedStatuses,
  disabled = false,
  hasError = false,
}: StatusSelectProps) {
  const [open, setOpen] = useState(false);

  const current = reservationStatusConfig[value];

  function handleSelect(status: ReservationStatus) {
    onValueChange(status);
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={hasError}
            className={cn(
              "w-full justify-between gap-3 px-3 font-normal",
              hasError && "border-destructive",
            )}
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              current.dot,
            )}
          />

          <span className="truncate">
            {current.label}
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1.5"
      >
        <div className="space-y-0.5">
          {allowedStatuses.map((status) => {
            const config =
              reservationStatusConfig[status];

            const isSelected = status === value;

            return (
              <button
                key={status}
                type="button"
                onClick={() => handleSelect(status)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  "hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isSelected && "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    config.dot,
                  )}
                />

                <span className="flex-1">
                  {config.label}
                </span>

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