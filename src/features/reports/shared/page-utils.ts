"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import type { ActiveFilter } from "@/components/filters/responsive-filter-shell";
import { POLL_INTERVAL_MS } from "@/constant";
import { useTranslations } from "next-intl";

export function getActiveFilters<TFilters extends Record<string, string>>(
  filters: TFilters,
  labels: Record<keyof TFilters, string>
): ActiveFilter[] {
  return (Object.keys(filters) as (keyof TFilters)[])
    .filter((key) => filters[key])
    .map((key) => ({
      name: String(key),
      label: labels[key] + ": " + filters[key],
    }));
}

export function getFilterUpdates<TFilters extends Record<string, string>>(
  emptyFilters: TFilters,
  nextFilters: TFilters
) {
  return Object.fromEntries(
    (Object.keys(emptyFilters) as (keyof TFilters)[]).map((key) => [
      key,
      nextFilters[key] || null,
    ])
  ) as Partial<Record<keyof TFilters, string | null>>;
}

export function useReportPolling({
  hasPending,
  pollUntil,
  setPollUntil,
  refetch,
}: {
  hasPending: boolean;
  pollUntil: number | null;
  setPollUntil: (value: number | null) => void;
  refetch: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    if (!pollUntil || !hasPending) return;
    const interval = window.setInterval(() => {
      if (Date.now() > pollUntil) {
        window.clearInterval(interval);
        setPollUntil(null);
        toast.info(t("reports.common.processingTimeout"));
        return;
      }
      refetch();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [hasPending, pollUntil, refetch, setPollUntil, t]);
}
