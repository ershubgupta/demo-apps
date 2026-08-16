"use client";

import { ConfigurableListFilters } from "@/components/filters/configurable-list-filters";
import { useTranslations } from "next-intl";
import { createCatalogFilterFields } from "../config/filter-config";
import type { CatalogListPageConfig } from "../config/page-config";
import {
  type CatalogFiltersState,
  emptyCatalogFilters,
  getActiveCatalogFilters,
} from "../config/filter-types";

export function CatalogFilters({
  config,
  filters,
  onApplyFilters,
  onChange,
  onReset,
}: {
  config: CatalogListPageConfig;
  filters: CatalogFiltersState;
  onApplyFilters?: (filters: CatalogFiltersState) => void;
  onChange: (name: keyof CatalogFiltersState, value: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations();
  const filterOptions = {
    showCatalogTypeFilter: config.showCatalogTypeFilter,
  };

  return (
    <ConfigurableListFilters
      activeFilters={getActiveCatalogFilters(filters, t, filterOptions)}
      emptyFilters={emptyCatalogFilters}
      fields={createCatalogFilterFields(t, filterOptions)}
      filters={filters}
      moreGridClassName="mt-3 grid gap-3 border-t border-border pt-3 md:grid-cols-2 xl:grid-cols-5"
      onApplyFilters={onApplyFilters}
      onChange={onChange}
      onReset={onReset}
    />
  );
}
