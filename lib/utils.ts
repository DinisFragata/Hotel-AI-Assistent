import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const euroFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
})

// e.g. 2965 -> "€2,965.00"
export function formatEuro(value: number | string) {
  return euroFormatter.format(Number(value))
}
