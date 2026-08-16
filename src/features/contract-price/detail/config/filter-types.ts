import type { Translate } from "@/features/i18n/translate";
import { formatDateForDisplay } from "@/lib/utils/date-format";
import type { DetailTab } from "./tabs";
import { getContractPriceDetailFilterFields } from "./filter-config";

export const emptyContractPriceDetailFilters = {
  startDate: "",
  endDate: "",
  status: "",
  itemNo: "",
  itemDescription: "",
  salesAtShelfPrice: "",
  approvedPriceInVat: "",
};

export type ContractPriceDetailFiltersState =
  typeof emptyContractPriceDetailFilters;

/** Synthetic chip id for the combined period date range filter. */
export const PERIOD_DATE_FILTER_CHIP = "periodDate";

/**
 * Active filter chips for the current tab only.
 * Period start/end are shown as a single "Period date" chip.
 */
export function getActiveContractPriceDetailFilters(
  filters: ContractPriceDetailFiltersState,
  tab: DetailTab = "contractPrice",
  t: Translate = (key) => key
) {
  const visibleFields = getContractPriceDetailFilterFields(tab, t);
  const chips: { name: string; label: string }[] = [];

  const periodField = visibleFields.find((field) => field.kind === "dateRange");
  if (periodField && (filters.startDate || filters.endDate)) {
    const start = filters.startDate
      ? formatDateForDisplay(filters.startDate)
      : "";
    const end = filters.endDate ? formatDateForDisplay(filters.endDate) : "";
    const value = start && end ? `${start} - ${end}` : start || end;
    chips.push({
      name: PERIOD_DATE_FILTER_CHIP,
      label: `${periodField.label}: ${value}`,
    });
  }

  for (const field of visibleFields) {
    if (field.kind === "dateRange") continue;
    if (!filters[field.name]) continue;

    if (field.kind === "multiSelect") {
      const selectedValues = filters[field.name]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const labels = selectedValues.map(
        (value) =>
          field.options.find((option) => option.value === value)?.label ?? value
      );
      chips.push({
        name: field.name,
        label: `${field.label}: ${labels.join(", ")}`,
      });
      continue;
    }

    if (field.kind === "select") {
      const optionLabel =
        field.options.find((option) => option.value === filters[field.name])
          ?.label ?? filters[field.name];
      chips.push({
        name: field.name,
        label: `${field.label}: ${optionLabel}`,
      });
      continue;
    }

    chips.push({
      name: field.name,
      label: `${field.label}: ${filters[field.name]}`,
    });
  }

  return chips;
}
