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

import {
  reservationStatusConfig,
  type ReservationStatus,
} from "@/lib/reservations/status";

type StatusFilterOption = {
  value:
    | "ALL"
    | "PENDING"
    | "CONFIRMED"
    | "CHECKED_IN"
    | "CHECKED_OUT"
    | "CANCELLED";
  label: string;
};

const statuses: StatusFilterOption[] = [
  {
    value: "ALL",
    label: "All statuses",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "CHECKED_IN",
    label: "Checked In",
  },
  {
    value: "CHECKED_OUT",
    label: "Checked Out",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

type ReservationStatusFilterProps = {
  initialStatus: string;
};

export default function ReservationStatusFilter({
  initialStatus,
}: ReservationStatusFilterProps) {
  const searchParams = useSearchParams();
  const { navigate } = useReservationFilter();

  const [open, setOpen] = useState(false);

  const selectedStatus = statuses.find( (item) => item.value === initialStatus,) ?? statuses[0];

  const selectedStatusConfig =
    selectedStatus.value === "ALL"
      ? null
      : reservationStatusConfig[
          selectedStatus.value as ReservationStatus
        ];

  function handleStatusChange(value: string) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
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
            className="w-full justify-between gap-3 px-3 font-normal md:w-44"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedStatusConfig ? (
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                selectedStatusConfig.dot,
              )}
            />
          ) : (
            <span className="size-2 shrink-0" />
          )}

          <span className="truncate">
            {selectedStatus.label}
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1.5"
      >
        <div className="space-y-0.5">
          {statuses.map((status) => {
            const config =
              status.value === "ALL"
                ? null
                : reservationStatusConfig[
                    status.value as ReservationStatus
                  ];

            const isSelected =
              status.value === selectedStatus.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  handleStatusChange(status.value)
                }
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  "hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isSelected && "bg-muted",
                )}
              >
                {config ? (
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      config.dot,
                    )}
                  />
                ) : (
                  <span className="size-2 shrink-0" />
                )}

                <span className="flex-1">
                  {status.label}
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