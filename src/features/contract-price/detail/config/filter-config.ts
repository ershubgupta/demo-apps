import type { FilterFieldConfig } from "@/components/filters/filter-config";
import type { Translate } from "@/features/i18n/translate";
import {
  CONTRACT_PRICE_STATUS_OPTIONS,
  contractPriceStatusLabelKey,
} from "@/features/contract-price/config/status-config";
import type { DetailTab } from "./tabs";
import type { ContractPriceDetailFiltersState } from "./filter-types";

type DetailFilterFieldConfig =
  FilterFieldConfig<ContractPriceDetailFiltersState> & {
    /** Tabs where this filter is shown. Defaults to all tabs when omitted. */
    tabs?: readonly DetailTab[];
  };

export function getContractPriceDetailFilterFields(
  tab: DetailTab,
  t: Translate = (key) => key
): DetailFilterFieldConfig[] {
  const fields: DetailFilterFieldConfig[] = [
    {
      kind: "dateRange",
      name: "startDate",
      endName: "endDate",
      label: t("details.catalog.periodDate"),
      placeholder: t("details.catalog.selectPeriod"),
      placement: "more",
      tabs: ["contractPrice"],
    },
    {
      kind: "multiSelect",
      name: "status",
      label: t("common.fields.status"),
      placeholder: t("details.filters.statusExample"),
      placement: "more",
      options: CONTRACT_PRICE_STATUS_OPTIONS.map((status) => ({
        label: t(contractPriceStatusLabelKey[status]),
        value: status,
      })),
      tabs: ["contractPrice"],
    },
    {
      kind: "search",
      name: "itemNo",
      label: t("common.fields.item"),
      placeholder: t("common.fields.item"),
      placement: "more",
      tabs: ["contractItem"],
    },
    {
      kind: "search",
      name: "itemDescription",
      label: t("common.fields.itemDescription"),
      placeholder: t("common.fields.itemDescription"),
      placement: "more",
      tabs: ["contractItem"],
    },
    {
      kind: "select",
      name: "salesAtShelfPrice",
      label: t("common.fields.salesAtShelfPrice"),
      placeholder: t("common.filters.select"),
      placement: "more",
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
      tabs: ["contractItem"],
    },
    {
      kind: "search",
      name: "approvedPriceInVat",
      label: t("common.fields.approvedPriceInVat"),
      placeholder: t("common.fields.approvedPriceInVat"),
      placement: "more",
      tabs: ["contractItem"],
    },
  ];
  return fields.filter((field) => !field.tabs || field.tabs.includes(tab));
}
