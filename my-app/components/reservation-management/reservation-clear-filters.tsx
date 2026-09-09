"use client";

import { useSearchParams } from "next/navigation";
import { useReservationFilter } from "./reservation-filter-provider";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReservationClearFiltersProps = {
  hasFilters: boolean;
};

export default function ReservationClearFilters({
  hasFilters,
}: ReservationClearFiltersProps) {
  const { navigate } = useReservationFilter();
  const searchParams = useSearchParams();

  if (!hasFilters) {
    return null;
  }

  function handleClearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");
    params.delete("status");
    params.delete("date");

    const queryString = params.toString();

    navigate(
      queryString
        ? `/reservations?${queryString}`
        : "/reservations",
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClearFilters}
      className="h-8 cursor-pointer gap-2 px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <X className="size-4" />
      Clear filters
    </Button>
  );
}