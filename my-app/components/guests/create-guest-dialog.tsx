"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { createGuest } from "@/app/(dashboard)/guests/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FieldErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  phone?: string[];
  preferredLanguage?: string[];
  preferredRoomType?: string[];
  specialRequests?: string[];
};

export function CreateGuestDialog() {
  const [open, setOpen] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] =
    useState(false);

  const [isPending, startTransition] = useTransition();

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setFieldErrors({});

    startTransition(async () => {
      const result = await createGuest(
        {
          success: false,
          message: "",
        },
        formData,
      );

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      formRef.current?.reset();
      setFieldErrors({});
      setShowAdditionalDetails(false);
      setOpen(false);
    });
  }

  function handleOpenChange(value: boolean) {
    if (isPending) {
      return;
    }

    setOpen(value);

    if (!value) {
      formRef.current?.reset();
      setFieldErrors({});
      setShowAdditionalDetails(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            <Plus className="size-4" />
            New Guest
          </Button>
        }
      />

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create guest</DialogTitle>

          <DialogDescription>
            Add a guest using their basic contact information.
            Additional details can be added later.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Essential information */}

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>

                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Eleanor"
                  autoFocus
                  disabled={isPending}
                  aria-invalid={Boolean(fieldErrors.firstName)}
                />

                {fieldErrors.firstName?.[0] && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.firstName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>

                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Vance"
                  disabled={isPending}
                  aria-invalid={Boolean(fieldErrors.lastName)}
                />

                {fieldErrors.lastName?.[0] && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="guest@example.com"
                  disabled={isPending}
                  aria-invalid={Boolean(fieldErrors.email)}
                />

                {fieldErrors.email?.[0] && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+351 912 345 678"
                  disabled={isPending}
                  aria-invalid={Boolean(fieldErrors.phone)}
                />

                {fieldErrors.phone?.[0] && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.phone[0]}
                  </p>
                )}
              </div>
            </div>

            {!fieldErrors.email?.[0] &&
              fieldErrors.phone?.[0] ===
                "Email or phone number is required." && (
                <p className="text-sm text-destructive">
                  Email or phone number is required.
                </p>
              )}
          </div>

          {/* Additional details */}

          <div className="border-t border-border/60 pt-4">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between text-sm font-medium transition-colors hover:text-foreground"
              onClick={() =>
                setShowAdditionalDetails((current) => !current)
              }
              disabled={isPending}
            >
              <span>Additional details</span>

              <span className="text-muted-foreground">
                {showAdditionalDetails ? "Hide" : "Optional"}
              </span>
            </button>

            {showAdditionalDetails && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">
                      Preferred language
                    </Label>

                    <Input
                      id="preferredLanguage"
                      name="preferredLanguage"
                      placeholder="English"
                      disabled={isPending}
                      aria-invalid={Boolean(
                        fieldErrors.preferredLanguage,
                      )}
                    />

                    {fieldErrors.preferredLanguage?.[0] && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.preferredLanguage[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredRoomType">
                      Preferred room type
                    </Label>

                    <Input
                      id="preferredRoomType"
                      name="preferredRoomType"
                      placeholder="Double"
                      disabled={isPending}
                      aria-invalid={Boolean(
                        fieldErrors.preferredRoomType,
                      )}
                    />

                    {fieldErrors.preferredRoomType?.[0] && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.preferredRoomType[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">
                    Special requests
                  </Label>

                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Quiet room away from the elevator..."
                    rows={4}
                    disabled={isPending}
                    aria-invalid={Boolean(
                      fieldErrors.specialRequests,
                    )}
                  />

                  {fieldErrors.specialRequests?.[0] && (
                    <p className="text-sm text-destructive">
                      {fieldErrors.specialRequests[0]}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create guest
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}