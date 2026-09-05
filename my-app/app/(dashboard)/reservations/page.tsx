import { prisma } from "@/lib/prisma";
import ReservationCreateDialog from "@/components/reservation-management/reservation-create-dialog";
import ReservationEditDialog from "@/components/reservation-management/reservation-edit-dialog";

export default async function ReservationsPage() {
  const [reservations, guests, rooms] = await Promise.all([
    prisma.reservation.findMany({
      include: {
        guest: true,
        room: true,
      },
      orderBy: {
        checkIn: "asc",
      },
    }),

    prisma.guest.findMany({
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    }),

    prisma.room.findMany({
      orderBy: {
        number: "asc",
      },
    }),
  ]);

  const reservationRows = reservations.map((reservation) => ({
    ...reservation,
    totalPrice: reservation.totalPrice.toFixed(2),
    checkInInput: formatInputDate(reservation.checkIn),
    checkOutInput: formatInputDate(reservation.checkOut),
  }));

  const guestOptions = guests.map((guest) => ({
    id: guest.id,
    name: `${guest.firstName} ${guest.lastName}`,
    email: guest.email,
  }));

  const roomOptions = rooms.map((room) => ({
    id: room.id,
    number: room.number,
    capacity: room.capacity,
    pricePerNight: room.pricePerNight.toFixed(2),
  }));

  const reservationEditRows = reservations.map((reservation) => ({
    id: reservation.id,
    guestId: reservation.guestId,
    roomId: reservation.roomId,
    checkIn: formatInputDate(reservation.checkIn),
    checkOut: formatInputDate(reservation.checkOut),
    guestsCount: reservation.guestsCount,
    status: reservation.status,
  }));

  return (
    <section className="relative min-h-screen px-10 pb-10 pt-10">
      <div className="mx-auto max-w-350">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Property Management
            </p>

            <h1 className="text-[42px] font-semibold tracking-[-0.04em]">
              Reservations
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-[1.6] text-muted-foreground">
              Manage guest reservations, booking dates and reservation
              status.
            </p>
          </div>

          <ReservationCreateDialog
            guests={guestOptions}
            rooms={roomOptions}
          />
        </div>

        <div className="glass-surface overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold">
                Reservations
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {reservationRows.length}{" "}
                {reservationRows.length === 1
                  ? "reservation"
                  : "reservations"}{" "}
                registered
              </p>
            </div>
          </div>

          {reservationRows.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="max-w-sm text-center">
                <h3 className="font-medium">
                  No reservations yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create your first reservation to start managing
                  hotel bookings.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Guest
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Room
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Check-in
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Check-out
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Guests
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Status
                    </th>
                    <th className="w-32 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reservationRows.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-b border-white/10 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {reservation.guest.firstName}{" "}
                            {reservation.guest.lastName}
                          </p>

                          {reservation.guest.email && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {reservation.guest.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {reservation.room.number}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {formatDate(reservation.checkIn)}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {formatDate(reservation.checkOut)}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {reservation.guestsCount}{" "}
                        {reservation.guestsCount === 1
                          ? "guest"
                          : "guests"}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        €{reservation.totalPrice}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={reservation.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <ReservationEditDialog
                            reservation={{
                              id: reservation.id,
                              guestId: reservation.guestId,
                              roomId: reservation.roomId,
                              checkIn: reservation.checkInInput,
                              checkOut: reservation.checkOutInput,
                              guestsCount: reservation.guestsCount,
                              status: reservation.status,
                            }}
                            guests={guestOptions}
                            rooms={roomOptions}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function StatusBadge({
  status,
}: {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "CHECKED_IN"
    | "CHECKED_OUT"
    | "CANCELLED";
}) {
  const config = {
    PENDING: {
      label: "Pending",
      dot: "bg-yellow-300",
      className:
        "border-yellow-300/20 bg-yellow-300/8 text-yellow-300",
    },

    CONFIRMED: {
      label: "Confirmed",
      dot: "bg-primary",
      className:
        "border-primary/20 bg-primary/8 text-primary",
    },

    CHECKED_IN: {
      label: "Checked In",
      dot: "bg-secondary",
      className:
        "border-secondary/20 bg-secondary/8 text-secondary",
    },

    CHECKED_OUT: {
      label: "Checked Out",
      dot: "bg-muted-foreground",
      className:
        "border-muted-foreground/20 bg-muted/40 text-muted-foreground",
    },

    CANCELLED: {
      label: "Cancelled",
      dot: "bg-destructive",
      className:
        "border-destructive/20 bg-destructive/8 text-destructive",
    },
  };

  const current = config[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[11px] font-semibold tracking-wide",
        current.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          current.dot,
        ].join(" ")}
      />

      {current.label}
    </span>
  );
}