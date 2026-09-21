"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useOperationFilter } from "./operation-filter-provider";

type OperationSearchProps = {
  initialSearch: string;
};

export default function OperationSearch({
  initialSearch,
}: OperationSearchProps) {
  const searchParams = useSearchParams();

  const { navigate } =
    useOperationFilter();

  const [search, setSearch] =
    useState(initialSearch);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (
      trimmedSearch ===
      initialSearch.trim()
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      if (trimmedSearch) {
        params.set(
          "search",
          trimmedSearch,
        );
      } else {
        params.delete("search");
      }

      const queryString = params.toString();

      navigate(
        queryString
          ? `/operations?${queryString}`
          : "/operations",
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    search,
    initialSearch,
    navigate,
    searchParams,
  ]);

  function handleClear() {
    setSearch("");
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search operations..."
          className="h-9 pl-9 pr-9"
          aria-label="Search operations"
          aria-describedby={
            search
              ? "operation-search-status"
              : undefined
          }
        />

        <span
          id="operation-search-status"
          className="sr-only"
          aria-live="polite"
        >
          {search
            ? `Searching operations for ${search}`
            : "Search cleared"}
        </span>

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}