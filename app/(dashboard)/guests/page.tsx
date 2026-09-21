import { prisma } from "@/lib/prisma";

import GuestsTable from "@/components/guests/guests-table";
import { CreateGuestDialog } from "@/components/guests/create-guest-dialog";
import { GuestSearch } from "@/components/guests/guest-search";

import { parseGuestSearch } from "@/lib/guests/filters";

type GuestsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function GuestsPage({
  searchParams,
}: GuestsPageProps) {
  const params = await searchParams;

  const search = parseGuestSearch(params.search);

  const guests = await prisma.guest.findMany({
    where: search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,

    orderBy: [
      {
        lastName: "asc",
      },
      {
        firstName: "asc",
      },
    ],

    include: {
      _count: {
        select: {
          reservations: true,
        },
      },

      reservations: {
        orderBy: {
          checkIn: "desc",
        },

        select: {
          id: true,
          guestId: true,
          roomId: true,
          checkIn: true,
          checkOut: true,
          guestsCount: true,
          totalPrice: true,
          status: true,

          room: {
            select: {
              id: true,
              number: true,
            },
          },
        },
      },
    },
  });

  return (
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        {/* Page header */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Guest Management
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
            Guests
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-[1.6]">
            Manage guest profiles, contact information and
            reservation history.
          </p>

          <div className="mt-5">
            <CreateGuestDialog />
          </div>
        </div>

        {/* Guests section */}
        <div className="glass-surface overflow-hidden rounded-3xl">
          {/* Section header */}
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Guests
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {guests.length}{" "}
                {guests.length === 1
                  ? "guest"
                  : "guests"}{" "}
                {search
                  ? "matching your search"
                  : "registered"}
              </p>
            </div>

            <GuestSearch />
          </div>

          {guests.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center px-4">
              <div className="max-w-sm text-center">
                <h3 className="font-medium">
                  {search
                    ? "No guests match your search."
                    : "No guests yet."}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {search
                    ? "Try a different name, email or phone number."
                    : "Guests will appear here when they are added."}
                </p>
              </div>
            </div>
          ) : (
            <GuestsTable
              guests={guests.map((guest) => ({
                id: guest.id,
                firstName: guest.firstName,
                lastName: guest.lastName,
                email: guest.email,
                phone: guest.phone,
                preferredLanguage:
                  guest.preferredLanguage,
                preferredRoomType:
                  guest.preferredRoomType,
                specialRequests:
                  guest.specialRequests,
                reservationCount:
                  guest._count.reservations,

                reservations:
                  guest.reservations.map(
                    (reservation) => ({
                      id: reservation.id,
                      guestId:
                        reservation.guestId,
                      roomId:
                        reservation.roomId,
                      roomNumber:
                        reservation.room.number,
                      checkIn:
                        reservation.checkIn.toISOString(),
                      checkOut:
                        reservation.checkOut.toISOString(),
                      guestsCount:
                        reservation.guestsCount,
                      totalPrice:
                        reservation.totalPrice.toFixed(
                          2,
                        ),
                      status:
                        reservation.status,
                    }),
                  ),
              }))}
            />
          )}
        </div>
      </div>
    </section>
  );
}