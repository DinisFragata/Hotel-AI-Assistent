import MaintenanceCard from "@/components/maintenance/maintenance-card";
import MaintenanceRow from "@/components/maintenance/maintenance-row";

import type {
  MaintenanceHistoryType,
} from "@/app/generated/prisma/client";

type MaintenanceResultsProps = {
  maintenance: {
    id: string;
    title: string;
    description: string | null;
    status:
      | "OPEN"
      | "IN_PROGRESS"
      | "COMPLETED";
    priority:
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "URGENT";
    dueDate: Date | null;

    room: {
      id: string;
      number: string;
    } | null;

    assignedTo: {
      id: string;
      name: string;
    } | null;

    history: {
      id: string;
      type: MaintenanceHistoryType;
      description: string;
      createdAt: Date;
      user: {
        name: string;
      } | null;
    }[];
  }[];

  rooms: {
    id: string;
    number: string;
    capacity: number;
    pricePerNight: string;
  }[];

  users: {
    id: string;
    name: string;
  }[];
  
  hasActiveFilters: boolean;
};

export default function MaintenanceResults({
  maintenance,
  rooms,
  users,
  hasActiveFilters,
}: MaintenanceResultsProps) {
  if (maintenance.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h3 className="font-medium">
            {hasActiveFilters
              ? "No maintenance requests found"
              : "No maintenance requests"}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {hasActiveFilters
              ? "Try changing your search or filters."
              : "Maintenance requests will appear here when they are created."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-245 table-fixed text-sm">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[10%]" />
            <col className="w-[13%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[11%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Issue
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Room
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Priority
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Assigned To
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Due Date
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {maintenance.map((item) => (
              <MaintenanceRow
                key={item.id}
                maintenance={item}
                rooms={rooms}
                users={users}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-white/10 md:hidden">
        {maintenance.map((item) => (
          <MaintenanceCard
            key={item.id}
            maintenance={item}
            rooms={rooms}
            users={users}
          />
        ))}
      </div>
    </>
  );
}