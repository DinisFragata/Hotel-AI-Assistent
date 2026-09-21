import {
  type ReservationStatus,
  reservationStatusConfig,
} from "@/lib/reservations/status";

type ReservationStatusBadgeProps = {
  status: ReservationStatus;
};

export default function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const current =
    reservationStatusConfig[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5",
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