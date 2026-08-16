import type { FilterFieldConfig } from "@/components/filters/filter-config";
import type { Translate } from "@/i18n/types";

export type ContractReportFilters = {
  reportNo: string;
  reportCreatedDate: string;
  priceStartDate: string;
  priceEndDate: string;
};
export const emptyContractReportFilters: ContractReportFilters = {
  reportNo: "",
  reportCreatedDate: "",
  priceStartDate: "",
  priceEndDate: "",
};
export function createContractReportFilterLabels(
  t: Translate
): Record<keyof ContractReportFilters, string> {
  return {
    reportNo: t("common.fields.reportNo"),
    reportCreatedDate: t("common.fields.reportCreatedDate"),
    priceStartDate: t("common.fields.priceStartDate"),
    priceEndDate: t("common.fields.priceEndDate"),
  };
}
export function createContractReportFilterFields(
  t: Translate
): FilterFieldConfig<ContractReportFilters>[] {
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
export const contractPriceDailyReportFilterFields =
  createContractReportFilterFields((key) => key);
