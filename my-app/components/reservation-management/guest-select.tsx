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

type GuestOption = {
  id: string;
  name: string;
  email: string | null;
};

type GuestSelectProps = {
  guests: GuestOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
};

export default function GuestSelect({
  guests,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select a guest",
  hasError = false,
}: GuestSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedGuest = guests.find(
    (guest) => guest.id === value,
  );

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return guests;
    }

    return guests.filter((guest) => {
      return (
        guest.name.toLowerCase().includes(query) ||
        guest.email?.toLowerCase().includes(query)
      );
    });
  }, [guests, search]);

  function handleSelect(guestId: string) {
    onValueChange(guestId);
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
                !selectedGuest && "text-muted-foreground",
                hasError && "border-destructive",
            )}
          />
        }
      >
        <span className="min-w-0 flex-1 text-left">
          {selectedGuest ? (
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-foreground">
                {selectedGuest.name}
              </span>

              {selectedGuest.email && (
                <span className="truncate text-xs text-muted-foreground">
                  {selectedGuest.email}
                </span>
              )}
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
            placeholder="Search guests..."
            className="h-8 pl-8"
            autoFocus
          />
        </div>

        <div className="mt-2 max-h-64 overflow-y-auto">
          {guests.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No guests available
            </p>
          ) : filteredGuests.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No matching guests
            </p>
          ) : (
            <div className="space-y-0.5">
              {filteredGuests.map((guest) => {
                const isSelected = guest.id === value;

                return (
                  <button
                    key={guest.id}
                    type="button"
                    onClick={() => handleSelect(guest.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                      "hover:bg-muted",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isSelected && "bg-muted",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {guest.name}
                      </span>

                      {guest.email && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {guest.email}
                        </span>
                      )}
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