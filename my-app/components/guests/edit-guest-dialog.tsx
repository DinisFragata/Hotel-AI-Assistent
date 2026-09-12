"use client";

import {
  FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { updateGuest } from "@/app/(dashboard)/guests/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  preferredLanguage: string | null;
  preferredRoomType: string | null;
  specialRequests: string | null;
};

type FieldErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  phone?: string[];
  preferredLanguage?: string[];
  preferredRoomType?: string[];
  specialRequests?: string[];
};

type EditGuestDialogProps = {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditGuestDialog({
  guest,
  open,
  onOpenChange,
}: EditGuestDialogProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setFieldErrors({});

    startTransition(async () => {
      const result = await updateGuest(
        guest.id,
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

      setFieldErrors({});
      onOpenChange(false);

      router.refresh();
    });
  }

  function handleOpenChange(value: boolean) {
    if (isPending) {
      return;
    }

    onOpenChange(value);

    if (!value) {
      setFieldErrors({});
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="w-[calc(100%-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto sm:w-[calc(100%-2rem)] sm:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit guest</DialogTitle>

          <DialogDescription>
            Update the guest&apos;s contact information and
            preferences.
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
                <Label htmlFor="edit-firstName">
                  First name
                </Label>

                <Input
                  id="edit-firstName"
                  name="firstName"
                  defaultValue={guest.firstName}
                  disabled={isPending}
                  aria-invalid={Boolean(
                    fieldErrors.firstName,
                  )}
                />

                {fieldErrors.firstName?.[0] && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.firstName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-lastName">
                  Last name
                </Label>

                <Input
                  id="edit-lastName"
                  name="lastName"
                  defaultValue={guest.lastName}
                  disabled={isPending}
                  aria-invalid={Boolean(
                    fieldErrors.lastName,
                  )}
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
                <Label htmlFor="edit-email">
                  Email
                </Label>

                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={guest.email ?? ""}
                  placeholder="guest@example.com"
                  disabled={isPending}
                  aria-invalid={Boolean(
                    fieldErrors.email,
                  )}
                />

                {fieldErrors.email?.[0] && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">
                  Phone
                </Label>

                <Input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  defaultValue={guest.phone ?? ""}
                  placeholder="+351 912 345 678"
                  disabled={isPending}
                  aria-invalid={Boolean(
                    fieldErrors.phone,
                  )}
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
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-preferredLanguage">
                    Preferred language
                  </Label>

                  <Input
                    id="edit-preferredLanguage"
                    name="preferredLanguage"
                    defaultValue={
                      guest.preferredLanguage ?? ""
                    }
                    disabled={isPending}
                    aria-invalid={Boolean(
                      fieldErrors.preferredLanguage,
                    )}
                  />

                  {fieldErrors.preferredLanguage?.[0] && (
                    <p className="text-sm text-destructive">
                      {
                        fieldErrors.preferredLanguage[0]
                      }
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-preferredRoomType">
                    Preferred room type
                  </Label>

                  <Input
                    id="edit-preferredRoomType"
                    name="preferredRoomType"
                    defaultValue={
                      guest.preferredRoomType ?? ""
                    }
                    disabled={isPending}
                    aria-invalid={Boolean(
                      fieldErrors.preferredRoomType,
                    )}
                  />

                  {fieldErrors.preferredRoomType?.[0] && (
                    <p className="text-sm text-destructive">
                      {
                        fieldErrors.preferredRoomType[0]
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-specialRequests">
                  Special requests
                </Label>

                <Textarea
                  id="edit-specialRequests"
                  name="specialRequests"
                  defaultValue={
                    guest.specialRequests ?? ""
                  }
                  placeholder="Quiet room away from the elevator..."
                  rows={4}
                  disabled={isPending}
                  aria-invalid={Boolean(
                    fieldErrors.specialRequests,
                  )}
                />

                {fieldErrors.specialRequests?.[0] && (
                  <p className="text-sm text-destructive">
                    {
                      fieldErrors.specialRequests[0]
                    }
                  </p>
                )}
              </div>
            </div>
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
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="size-4" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}