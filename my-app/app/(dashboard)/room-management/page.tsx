import { prisma } from "@/lib/prisma";

import RoomCreateDialog from "@/components/room-management/room-create-dialog";
import RoomDeleteDialog from "@/components/room-management/room-delete-dialog";
import RoomEditDialog from "@/components/room-management/room-edit-dialog";

export default async function RoomManagementPage() {
  const rooms = await prisma.room.findMany({
    orderBy: {
      number: "asc",
    },
  });

  const roomRows = rooms.map((room) => ({
    ...room,
    pricePerNight: room.pricePerNight.toFixed(2),
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
              Room Management
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-[1.6] text-muted-foreground">
              Manage room inventory, availability and pricing.
            </p>
          </div>

          <RoomCreateDialog />
        </div>

        <div className="glass-surface overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold">
                Rooms
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {roomRows.length}{" "}
                {roomRows.length === 1 ? "room" : "rooms"} registered
              </p>
            </div>
          </div>

          {roomRows.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="max-w-sm text-center">
                <h3 className="font-medium">
                  No rooms yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create your first room to start managing
                  your hotel inventory.
                </p>

                <div className="mt-5">
                  <RoomCreateDialog />
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Room
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Floor
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Capacity
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Price / Night
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Status
                    </th>

                    <th className="w-45 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {roomRows.map((room) => (
                    <tr
                      key={room.id}
                      className="border-b border-white/10 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium">
                          {room.number}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {room.floor ?? "—"}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {room.capacity}{" "}
                        {room.capacity === 1
                          ? "guest"
                          : "guests"}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        €{room.pricePerNight}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={room.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <RoomEditDialog room={room} />

                          <RoomDeleteDialog
                            roomId={room.id}
                            roomNumber={room.number}
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

function StatusBadge({
  status,
}: {
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "CLEANING"
    | "MAINTENANCE"
    | "OUT_OF_ORDER";
}) {
  const config = {
    AVAILABLE: {
      label: "Available",
      dot: "bg-primary",
      className: "border-primary/20 bg-primary/8 text-primary",
    },

    OCCUPIED: {
      label: "Occupied",
      dot: "bg-secondary",
      className: "border-secondary/20 bg-secondary/8 text-secondary",
    },

    CLEANING: {
      label: "Cleaning",
      dot: "bg-yellow-300",
      className: "border-yellow-300/20 bg-yellow-300/8 text-yellow-300",
    },

    MAINTENANCE: {
      label: "Maintenance",
      dot: "bg-orange-300",
      className: "border-orange-300/20 bg-orange-300/8 text-orange-300",
    },

    OUT_OF_ORDER: {
      label: "Out of Order",
      dot: "bg-destructive",
      className: "border-destructive/20 bg-destructive/8 text-destructive",
    },
  };

  const current = config[status];

  return (
    <span
      className={[
        "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[11px] font-semibold tracking-wide",
        "transition-all duration-200",
        current.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full transition-transform duration-200",
          "group-hover:scale-125",
          current.dot,
        ].join(" ")}
      />

      {current.label}
    </span>
  );
}