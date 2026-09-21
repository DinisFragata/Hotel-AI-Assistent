"use client";

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

type OperationFilterContextValue = {
  isPending: boolean;
  navigate: (url: string) => void;
};

const OperationFilterContext =
  createContext<OperationFilterContextValue | null>(
    null,
  );

type OperationFilterProviderProps = {
  children: ReactNode;
};

export default function OperationFilterProvider({
  children,
}: OperationFilterProviderProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function navigate(url: string) {
    startTransition(() => {
      router.replace(url);
    });
  }

  return (
    <OperationFilterContext.Provider
      value={{
        isPending,
        navigate,
      }}
    >
      {children}
    </OperationFilterContext.Provider>
  );
}

export function useOperationFilter() {
  const context = useContext(
    OperationFilterContext,
  );

  if (!context) {
    throw new Error(
      "useOperationFilter must be used within OperationFilterProvider",
    );
  }

  return context;
}