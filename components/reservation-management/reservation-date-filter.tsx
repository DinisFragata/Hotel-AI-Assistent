"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useReservationFilter } from "./reservation-filter-provider";

const dateFilters = [
  {
    value: "ALL",
    label: "All dates",
  },
  {
    value: "UPCOMING",
    label: "Upcoming",
  },
  {
    value: "TODAY",
    label: "Today",
  },
  {
    value: "PAST",
    label: "Past",
  },
] as const;

type ReservationDateFilterProps = {
  initialDate: string;
};

export default function ReservationDateFilter({
  initialDate,
}: ReservationDateFilterProps) {
  const searchParams = useSearchParams();
  const { navigate } = useReservationFilter();

  const [open, setOpen] = useState(false);

  const selectedDate = dateFilters.find( (item) => item.value === initialDate, ) ?? dateFilters[0];

  function handleDateChange(value: string) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value === "ALL") {
      params.delete("date");
    } else {
      params.set("date", value);
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/reservations?${queryString}`
        : "/reservations",
    );

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
            className="w-full justify-between gap-3 px-3 font-normal md:w-40"
          />
        }
      >
        <span className="truncate">
          {selectedDate.label}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1.5"
      >
        <div className="space-y-0.5">
          {dateFilters.map((date) => {
            const isSelected =
              date.value === selectedDate.value;

            return (
              <button
                key={date.value}
                type="button"
                onClick={() =>
                  handleDateChange(date.value)
                }
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  "hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isSelected && "bg-muted",
                )}
              >
                <span className="flex-1">
                  {date.label}
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