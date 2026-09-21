"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import OperationDetailsDialog, {
  type OperationDetails,
} from "@/components/operations/operation-details-dialog";

type OperationDetailsTriggerProps = {
  operation: OperationDetails;
  label?: string;
};

export default function OperationDetailsTrigger({
  operation,
  label = "View details",
}: OperationDetailsTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Eye className="size-3.5" />
        {label}
      </Button>

      <OperationDetailsDialog
        operation={operation}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}