"use client";

import {
  ArrowRightFromLine,
  ArrowRightToLine,
  Clock3,
  UserRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ReservationDetailsContent, {
  type ReservationDetailsContentData,
} from "@/components/reservation-management/reservation-details-content";

export type OperationDetails = {
  id: string;
  type: "CHECK_IN" | "CHECK_OUT";

  guestName: string;

  room: {
    number: string;
  };

  time: string;

  reservation: ReservationDetailsContentData | null;
};

type OperationDetailsDialogProps = {
  operation: OperationDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function OperationDetailsDialog({
  operation,
  open,
  onOpenChange,
}: OperationDetailsDialogProps) {
  const isCheckIn =
    operation.type === "CHECK_IN";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[calc(100%-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto sm:w-[calc(100%-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={[
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                isCheckIn
                  ? "bg-secondary/10 text-secondary"
                  : "bg-destructive/10 text-destructive",
              ].join(" ")}
            >
              {isCheckIn ? (
                <ArrowRightToLine className="size-5" />
              ) : (
                <ArrowRightFromLine className="size-5" />
              )}
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-2xl tracking-[-0.03em]">
                {isCheckIn
                  ? "Check-in"
                  : "Check-out"}
              </DialogTitle>

              <DialogDescription className="mt-1">
                Operation details and guest movement
                information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operation context */}
          <section>
            <h2 className="text-sm font-semibold">
              Operation
            </h2>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {isCheckIn ? (
                    <ArrowRightToLine className="size-4" />
                  ) : (
                    <ArrowRightFromLine className="size-4" />
                  )}

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Type
                  </p>
                </div>

                <p
                  className={[
                    "mt-3 text-lg font-semibold",
                    isCheckIn
                      ? "text-secondary"
                      : "text-destructive",
                  ].join(" ")}
                >
                  {isCheckIn
                    ? "Check-in"
                    : "Check-out"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Time
                  </p>
                </div>

                <p className="mt-3 text-lg font-semibold">
                  {formatTime(operation.time)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Guest
                  </p>
                </div>

                <p className="mt-3 text-lg font-semibold">
                  {operation.guestName}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Guest associated with this
                  operation
                </p>
              </div>
            </div>
          </section>

          {/* Reservation */}
          {operation.reservation ? (
            <section>
              <h2 className="text-sm font-semibold">
                Reservation
              </h2>

              <div className="mt-3">
                <ReservationDetailsContent
                  reservation={
                    operation.reservation
                  }
                  showGuest={false}
                />
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-sm font-semibold">
                Reservation
              </h2>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/2 p-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  This operation does not have a
                  linked reservation. It may be a
                  historical record created before
                  reservation integration was added.
                </p>
              </div>
            </section>
          )}

          {/* Context */}
          <section>
            <h2 className="text-sm font-semibold">
              Context
            </h2>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/2 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {isCheckIn
                  ? "This operation records a guest check-in for the assigned room."
                  : "This operation records a guest check-out from the assigned room."}
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}