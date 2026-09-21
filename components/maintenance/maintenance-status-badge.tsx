import type { MaintenanceStatus } from "@/app/generated/prisma/client";

import { maintenanceStatusConfig } from "@/lib/maintenance/status";

export default function MaintenanceStatusBadge({
  status,
}: {
  status: MaintenanceStatus;
}) {
  const current = maintenanceStatusConfig[status];

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