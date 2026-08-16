import type { FilterFieldConfig } from "@/components/filters/filter-config";
import type { Translate } from "@/i18n/types";

export type CatalogHoReportFilters = {
  catalogNumber: string;
  catalogRevision: string;
  catalogStatus: string;
  catalogType: string;
  priceStartDate: string;
  priceEndDate: string;
};
export const emptyCatalogHoReportFilters: CatalogHoReportFilters = {
  catalogNumber: "",
  catalogRevision: "",
  catalogStatus: "",
  catalogType: "",
  priceStartDate: "",
  priceEndDate: "",
};

export function createCatalogHoReportFilterLabels(
  t: Translate
): Record<keyof CatalogHoReportFilters, string> {
  return {
    catalogNumber: t("reports.catalogHo.filters.catalogNumber"),
    catalogRevision: t("reports.catalogHo.filters.catalogRevision"),
    catalogStatus: t("reports.catalogHo.filters.catalogStatus"),
    catalogType: t("reports.catalogHo.filters.catalogType"),
    priceStartDate: t("reports.catalogHo.filters.priceStartDate"),
    priceEndDate: t("reports.catalogHo.filters.priceEndDate"),
  };
}

export function createCatalogHoReportFilterFields(
  t: Translate
): FilterFieldConfig<CatalogHoReportFilters>[] {
  return [
    {
      kind: "search",
      label: t("reports.catalogHo.filters.catalogNumber"),
      name: "catalogNumber",
      placeholder: t("reports.catalogHo.filters.catalogNumber"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("reports.catalogHo.filters.catalogRevision"),
      name: "catalogRevision",
      placeholder: t("reports.catalogHo.filters.revision"),
      placement: "primary",
    },
    {
      kind: "select",
      label: t("reports.catalogHo.filters.catalogStatus"),
      name: "catalogStatus",
      placeholder: t("reports.catalogHo.filters.allStatuses"),
      placement: "primary",
      options: [
        { label: "Active", value: "Active" },
        { label: "Approved", value: "Approved" },
      ],
    },
    {
      kind: "search",
      label: t("reports.catalogHo.filters.catalogType"),
      name: "catalogType",
      placeholder: t("reports.catalogHo.filters.catalogType"),
      placement: "primary",
    },
    {
      kind: "date",
      label: t("reports.catalogHo.filters.priceStartDate"),
      name: "priceStartDate",
      placeholder: t("reports.catalogHo.filters.priceStartDate"),
      placement: "primary",
    },
    {
      kind: "date",
      label: t("reports.catalogHo.filters.priceEndDate"),
      name: "priceEndDate",
      placeholder: t("reports.catalogHo.filters.priceEndDate"),
      placement: "primary",
    },
  ];
}

export const catalogHoReportFilterFields = createCatalogHoReportFilterFields(
  (key) => key
);
