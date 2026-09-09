"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  placeholder?: string;
  hasError?: boolean;
};

export default function RoomSelect({
  rooms,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select a room",
  hasError = false,
}: RoomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedRoom = rooms.find(
    (room) => room.id === value,
  );

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rooms;
    }

    return rooms.filter((room) => {
      return (
        room.number.toLowerCase().includes(query) ||
        room.capacity.toString().includes(query) ||
        room.pricePerNight.toLowerCase().includes(query)
      );
    });
  }, [rooms, search]);

  function handleSelect(roomId: string) {
    onValueChange(roomId);
    setSearch("");
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={hasError}
            className={cn(
              "h-auto min-h-8 w-full justify-between gap-3 px-3 py-2 font-normal",
              !selectedRoom && "text-muted-foreground",
              hasError && "border-destructive",
            )}
          />
        }
      >
        <span className="min-w-0 flex-1 text-left">
          {selectedRoom ? (
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-foreground">
                Room {selectedRoom.number}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {selectedRoom.capacity}{" "}
                {selectedRoom.capacity === 1
                  ? "guest"
                  : "guests"}{" "}
                · €{selectedRoom.pricePerNight}/night
              </span>
            </span>
          ) : (
            placeholder
          )}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-2"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search rooms..."
            className="h-8 pl-8"
            autoFocus
          />
        </div>

        <div className="mt-2 max-h-64 overflow-y-auto">
          {rooms.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No rooms available
            </p>
          ) : filteredRooms.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No matching rooms
            </p>
          ) : (
            <div className="space-y-0.5">
              {filteredRooms.map((room) => {
                const isSelected = room.id === value;

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleSelect(room.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                      "hover:bg-muted",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isSelected && "bg-muted",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        Room {room.number}
                      </span>

                      <span className="block truncate text-xs text-muted-foreground">
                        {room.capacity}{" "}
                        {room.capacity === 1
                          ? "guest"
                          : "guests"}{" "}
                        · €{room.pricePerNight}/night
                      </span>
                    </span>

                    {isSelected && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}