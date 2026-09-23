"use client";

import { useSyncExternalStore } from "react";

function formatDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("weekday")}, ${get("day")} of ${get("month")} ${get("year")}`;
}

// Re-check every minute so the date rolls over at midnight.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

const getClientDate = () => formatDate(new Date());
const getServerDate = () => " ";

// Computed in the browser so it always shows the viewer's current date,
// not the date the page was built/deployed.
export default function CurrentDate() {
  const date = useSyncExternalStore(subscribe, getClientDate, getServerDate);
  return <span>{date}</span>;
}
