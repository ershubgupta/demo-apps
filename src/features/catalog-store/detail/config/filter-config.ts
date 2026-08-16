import type { FilterFieldConfig } from "@/components/filters/filter-config";
import { toFilterOptions } from "@/components/filters/filter-config";
import type { Translate } from "@/i18n/types";
import type { DetailTab } from "./tabs";
import type { CatalogStoreDetailFiltersState } from "./filter-types";

export const catalogStoreTierOptions = ["T1", "T5", "T10", "T15", "T20"];

type DetailFilterFieldConfig =
  FilterFieldConfig<CatalogStoreDetailFiltersState> & {
    /** Tabs where this filter is shown. Defaults to all tabs when omitted. */
    tabs?: readonly DetailTab[];
  };

export function getCatalogStoreDetailFilterFields(
  tab: DetailTab,
  t: Translate = (key) => key
): DetailFilterFieldConfig[] {
  const fields: DetailFilterFieldConfig[] = [
    {
      kind: "select",
      name: "tier",
      label: t("common.fields.tiers"),
      placeholder: t("details.filters.selectTier"),
      placement: "more",
      options: toFilterOptions(catalogStoreTierOptions),
    },
    {
      kind: "search",
      name: "itemNo",
      label: t("common.fields.itemCode"),
      placeholder: t("common.fields.itemCode"),
      placement: "more",
      tabs: ["items"],
    },
    {
      kind: "search",
      name: "itemDescription",
      label: t("common.fields.itemDescription"),
      placeholder: t("common.fields.itemDescription"),
      placement: "more",
      tabs: ["items"],
    },
    {
      kind: "search",
      name: "cvCode",
      label: t("common.fields.cvCodeCompact"),
      placeholder: t("common.fields.cvCodeCompact"),
      placement: "more",
      tabs: ["customers"],
    },
    {
      kind: "search",
      name: "mmid",
      label: t("common.fields.mmid"),
      placeholder: t("common.fields.mmid"),
      placement: "more",
      tabs: ["customers"],
    },
    {
      kind: "search",
      name: "customerName",
      label: t("common.fields.customerName"),
      placeholder: t("common.fields.customerName"),
      placement: "more",
      tabs: ["customers"],
    },
  ];
  return fields.filter((field) => !field.tabs || field.tabs.includes(tab));
}
