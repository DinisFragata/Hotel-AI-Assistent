import type { MaintenancePriority } from "@/app/generated/prisma/client";

import { maintenancePriorityConfig } from "@/lib/maintenance/priority";

export default function MaintenancePriorityBadge({
  priority,
}: {
  priority: MaintenancePriority;
}) {
  const config = maintenancePriorityConfig[priority];

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[11px] font-semibold tracking-wide",
        config.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          config.dot,
        ].join(" ")}
      />

      {config.label}
    </span>
  );
}