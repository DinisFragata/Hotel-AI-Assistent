"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DashboardError({
  reset,
}: DashboardErrorProps) {
  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto flex min-h-[60vh] max-w-350 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Unable to load the dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Something went wrong while loading the
            property data. Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={reset}
            className="mt-6"
          >
            <RefreshCw />
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}