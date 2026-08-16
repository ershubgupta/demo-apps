"use client";

import { ConfigurableListFilters } from "@/components/filters/configurable-list-filters";
import { useTranslations } from "next-intl";
import { createContractPriceFilterFields } from "../config/filter-config";
import {
  type ContractPriceFiltersState,
  emptyContractPriceFilters,
  getActiveContractPriceFilters,
} from "../config/filter-types";

export function ContractPriceFilters({
  filters,
  onApplyFilters,
  onChange,
  onReset,
}: {
  filters: ContractPriceFiltersState;
  onApplyFilters?: (filters: ContractPriceFiltersState) => void;
  onChange: (name: keyof ContractPriceFiltersState, value: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations();

  return (
    <ConfigurableListFilters
      activeFilters={getActiveContractPriceFilters(filters, t)}
      emptyFilters={emptyContractPriceFilters}
      fields={createContractPriceFilterFields(t)}
      filters={filters}
      onApplyFilters={onApplyFilters}
      onChange={onChange}
      onReset={onReset}
    />
  );
}
