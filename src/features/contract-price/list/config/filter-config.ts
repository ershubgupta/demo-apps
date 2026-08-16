import type { FilterFieldConfig } from "@/components/filters/filter-config";
import { toFilterOptions } from "@/components/filters/filter-config";
import type { Translate } from "@/i18n/types";
import {
  contractPriceStoreOptions,
  type ContractPriceFiltersState,
} from "./filter-types";

export function createContractPriceFilterFields(
  t: Translate
): FilterFieldConfig<ContractPriceFiltersState>[] {
  return [
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
      label: t("common.fields.number"),
      name: "number",
      placeholder: t("common.fields.number"),
      placement: "more",
    },
    {
      kind: "select",
      label: t("common.fields.type"),
      name: "type",
      options: [
        { label: "HO", value: "HO" },
        { label: "B2B", value: "B2B" },
        { label: "SGM", value: "SGM" },
        { label: "Other", value: "Other" },
      ],
      placeholder: t("common.filters.select"),
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
      kind: "select",
      label: t("common.fields.store"),
      name: "store",
      options: toFilterOptions(contractPriceStoreOptions),
      placeholder: t("common.filters.search"),
      placement: "more",
    },
    {
      kind: "search",
      label: t("common.fields.requestedBy"),
      name: "requestedBy",
      placeholder: t("common.fields.requestedBy"),
      placement: "more",
    },
  ];
}

export const contractPriceFilterFields = createContractPriceFilterFields(
  (key) => key
);
