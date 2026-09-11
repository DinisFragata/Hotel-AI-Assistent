"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type RoomOption = {
  id: string;
  number: string;
  capacity: number;
  pricePerNight: string;
};

type RoomSelectProps = {
  rooms: RoomOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
};

export default function RoomSelect({
  rooms,
  value,
  onValueChange,
  disabled = false,
  hasError = false,
  placeholder = "Select a room",
}: RoomSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedRoom = rooms.find((room) => room.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={[
              "w-full justify-between text-left font-normal",
              !selectedRoom && "text-muted-foreground",
              hasError && "border-destructive",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>
              {selectedRoom
                ? `Room ${selectedRoom.number}`
                : placeholder}
            </span>

            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent
        align="start"
        className="w-[var(--anchor-width)] p-1"
      >
        <div className="max-h-64 overflow-y-auto">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onValueChange("");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5"
          >
            <span>No room assigned</span>

            {!value && <Check className="size-4 text-primary" />}
          </button>

          {rooms.map((room) => {
            const isSelected = room.id === value;

            return (
              <button
                key={room.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onValueChange(room.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
              >
                <div>
                  <p className="text-sm font-medium">
                    Room {room.number}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Capacity {room.capacity} · €
                    {Number(room.pricePerNight).toFixed(2)}/night
                  </p>
                </div>

                {isSelected && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}