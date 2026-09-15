"use client";

import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type OperationsErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function OperationsError({
  error,
  reset,
}: OperationsErrorProps) {
  console.error(
    "Operations page error:",
    error,
  );

  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto flex min-h-[70vh] max-w-350 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Property Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We couldn&apos;t load the operations
            data. Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 cursor-pointer gap-2"
            onClick={() => reset()}
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}