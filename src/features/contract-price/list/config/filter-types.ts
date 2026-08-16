import type { ContractPriceListParams } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";
import { formatDateForDisplay } from "@/lib/utils/date-format";

export const emptyContractPriceFilters = {
  search: "",
  itemNo: "",
  itemDescription: "",
  cvCode: "",
  customerName: "",
  number: "",
  type: "",
  startDate: "",
  endDate: "",
  store: "",
  requestedBy: "",
};

export type ContractPriceFiltersState = typeof emptyContractPriceFilters;

export const contractPriceStoreOptions = [
  "0",
  "1",
  "9",
  "14",
  "22",
  "37",
  "38",
  "43",
  "44",
  "57",
  "58",
  "74",
  "500",
];

export function getActiveContractPriceFilters(
  filters: ContractPriceFiltersState,
  t: Translate = (key) => key
) {
  const labels: Record<keyof ContractPriceFiltersState, string> = {
    search: t("common.filters.search"),
    itemNo: t("common.fields.item"),
    itemDescription: t("common.fields.description"),
    cvCode: t("common.fields.cvCode"),
    customerName: t("common.fields.customer"),
    number: t("common.fields.number"),
    type: t("common.fields.type"),
    startDate: t("common.fields.startDate"),
    endDate: t("common.fields.endDate"),
    store: t("common.fields.store"),
    requestedBy: t("common.fields.requestedBy"),
  };

  return (Object.keys(filters) as (keyof ContractPriceFiltersState)[])
    .filter((name) => filters[name])
    .map((name) => ({
      name,
      label: `${labels[name]}: ${formatContractPriceFilterValue(name, filters[name])}`,
    }));
}

export function toContractPriceSearchParams(
  filters: ContractPriceFiltersState
): ContractPriceListParams {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value.trim())
  ) as ContractPriceListParams;
}

function formatContractPriceFilterValue(
  name: keyof ContractPriceFiltersState,
  value: string
) {
  if ((name === "startDate" || name === "endDate") && value) {
    return formatDateForDisplay(value);
  }

  return value;
}
