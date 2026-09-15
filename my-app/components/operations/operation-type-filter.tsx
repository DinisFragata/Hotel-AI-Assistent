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

import { useOperationFilter } from "./operation-filter-provider";

const typeFilters = [
  {
    value: "ALL",
    label: "All types",
  },
  {
    value: "CHECK_IN",
    label: "Check-in",
  },
  {
    value: "CHECK_OUT",
    label: "Check-out",
  },
] as const;

type OperationTypeFilterProps = {
  initialType: string;
};

export default function OperationTypeFilter({
  initialType,
}: OperationTypeFilterProps) {
  const searchParams = useSearchParams();
  const { navigate } = useOperationFilter();

  const [open, setOpen] = useState(false);

  const selectedType =
    typeFilters.find(
      (item) => item.value === initialType,
    ) ?? typeFilters[0];

  function handleTypeChange(value: string) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value === "ALL") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/operations?${queryString}`
        : "/operations",
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
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              selectedType.value === "CHECK_IN"
                ? "bg-secondary"
                : selectedType.value === "CHECK_OUT"
                  ? "bg-destructive"
                  : "bg-muted-foreground/30",
            )}
          />

          <span className="truncate">
            {selectedType.label}
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1.5"
      >
        <div className="space-y-0.5">
          {typeFilters.map((type) => {
            const isSelected =
              type.value === selectedType.value;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  handleTypeChange(type.value)
                }
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
                    type.value === "CHECK_IN"
                      ? "bg-secondary"
                      : type.value === "CHECK_OUT"
                        ? "bg-destructive"
                        : "bg-muted-foreground/30",
                  )}
                />

                <span className="flex-1">
                  {type.label}
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