"use client";

import { useState } from "react";
import { History } from "lucide-react";

import type { MaintenanceHistoryType } from "@/app/generated/prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type MaintenanceHistoryItem = {
  id: string;
  type: MaintenanceHistoryType;
  description: string;
  createdAt: Date;
  user: {
    name: string;
  } | null;
};

type MaintenanceHistoryDialogProps = {
  title: string;
  history: MaintenanceHistoryItem[];
};

const historyTypeLabel: Record<
  MaintenanceHistoryType,
  string
> = {
  CREATED: "Created",
  UPDATED: "Updated",
  ASSIGNED: "Assigned",
  UNASSIGNED: "Unassigned",
  STATUS_CHANGED: "Status changed",
  PRIORITY_CHANGED: "Priority changed",
  DUE_DATE_CHANGED: "Due date changed",
  COMPLETED: "Completed",
};

function formatHistoryTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatHistoryDay(date: Date) {
  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(
    yesterday.getDate() - 1,
  );

  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);

  if (
    eventDate.getTime() ===
    today.getTime()
  ) {
    return "Today";
  }

  if (
    eventDate.getTime() ===
    yesterday.getTime()
  ) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function MaintenanceHistoryDialog({
  title,
  history,
}: MaintenanceHistoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
          />
        }
      >
        <History />
        History
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Maintenance History
          </DialogTitle>

          <DialogDescription>
            Activity timeline for{" "}
            <span className="font-medium text-foreground">
              {title}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center">
            <div className="text-center">
              <History className="mx-auto size-5 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No history yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Changes to this request will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-2 left-1.75 top-2 w-px bg-border" />

            <div className="space-y-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 mt-1.5 size-3.75 shrink-0 rounded-full border-2 border-primary bg-background" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="text-sm font-medium">
                        {historyTypeLabel[item.type]}
                      </p>

                      <span className="text-xs text-muted-foreground">
                        {formatHistoryDay(
                          item.createdAt,
                        )}{" "}
                        ·{" "}
                        {formatHistoryTime(
                          item.createdAt,
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>

                    {item.user && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        By {item.user.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}