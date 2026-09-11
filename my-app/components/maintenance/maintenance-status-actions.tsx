"use client";

import {
  useActionState,
  useEffect,
} from "react";

import {
  updateMaintenanceStatus,
  type UpdateMaintenanceStatusState,
} from "@/app/(dashboard)/maintenance/actions";

import { Button } from "@/components/ui/button";

import {
  Check,
  LoaderCircle,
  Play,
  RotateCcw,
} from "lucide-react";

import { toast } from "sonner";

import type { MaintenanceStatus } from "@/app/generated/prisma/client";

const initialState: UpdateMaintenanceStatusState = {
  success: false,
  message: "",
};

type MaintenanceStatusActionsProps = {
  maintenanceId: string;
  status: MaintenanceStatus;
};

export default function MaintenanceStatusActions({
  maintenanceId,
  status,
}: MaintenanceStatusActionsProps) {
  const [state, formAction, isPending] =
    useActionState(
      updateMaintenanceStatus,
      initialState,
    );

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state]);

  if (status === "OPEN") {
    return (
      <form action={formAction}>
        <input
          type="hidden"
          name="id"
          value={maintenanceId}
        />

        <input
          type="hidden"
          name="status"
          value="IN_PROGRESS"
        />

        <Button
          type="submit"
          size="sm"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Play />
          )}

          {isPending ? "Starting..." : "Start Work"}
        </Button>
      </form>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <form action={formAction}>
        <input
          type="hidden"
          name="id"
          value={maintenanceId}
        />

        <input
          type="hidden"
          name="status"
          value="COMPLETED"
        />

        <Button
          type="submit"
          size="sm"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Check />
          )}

          {isPending ? "Completing..." : "Complete"}
        </Button>
      </form>
    );
  }

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="id"
        value={maintenanceId}
      />

      <input
        type="hidden"
        name="status"
        value="OPEN"
      />

      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <RotateCcw />
        )}

        {isPending ? "Reopening..." : "Reopen"}
      </Button>
    </form>
  );
}