"use client";

import { useState } from "react";
import {
  LoaderCircle,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { createGuest } from "@/app/(dashboard)/guests/actions";

import { type CreateGuestState } from "@/lib/guests/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreatedGuest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
};

type ReservationQuickGuestProps = {
  onCreated: (guest: CreatedGuest) => void;
  onCancel: () => void;
};

const initialState: CreateGuestState = {
  success: false,
  message: "",
};

export default function ReservationQuickGuest({
  onCreated,
  onCancel,
}: ReservationQuickGuestProps) {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [state, setState] =
    useState<CreateGuestState>(initialState);

  const [isPending, setIsPending] =
    useState(false);

  async function handleCreateGuest() {
    setIsPending(true);

    try {
      const formData = new FormData();

      formData.set("firstName", firstName);
      formData.set("lastName", lastName);
      formData.set("email", email);
      formData.set("phone", phone);

      formData.set("preferredLanguage", "");
      formData.set("preferredRoomType", "");
      formData.set("specialRequests", "");

      const result = await createGuest(
        initialState,
        formData,
      );

      setState(result);

      if (result.success) {
        toast.success(
          "Guest created successfully.",
        );

        if (result.createdGuest) {
          onCreated(result.createdGuest);
        }

        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setState(initialState);

        return;
      }

      if (!result.fieldErrors) {
        toast.error(result.message);
      }
    } catch {
      toast.error(
        "Something went wrong while creating the guest.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="size-4 text-primary" />

            <p className="text-sm font-semibold">
              Create new guest
            </p>
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Add the essential guest information to
            continue with this reservation.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={onCancel}
          disabled={isPending}
          aria-label="Cancel creating guest"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        <fieldset
          disabled={isPending}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* First name */}
            <div className="space-y-2">
              <Label htmlFor="quickGuestFirstName">
                First name{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <Input
                id="quickGuestFirstName"
                name="firstName"
                value={firstName}
                onChange={(event) =>
                  setFirstName(
                    event.target.value,
                  )
                }
                placeholder="e.g. Eleanor"
                aria-invalid={Boolean(
                  state.fieldErrors
                    ?.firstName,
                )}
                className={
                  state.fieldErrors?.firstName
                    ? "border-destructive"
                    : ""
                }
              />

              {state.fieldErrors?.firstName && (
                <p className="text-sm text-destructive">
                  {
                    state.fieldErrors
                      .firstName[0]
                  }
                </p>
              )}
            </div>

            {/* Last name */}
            <div className="space-y-2">
              <Label htmlFor="quickGuestLastName">
                Last name{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <Input
                id="quickGuestLastName"
                name="lastName"
                value={lastName}
                onChange={(event) =>
                  setLastName(
                    event.target.value,
                  )
                }
                placeholder="e.g. Vance"
                aria-invalid={Boolean(
                  state.fieldErrors
                    ?.lastName,
                )}
                className={
                  state.fieldErrors?.lastName
                    ? "border-destructive"
                    : ""
                }
              />

              {state.fieldErrors?.lastName && (
                <p className="text-sm text-destructive">
                  {
                    state.fieldErrors
                      .lastName[0]
                  }
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="quickGuestEmail">
              Email
            </Label>

            <Input
              id="quickGuestEmail"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="e.g. guest@example.com"
              aria-invalid={Boolean(
                state.fieldErrors?.email,
              )}
              className={
                state.fieldErrors?.email
                  ? "border-destructive"
                  : ""
              }
            />

            {state.fieldErrors?.email && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="quickGuestPhone">
              Phone
            </Label>

            <Input
              id="quickGuestPhone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="e.g. +351 912 345 678"
              aria-invalid={Boolean(
                state.fieldErrors?.phone,
              )}
              className={
                state.fieldErrors?.phone
                  ? "border-destructive"
                  : ""
              }
            />

            {state.fieldErrors?.phone && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.phone[0]}
              </p>
            )}
          </div>

          {/* General error */}
          {!state.success &&
            state.message &&
            !state.fieldErrors && (
              <p className="text-sm leading-5 text-destructive">
                {state.message}
              </p>
            )}
        </fieldset>

        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="cursor-pointer"
            onClick={handleCreateGuest}
            disabled={
              isPending ||
              !firstName.trim() ||
              !lastName.trim() ||
              (!email.trim() &&
                !phone.trim())
            }
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus />
                Create guest
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}