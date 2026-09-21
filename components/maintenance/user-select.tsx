"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

type UserSelectProps = {
  users: UserOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
};

export default function UserSelect({
  users,
  value,
  onValueChange,
  disabled = false,
  hasError = false,
  placeholder = "Select a user",
}: UserSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedUser = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={[
              "w-full justify-between text-left font-normal",
              !selectedUser && "text-muted-foreground",
              hasError && "border-destructive",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>
              {selectedUser ? selectedUser.name : placeholder}
            </span>

            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent
        align="start"
        className="w-(--anchor-width) p-1"
      >
        <div className="max-h-64 overflow-y-auto">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onValueChange("");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5"
          >
            <span>Unassigned</span>

            {!value && <Check className="size-4 text-primary" />}
          </button>

          {users.map((user) => {
            const isSelected = user.id === value;

            return (
              <button
                key={user.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onValueChange(user.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
              >
                <span>{user.name}</span>

                {isSelected && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}