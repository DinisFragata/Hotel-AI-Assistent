"use client";

import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type UserOption = {
  id: string;
  name: string;
};

export default function MaintenanceAssigneeSelect({
  users,
  value,
  onValueChange,
  disabled,
  hasError,
}: {
  users: UserOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const selectedUser = users.find(
    (user) => user.id === value,
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={hasError}
            className={[
              "w-full justify-between font-normal",
              hasError ? "border-destructive" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        }
      >
        <span>
          {selectedUser?.name ?? "Unassigned"}
        </span>

        <ChevronDown />
      </PopoverTrigger>

      <PopoverContent className="w-(--anchor-width) p-1">
        <button
          type="button"
          onClick={() => onValueChange("")}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
        >
          <span>Unassigned</span>

          {!value && <Check />}
        </button>

        {users.map((user) => {
          const isSelected = user.id === value;

          return (
            <button
              key={user.id}
              type="button"
              onClick={() => onValueChange(user.id)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <span>{user.name}</span>

              {isSelected && <Check />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}