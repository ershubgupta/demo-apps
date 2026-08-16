import type { Translate } from "@/i18n/types";
import type { DetailTab } from "./tabs";
import { getCatalogStoreDetailFilterFields } from "./filter-config";

export const emptyCatalogStoreDetailFilters = {
  tier: "",
  itemNo: "",
  itemDescription: "",
  cvCode: "",
  mmid: "",
  customerName: "",
};

export type CatalogStoreDetailFiltersState =
  typeof emptyCatalogStoreDetailFilters;

/**
 * Active filter chips for the current tab only.
 */
export function getActiveCatalogStoreDetailFilters(
  filters: CatalogStoreDetailFiltersState,
  tab: DetailTab = "items",
  t: Translate = (key) => key
) {
  const visibleFields = getCatalogStoreDetailFilterFields(tab, t);
  const visibleNames = new Set(visibleFields.map((field) => field.name));
  const labels = Object.fromEntries(
    visibleFields.map((field) => [field.name, field.label])
  ) as Record<keyof CatalogStoreDetailFiltersState, string>;

  return (Object.keys(filters) as (keyof CatalogStoreDetailFiltersState)[])
    .filter((name) => visibleNames.has(name) && filters[name])
    .map((name) => ({
      name,
      label: `${labels[name]}: ${filters[name]}`,
    }));
}
