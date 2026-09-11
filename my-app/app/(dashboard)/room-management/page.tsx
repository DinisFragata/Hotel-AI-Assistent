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
    <section className="relative min-h-screen px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-350">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Property Management
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
              Room Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-[1.6]">
              Manage room inventory, availability and pricing.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <RoomCreateDialog />
          </div>
        </div>

        <div className="glass-surface overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-5 sm:px-6">
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
            <div className="flex min-h-60 items-center justify-center px-4">
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
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
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
                        className="border-b border-white/10 transition-colors duration-150 last:border-0 hover:bg-white/2"
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

              {/* Mobile */}
              <div className="divide-y divide-white/10 md:hidden">
                {roomRows.map((room) => (
                  <div
                    key={room.id}
                    className="px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">
                          Room {room.number}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {room.floor !== null
                            ? `Floor ${room.floor}`
                            : "Floor not specified"}
                        </p>
                      </div>

                      <StatusBadge status={room.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Capacity
                        </p>

                        <p className="mt-1 text-sm">
                          {room.capacity}{" "}
                          {room.capacity === 1
                            ? "guest"
                            : "guests"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Price / Night
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          €{room.pricePerNight}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <RoomEditDialog room={room} />

                      <RoomDeleteDialog
                        roomId={room.id}
                        roomNumber={room.number}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
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
      className:
        "border-primary/20 bg-primary/8 text-primary",
    },

    OCCUPIED: {
      label: "Occupied",
      dot: "bg-secondary",
      className:
        "border-secondary/20 bg-secondary/8 text-secondary",
    },

    CLEANING: {
      label: "Cleaning",
      dot: "bg-yellow-300",
      className:
        "border-yellow-300/20 bg-yellow-300/8 text-yellow-300",
    },

    MAINTENANCE: {
      label: "Maintenance",
      dot: "bg-orange-300",
      className:
        "border-orange-300/20 bg-orange-300/8 text-orange-300",
    },

    OUT_OF_ORDER: {
      label: "Out of Order",
      dot: "bg-destructive",
      className:
        "border-destructive/20 bg-destructive/8 text-destructive",
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