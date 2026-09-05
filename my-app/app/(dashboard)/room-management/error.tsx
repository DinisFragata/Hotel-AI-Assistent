"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <main className="p-6 md:p-8">
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Unable to load rooms</CardTitle>

            <CardDescription>
              Something went wrong while loading the room
              management data.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button onClick={() => reset()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}