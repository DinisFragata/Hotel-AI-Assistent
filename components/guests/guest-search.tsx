"use client";

import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export function GuestSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";

  const [value, setValue] = useState(currentSearch);

  const [isPending, startTransition] = useTransition();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function navigate(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set("search", nextValue);
    } else {
      params.delete("search");
    }

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setValue(nextValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      navigate(nextValue.trim());
    }, 300);
  }

  function handleClear() {
    setValue("");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    navigate("");
  }

    return (
        <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
            value={value}
            onChange={handleChange}
            placeholder="Search guests..."
            aria-label="Search guests"
            className="h-10 pl-9 pr-9"
            />

            {isPending ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-widest text-primary">
                Updating
            </span>
            ) : value ? (
            <button
                type="button"
                onClick={handleClear}
                disabled={isPending}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
                <X className="size-3.5" />
            </button>
            ) : null}
        </div>
    );
}
