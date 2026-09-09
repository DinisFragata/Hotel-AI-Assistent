"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Check,
  LogIn,
  LogOut,
} from "lucide-react";

import {
  updateReservationStatus,
  type UpdateReservationStatusState,
} from "@/app/(dashboard)/reservations/actions";

import { Button } from "@/components/ui/button";

type ReservationStatusActionProps = {
  reservationId: string;
  targetStatus: "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT";
};

const initialState: UpdateReservationStatusState = {
  success: false,
  message: "",
};

const actionIcons = {
  CONFIRMED: Check,
  CHECKED_IN: LogIn,
  CHECKED_OUT: LogOut,
} satisfies Record<
  "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT",
  typeof Check
>;

const actionLabels = {
  CONFIRMED: "Confirm",
  CHECKED_IN: "Check In",
  CHECKED_OUT: "Check Out",
} satisfies Record<
  "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT",
  string
>;

const pendingLabels = {
  CONFIRMED: "Confirming...",
  CHECKED_IN: "Checking in...",
  CHECKED_OUT: "Checking out...",
} satisfies Record<
  "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT",
  string
>;

export default function ReservationStatusAction({
  reservationId,
  targetStatus,
}: ReservationStatusActionProps) {
  const router = useRouter();

  const Icon = actionIcons[targetStatus];
  const [state, formAction, isPending] = useActionState(
    updateReservationStatus,
    initialState,
  );

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const label = actionLabels[targetStatus];
  const pendingLabel = pendingLabels[targetStatus];

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="id"
        value={reservationId}
      />

      <input
        type="hidden"
        name="status"
        value={targetStatus}
      />

      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={isPending}
      >
        <Icon />
        {isPending ? pendingLabel : label}
      </Button>
    </form>
  );
}