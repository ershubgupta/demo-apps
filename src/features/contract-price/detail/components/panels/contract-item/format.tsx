"use client";

import { cn } from "@/lib/utils/cnName";

/** Formats a GP percent with positive/negative status coloring. */
export function formatGpPercent(value: number) {
  return (
    <span
      className={cn(
        "font-medium",
        value < 0 ? "text-destructive" : "text-status-active"
      )}
    >
      {`${value.toFixed(2)}%`}
    </span>
  );
}
