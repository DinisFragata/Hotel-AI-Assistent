"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
        <div className="glass-surface w-full rounded-3xl px-6 py-8 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive">
            Room Management
          </p>

          <h1 className="mt-3 text-xl font-semibold tracking-[-0.02em]">
            Unable to load rooms
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Something went wrong while loading the room
            management data.
          </p>

          <div className="mt-6">
            <Button onClick={() => reset()}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}