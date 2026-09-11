"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Check,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";

import type {
  MaintenancePriority,
  MaintenanceStatus,
} from "@/app/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { maintenancePriorityConfig } from "@/lib/maintenance/priority";
import { maintenanceStatusConfig } from "@/lib/maintenance/status";

type MaintenanceToolbarProps = {
  users: {
    id: string;
    name: string;
  }[];
};

const statuses: MaintenanceStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
];

const priorities: MaintenancePriority[] = [
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
];

export default function MaintenanceToolbar({
  users,
}: MaintenanceToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  );

  const status = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const assignedToId =
    searchParams.get("assignedToId") ?? "";

  const selectedStatus =
    status as MaintenanceStatus | "";

  const selectedPriority =
    priority as MaintenancePriority | "";

  const selectedUser = users.find(
    (user) => user.id === assignedToId,
  );

  const assigneeLabel =
    assignedToId === "unassigned"
      ? "Unassigned"
      : selectedUser?.name ?? "Assigned To";

  const hasFilters =
    Boolean(searchParams.get("search")) ||
    Boolean(status) ||
    Boolean(priority) ||
    Boolean(assignedToId);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const currentSearch =
        searchParams.get("search") ?? "";

      const normalizedSearch = search.trim();

      if (normalizedSearch === currentSearch) {
        return;
      }

      const params = new URLSearchParams(
        searchParams.toString(),
      );

      if (normalizedSearch) {
        params.set("search", normalizedSearch);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        const queryString = params.toString();

        router.replace(
          queryString
            ? `${pathname}?${queryString}`
            : pathname,
        );
      });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    search,
    pathname,
    router,
    searchParams,
  ]);

  function updateFilter(
    key: string,
    value: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      const queryString = params.toString();

      router.replace(
        queryString
          ? `${pathname}?${queryString}`
          : pathname,
      );
    });
  }

  return (
    <div className="border-b border-white/10 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search maintenance requests..."
            className="pl-9 pr-9"
            aria-label="Search maintenance requests"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Status */}
          <Popover>
            <PopoverTrigger
                render={
                    <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="justify-between gap-2 font-normal"
                    >
                    {selectedStatus ? (
                        <span className="flex items-center gap-2">
                        <span
                            className={[
                            "size-1.5 rounded-full",
                            maintenanceStatusConfig[selectedStatus].dot,
                            ].join(" ")}
                        />

                        <span>
                            {maintenanceStatusConfig[selectedStatus].label}
                        </span>
                        </span>
                    ) : (
                        "Status"
                    )}

                    <ChevronsUpDown className="size-4 opacity-50" />
                    </Button>
                }
            />

            <PopoverContent
                align="start"
                className="w-48 p-1"
            >
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                    updateFilter("status", "")
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                >
                    <span>None</span>

                    {!selectedStatus && (
                    <Check className="size-4 text-primary" />
                    )}
                </button>

                {statuses.map((item) => {
                    const config = maintenanceStatusConfig[item];

                    const isSelected =
                    selectedStatus === item;

                    return (
                    <button
                        key={item}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                        updateFilter("status", item)
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <span className="flex items-center gap-2">
                            <span
                                className={[
                                "size-1.5 rounded-full",
                                config.dot,
                                ].join(" ")}
                            />

                            <span>{config.label}</span>
                        </span>

                        {isSelected && (
                        <Check className="size-4 text-primary" />
                        )}
                    </button>
                    );
                })}
            </PopoverContent>
        </Popover>

          {/* Priority */}
          <Popover>
            <PopoverTrigger
                render={
                    <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="justify-between gap-2 font-normal"
                    >
                    {selectedPriority ? (
                        <span className="flex items-center gap-2">
                        <span
                            className={[
                            "size-1.5 rounded-full",
                            maintenancePriorityConfig[selectedPriority].dot,
                            ].join(" ")}
                        />

                        <span>
                            {maintenancePriorityConfig[selectedPriority].label}
                        </span>
                        </span>
                    ) : (
                        "Priority"
                    )}

                    <ChevronsUpDown className="size-4 opacity-50" />
                    </Button>
                }
            />

            <PopoverContent
                align="start"
                className="w-48 p-1"
            >
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                    updateFilter("priority", "")
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                >
                    <span>None</span>

                    {!selectedPriority && (
                    <Check className="size-4 text-primary" />
                    )}
                </button>

                {priorities.map((item) => {
                    const config =
                    maintenancePriorityConfig[item];

                    const isSelected =
                    selectedPriority === item;

                    return (
                    <button
                        key={item}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                        updateFilter("priority", item)
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <span className="flex items-center gap-2">
                            <span
                                className={[
                                "size-1.5 rounded-full",
                                config.dot,
                                ].join(" ")}
                            />

                            <span>{config.label}</span>
                        </span>

                        {isSelected && (
                        <Check className="size-4 text-primary" />
                        )}
                    </button>
                    );
                })}
                </PopoverContent>
          </Popover>

          {/* Assignee */}
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className={[
                    "justify-between gap-2 font-normal",
                    assignedToId &&
                      "border-primary/30 bg-primary/5 text-primary",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {assigneeLabel}

                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              }
            />

            <PopoverContent
                align="start"
                className="w-52 p-1"
            >
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                    updateFilter("assignedToId", "")
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                >
                    <span>None</span>

                    {!assignedToId && (
                    <Check className="size-4 text-primary" />
                    )}
                </button>

                <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                    updateFilter(
                        "assignedToId",
                        "unassigned",
                    )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                >
                    <span>Unassigned</span>

                    {assignedToId === "unassigned" && (
                    <Check className="size-4 text-primary" />
                    )}
                </button>

                {users.map((user) => {
                    const isSelected =
                    user.id === assignedToId;

                    return (
                    <button
                        key={user.id}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                        updateFilter(
                            "assignedToId",
                            user.id,
                        )
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <span>{user.name}</span>

                        {isSelected && (
                        <Check className="size-4 text-primary" />
                        )}
                    </button>
                    );
                })}
                </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-muted-foreground">
              Active filters
            </p>

            {searchParams.get("search") && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                Search: {searchParams.get("search")}
              </span>
            )}

            {selectedStatus && (
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                {maintenanceStatusConfig[selectedStatus].label}
              </span>
            )}

            {selectedPriority && (
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                {maintenancePriorityConfig[selectedPriority].label}
              </span>
            )}

            {assignedToId === "unassigned" && (
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                Unassigned
              </span>
            )}

            {selectedUser && (
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                {selectedUser.name}
              </span>
            )}
          </div>
        </div>
      )}

      {isPending && (
        <p className="mt-3 text-xs text-muted-foreground">
          Updating maintenance...
        </p>
      )}
    </div>
  );
}