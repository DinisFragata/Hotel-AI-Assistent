import ReservationCancelDialog from "@/components/reservation-management/reservation-cancel-dialog";
import ReservationDetailsTrigger from "@/components/reservation-management/reservation-details-trigger";
import ReservationEditDialog from "@/components/reservation-management/reservation-edit-dialog";
import ReservationStatusAction from "@/components/reservation-management/reservation-status-action";
import ReservationStatusBadge from "@/components/reservation-management/reservation-status-badge";

type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

type GuestOption = {
  id: string;
  name: string;
  email: string | null;
};

type RoomOption = {
  id: string;
  number: string;
  capacity: number;
  pricePerNight: string;
};

type ReservationCardProps = {
  reservation: {
    id: string;
    guestId: string;
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    guestsCount: number;
    totalPrice: string;
    status: ReservationStatus;
    guest: {
      firstName: string;
      lastName: string;
      email: string | null;
      phone?: string | null;
    };
    room: {
      number: string;
    };
  };
  guests: GuestOption[];
  rooms: RoomOption[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ReservationCard({
  reservation,
  guests,
  rooms,
}: ReservationCardProps) {
  const reservationDetails = {
    id: reservation.id,

    guestId: reservation.guestId,

    guest: {
      firstName: reservation.guest.firstName,
      lastName: reservation.guest.lastName,
      email: reservation.guest.email,
      phone: reservation.guest.phone ?? null,
    },

    roomId: reservation.roomId,

    room: {
      number: reservation.room.number,
    },

    checkIn: reservation.checkIn.toISOString(),
    checkOut: reservation.checkOut.toISOString(),

    guestsCount: reservation.guestsCount,
    totalPrice: reservation.totalPrice,
    status: reservation.status,
  };

  return (
    <article className="min-w-0 rounded-2xl border border-white/10 bg-white/2.5 p-4 shadow-sm transition-all duration-150 hover:border-white/15 hover:bg-white/4">
      {/* Guest + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-5">
            {reservation.guest.firstName}{" "}
            {reservation.guest.lastName}
          </p>

          {reservation.guest.email && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {reservation.guest.email}
            </p>
          )}
        </div>

        <ReservationStatusBadge
          status={reservation.status}
        />
      </div>

      {/* Main reservation details */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Room
          </p>

          <p className="mt-1.5 text-sm font-medium">
            {reservation.room.number}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Guests
          </p>

          <p className="mt-1.5 font-medium">
            {reservation.guestsCount}{" "}
            {reservation.guestsCount === 1
              ? "guest"
              : "guests"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Check-in
          </p>

          <p className="mt-1.5 text-sm text-muted-foreground">
            {formatDate(reservation.checkIn)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Check-out
          </p>

          <p className="mt-1.5 text-sm text-muted-foreground">
            {formatDate(reservation.checkOut)}
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Total
        </span>

        <span className="text-base font-semibold">
          €{reservation.totalPrice}
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <ReservationDetailsTrigger
          reservation={reservationDetails}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4 [&_button]:min-h-9 [&_button]:px-3">
        {reservation.status !== "CHECKED_OUT" &&
          reservation.status !== "CANCELLED" && (
            <ReservationEditDialog
              reservation={{
                id: reservation.id,
                guestId: reservation.guestId,
                roomId: reservation.roomId,
                checkIn: reservation.checkIn
                  .toISOString()
                  .slice(0, 10),
                checkOut: reservation.checkOut
                  .toISOString()
                  .slice(0, 10),
                guestsCount:
                  reservation.guestsCount,
                status: reservation.status,
              }}
              guests={guests}
              rooms={rooms}
            />
          )}

        {reservation.status === "PENDING" && (
          <>
            <ReservationStatusAction
              reservationId={reservation.id}
              targetStatus="CONFIRMED"
            />

            <ReservationCancelDialog
              reservationId={reservation.id}
              guestName={`${reservation.guest.firstName} ${reservation.guest.lastName}`}
              roomNumber={reservation.room.number}
              checkIn={reservation.checkIn
                .toISOString()
                .slice(0, 10)}
              checkOut={reservation.checkOut
                .toISOString()
                .slice(0, 10)}
              totalPrice={reservation.totalPrice}
            />
          </>
        )}

        {reservation.status === "CONFIRMED" && (
          <>
            <ReservationStatusAction
              reservationId={reservation.id}
              targetStatus="CHECKED_IN"
            />

            <ReservationCancelDialog
              reservationId={reservation.id}
              guestName={`${reservation.guest.firstName} ${reservation.guest.lastName}`}
              roomNumber={reservation.room.number}
              checkIn={reservation.checkIn
                .toISOString()
                .slice(0, 10)}
              checkOut={reservation.checkOut
                .toISOString()
                .slice(0, 10)}
              totalPrice={reservation.totalPrice}
            />
          </>
        )}

        {reservation.status === "CHECKED_IN" && (
          <ReservationStatusAction
            reservationId={reservation.id}
            targetStatus="CHECKED_OUT"
          />
        )}
      </div>
    </article>
  );
}