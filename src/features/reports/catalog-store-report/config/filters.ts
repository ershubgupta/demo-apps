import type { FilterFieldConfig } from "@/components/filters/filter-config";
import type { Translate } from "@/i18n/types";

export type CatalogStoreReportFilters = {
  reportNo: string;
  reportCreatedDate: string;
  catalogNumber: string;
  catalogType: string;
  priceStartDate: string;
  priceEndDate: string;
};
export const emptyCatalogStoreReportFilters: CatalogStoreReportFilters = {
  reportNo: "",
  reportCreatedDate: "",
  catalogNumber: "",
  catalogType: "",
  priceStartDate: "",
  priceEndDate: "",
};
export function createCatalogStoreReportFilterLabels(
  t: Translate
): Record<keyof CatalogStoreReportFilters, string> {
  return {
    reportNo: t("common.fields.reportNo"),
    reportCreatedDate: t("common.fields.reportCreatedDate"),
    catalogNumber: t("common.fields.catalogNumber"),
    catalogType: t("common.fields.catalogType"),
    priceStartDate: t("common.fields.priceStartDate"),
    priceEndDate: t("common.fields.priceEndDate"),
  };
}
export function createCatalogStoreReportFilterFields(
  t: Translate
): FilterFieldConfig<CatalogStoreReportFilters>[] {
  return [
    {
      kind: "search",
      label: t("common.fields.reportNo"),
      name: "reportNo",
      placeholder: t("common.fields.reportNo"),
      placement: "primary",
    },
    {
      kind: "date",
      label: t("common.fields.reportCreatedDate"),
      name: "reportCreatedDate",
      placeholder: t("common.fields.reportCreatedDate"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("common.fields.catalogNumber"),
      name: "catalogNumber",
      placeholder: t("common.fields.catalogNumber"),
      placement: "primary",
    },
    {
      kind: "search",
      label: t("common.fields.catalogType"),
      name: "catalogType",
      placeholder: t("common.fields.catalogType"),
      placement: "primary",
    },
    {
      kind: "date",
      label: t("common.fields.priceStartDate"),
      name: "priceStartDate",
      placeholder: t("common.fields.priceStartDate"),
      placement: "primary",
    },
    {
      kind: "date",
      label: t("common.fields.priceEndDate"),
      name: "priceEndDate",
      placeholder: t("common.fields.priceEndDate"),
      placement: "primary",
    },
  ];
}
export const catalogStoreReportFilterFields =
  createCatalogStoreReportFilterFields((key) => key);
