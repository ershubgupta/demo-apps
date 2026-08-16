import type { FilterFieldConfig } from "@/components/filters/filter-config";
import type { Translate } from "@/i18n/types";
import {
  createCatalogStatusOptions,
  createCatalogTypeOptions,
  type CatalogFiltersState,
} from "./filter-types";

export function createCatalogFilterFields(
  t: Translate,
  options: { showCatalogTypeFilter?: boolean } = {}
): FilterFieldConfig<CatalogFiltersState>[] {
  const fields: FilterFieldConfig<CatalogFiltersState>[] = [
    {
      kind: "search",
      label: t("common.fields.mmid"),
      name: "mmid",
      placeholder: t("common.fields.mmid"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("common.fields.cvCode"),
      name: "cvCode",
      placeholder: t("common.fields.cvCode"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("common.fields.customerName"),
      name: "customerName",
      placeholder: t("common.fields.customerName"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("common.fields.itemNo"),
      name: "itemNo",
      placeholder: t("common.fields.itemNo"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("common.fields.itemDescription"),
      name: "itemDescription",
      placeholder: t("common.fields.itemDescription"),
      placement: "primary",
    },
  ];

  if (options.showCatalogTypeFilter) {
    fields.push({
      kind: "select",
      label: t("common.fields.catalogType"),
      name: "catalogType",
      options: createCatalogTypeOptions(t),
      placeholder: t("common.filters.allCatalogTypes"),
      placement: "more",
    });
  }

  fields.push(
    {
      kind: "search",
      label: t("common.fields.number"),
      name: "number",
      placeholder: t("common.fields.number"),
      placement: "more",
    },
    {
      kind: "search",
      label: t("common.fields.revision"),
      name: "revision",
      placeholder: t("common.fields.revision"),
      placement: "more",
    },
    {
      kind: "date",
      label: t("common.fields.startDate"),
      name: "startDate",
      placeholder: t("common.fields.startDate"),
      placement: "more",
    },
    {
      kind: "date",
      label: t("common.fields.endDate"),
      name: "endDate",
      placeholder: t("common.fields.endDate"),
      placement: "more",
    },
    {
      kind: "date",
      label: t("common.fields.priceStartDate"),
      name: "priceStartDate",
      placeholder: t("common.fields.priceStartDate"),
      placement: "more",
    },
    {
      kind: "date",
      label: t("common.fields.priceEndDate"),
      name: "priceEndDate",
      placeholder: t("common.fields.priceEndDate"),
      placement: "more",
    },
    {
      kind: "search",
      label: t("common.fields.store"),
      name: "store",
      placeholder: t("common.fields.store"),
      placement: "more",
    },
    {
      kind: "select",
      label: t("common.fields.status"),
      name: "status",
      options: createCatalogStatusOptions(t),
      placeholder: t("common.filters.allStatuses"),
      placement: "more",
    }
  );

  return fields;
}

export const catalogFilterFields = createCatalogFilterFields((key) => key);
