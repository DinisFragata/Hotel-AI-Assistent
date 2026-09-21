"use client";

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type ReservationFilterContextValue = {
  isPending: boolean;
  navigate: (url: string) => void;
};

const ReservationFilterContext =
  createContext<ReservationFilterContextValue | null>(null);

type ReservationFilterProviderProps = {
  children: ReactNode;
};

export default function ReservationFilterProvider({
  children,
}: ReservationFilterProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(url: string) {
    startTransition(() => {
      router.replace(url);
    });
  }

  return (
    <ReservationFilterContext.Provider
      value={{
        isPending,
        navigate,
      }}
    >
      {children}
    </ReservationFilterContext.Provider>
  );
}

export function useReservationFilter() {
  const context = useContext(ReservationFilterContext);

  if (!context) {
    throw new Error(
      "useReservationFilter must be used within ReservationFilterProvider",
    );
  }

  return context;
}