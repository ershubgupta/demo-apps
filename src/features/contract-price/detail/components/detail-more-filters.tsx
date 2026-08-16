"use client";

import { useEffect, useState, type ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { Filter, Search } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { AppDropdown } from "@/components/app-dropdown";
import { AppField } from "@/components/app-field";
import { AppInput } from "@/components/app-input";
import { DatePicker } from "@/components/calendar/date-picker";
import type {
  FilterFieldConfig,
  FilterOption,
} from "@/components/filters/filter-config";
import type { ActiveFilter } from "@/components/filters/responsive-filter-shell";
import { ResponsiveFilterShell } from "@/components/filters/responsive-filter-shell";
import { AppTooltip } from "@/components/app-tooltip";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { useTranslation } from "@/features/i18n";
import { APP_DATE_QUERY_FORMAT } from "@/lib/utils/date-format";
import { cn } from "@/lib/utils/cnName";
import { getContractPriceDetailFilterFields } from "../config/filter-config";
import {
  emptyContractPriceDetailFilters,
  PERIOD_DATE_FILTER_CHIP,
  type ContractPriceDetailFiltersState,
} from "../config/filter-types";
import type { DetailTab } from "../config/tabs";

const ALL_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;

type UseDetailMoreFiltersParams = {
  activeFilters: ActiveFilter[];
  activeTab: DetailTab;
  filters: ContractPriceDetailFiltersState;
  onApplyFilters: (filters: ContractPriceDetailFiltersState) => void;
  onChange: (
    name: keyof ContractPriceDetailFiltersState,
    value: string
  ) => void;
  onChangeMany: (updates: Partial<ContractPriceDetailFiltersState>) => void;
  onReset: () => void;
  showMoreFilters: boolean;
  onShowMoreFiltersChange: (open: boolean) => void;
};

/**
 * Contract Price detail more-filters slots: desktop toolbar toggle + expandable
 * panel, and mobile header icon + bottom sheet (list-page behavior).
 */
export function useDetailMoreFilters({
  activeFilters,
  activeTab,
  filters,
  onApplyFilters,
  onChange,
  onChangeMany,
  onReset,
  showMoreFilters,
  onShowMoreFiltersChange,
}: UseDetailMoreFiltersParams): {
  toolbarTrigger: ReactNode;
  desktopPanel: ReactNode;
  mobileShell: ReactNode;
} {
  const { t } = useTranslation();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<ContractPriceDetailFiltersState>(filters);
  const visibleFields = getContractPriceDetailFilterFields(activeTab, t);
  const hasFilters = visibleFields.length > 0;

  const openMobileSheet = () => {
    setDraftFilters(filters);
  };

  const applyDraftFilters = () => {
    onApplyFilters(draftFilters);
    setMobileSheetOpen(false);
  };

  const clearDraftFilters = () => {
    setDraftFilters((current) => {
      const next = { ...current };
      for (const field of visibleFields) {
        if (field.kind === "dateRange") {
          next[field.name] = emptyContractPriceDetailFilters[field.name];
          next[field.endName] = emptyContractPriceDetailFilters[field.endName];
          continue;
        }
        next[field.name] = emptyContractPriceDetailFilters[field.name];
      }
      return next;
    });
  };

  const updateDraftFilter = (
    name: keyof ContractPriceDetailFiltersState,
    value: string
  ) => {
    setDraftFilters((current) => ({ ...current, [name]: value }));
  };

  const updateDraftMany = (
    updates: Partial<ContractPriceDetailFiltersState>
  ) => {
    setDraftFilters((current) => ({ ...current, ...updates }));
  };

  const draftActiveCount = visibleFields.reduce((count, field) => {
    if (field.kind === "dateRange") {
      return (
        count +
        (draftFilters[field.name] || draftFilters[field.endName] ? 1 : 0)
      );
    }
    return count + (draftFilters[field.name] ? 1 : 0);
  }, 0);

  const removeFilter = (name: string) => {
    if (name === PERIOD_DATE_FILTER_CHIP) {
      onChangeMany({ startDate: "", endDate: "" });
      return;
    }
    onChange(name as keyof ContractPriceDetailFiltersState, "");
  };

  const toolbarTrigger = hasFilters ? (
    <AppTooltip
      content={
        showMoreFilters
          ? t("common.filters.hideMore")
          : t("common.filters.showMore")
      }
      variant="icon"
    >
      <Button
        aria-expanded={showMoreFilters}
        aria-label={
          showMoreFilters
            ? t("common.filters.hideMore")
            : t("common.filters.showMore")
        }
        className={cn(
          "relative hidden h-8 w-8 md:inline-flex",
          (showMoreFilters || activeFilters.length > 0) && "border-primary"
        )}
        onClick={() => onShowMoreFiltersChange(!showMoreFilters)}
        size="icon"
        type="button"
        variant="outline"
      >
        <Filter className="h-4 w-4" />
        {activeFilters.length > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none text-primary-foreground">
            {activeFilters.length}
          </span>
        ) : null}
      </Button>
    </AppTooltip>
  ) : null;

  const desktopPanel =
    hasFilters && showMoreFilters ? (
      <div className="hidden rounded-xl border border-border bg-card p-4 shadow-sm md:block">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DetailFilterFields
            debounceSearch
            fields={visibleFields}
            filters={filters}
            onChange={onChange}
            onChangeMany={onChangeMany}
          />
        </div>
      </div>
    ) : null;

  const mobileShell = hasFilters ? (
    <ResponsiveFilterShell
      activeFilters={activeFilters}
      applyLabel={t("common.actions.apply")}
      clearDisabled={
        mobileSheetOpen ? draftActiveCount === 0 : activeFilters.length === 0
      }
      desktopClassName="!hidden"
      mobileContent={
        <DetailFilterFields
          fields={visibleFields}
          filters={draftFilters}
          onChange={updateDraftFilter}
          onChangeMany={updateDraftMany}
        />
      }
      onApply={applyDraftFilters}
      onClearAll={mobileSheetOpen ? clearDraftFilters : onReset}
      onOpenChange={setMobileSheetOpen}
      onOpenFilters={openMobileSheet}
      onRemoveFilter={removeFilter}
      open={mobileSheetOpen}
      title={t("common.filters.title")}
    >
      <div />
    </ResponsiveFilterShell>
  ) : null;

  return { toolbarTrigger, desktopPanel, mobileShell };
}

function DetailFilterFields({
  debounceSearch = false,
  fields,
  filters,
  onChange,
  onChangeMany,
}: {
  debounceSearch?: boolean;
  fields: FilterFieldConfig<ContractPriceDetailFiltersState>[];
  filters: ContractPriceDetailFiltersState;
  onChange: (
    name: keyof ContractPriceDetailFiltersState,
    value: string
  ) => void;
  onChangeMany: (updates: Partial<ContractPriceDetailFiltersState>) => void;
}) {
  return (
    <>
      {fields.map((field) => (
        <DetailFilterField
          debounceSearch={debounceSearch}
          field={field}
          filters={filters}
          key={field.name}
          onChange={onChange}
          onChangeMany={onChangeMany}
        />
      ))}
    </>
  );
}

function DetailFilterField({
  debounceSearch = false,
  field,
  filters,
  onChange,
  onChangeMany,
}: {
  debounceSearch?: boolean;
  field: FilterFieldConfig<ContractPriceDetailFiltersState>;
  filters: ContractPriceDetailFiltersState;
  onChange: (
    name: keyof ContractPriceDetailFiltersState,
    value: string
  ) => void;
  onChangeMany: (updates: Partial<ContractPriceDetailFiltersState>) => void;
}) {
  if (field.kind === "select") {
    return (
      <AppDropdown
        label={field.label}
        options={[
          { label: field.placeholder, value: ALL_VALUE },
          ...field.options,
        ]}
        onValueChange={(nextValue) =>
          onChange(field.name, nextValue === ALL_VALUE ? "" : nextValue)
        }
        value={filters[field.name] || ALL_VALUE}
      />
    );
  }

  if (field.kind === "multiSelect") {
    return (
      <MultiSelectFilter
        label={field.label}
        onChange={(nextValue) => onChange(field.name, nextValue)}
        options={field.options}
        placeholder={field.placeholder}
        value={filters[field.name]}
      />
    );
  }

  if (field.kind === "dateRange") {
    const from = filters[field.name]
      ? parseISO(filters[field.name])
      : undefined;
    const to = filters[field.endName]
      ? parseISO(filters[field.endName])
      : undefined;
    const value: DateRange | undefined = from || to ? { from, to } : undefined;

    return (
      <DatePicker
        label={field.label}
        mode="range"
        onChange={(range?: DateRange) => {
          if (!range?.from && !range?.to) {
            onChangeMany({
              [field.name]: "",
              [field.endName]: "",
            } as Partial<ContractPriceDetailFiltersState>);
            return;
          }

          if (range?.from && range?.to) {
            onChangeMany({
              [field.name]: format(range.from, APP_DATE_QUERY_FORMAT),
              [field.endName]: format(range.to, APP_DATE_QUERY_FORMAT),
            } as Partial<ContractPriceDetailFiltersState>);
          }
        }}
        placeholder={field.placeholder}
        value={value}
      />
    );
  }

  if (field.kind === "date") {
    return (
      <DatePicker
        label={field.label}
        mode="single"
        onChange={(date) =>
          onChange(field.name, date ? format(date, APP_DATE_QUERY_FORMAT) : "")
        }
        placeholder={field.placeholder}
        value={filters[field.name] ? parseISO(filters[field.name]) : undefined}
      />
    );
  }

  if (debounceSearch) {
    return (
      <DebouncedSearchFilter
        label={field.label}
        onChange={(nextValue) => onChange(field.name, nextValue)}
        placeholder={field.placeholder}
        value={filters[field.name]}
      />
    );
  }

  return (
    <AppInput
      label={field.label}
      leadingIcon={<Search />}
      onChange={(event) => onChange(field.name, event.target.value)}
      placeholder={field.placeholder}
      value={filters[field.name]}
    />
  );
}

/**
 * Multi-select combobox filter (same pattern as Customer on create-contract drawer).
 * Selected values are stored as a comma-separated string for URL sync.
 */
function MultiSelectFilter({
  label,
  onChange,
  options,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  value: string;
}) {
  const anchor = useComboboxAnchor();
  const selectedValues = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  return (
    <AppField label={label}>
      <Combobox
        multiple
        autoHighlight
        items={options}
        value={selectedOptions}
        onValueChange={(values) => {
          const nextValue = (values ?? [])
            .map((option) => option.value)
            .join(",");
          onChange(nextValue);
        }}
        itemToStringLabel={(item: FilterOption) => item.label}
        itemToStringValue={(item: FilterOption) => item.value}
        isItemEqualToValue={(a: FilterOption, b: FilterOption) =>
          a.value === b.value
        }
      >
        <ComboboxChips ref={anchor} className="w-full">
          <ComboboxValue>
            {(values: FilterOption | FilterOption[] | null) => {
              const selected = Array.isArray(values)
                ? values
                : values
                  ? [values]
                  : [];

              return (
                <>
                  {selected.map((option) => (
                    <ComboboxChip key={option.value}>
                      {option.label}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    placeholder={
                      selected.length === 0 ? placeholder : undefined
                    }
                  />
                </>
              );
            }}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(option: FilterOption) => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </AppField>
  );
}

/**
 * Keeps the input responsive while delaying URL/query updates until typing pauses.
 */
function DebouncedSearchFilter({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  useEffect(() => {
    if (localValue === value) return;

    const timer = window.setTimeout(() => {
      onChange(localValue);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <AppInput
      label={label}
      leadingIcon={<Search />}
      onChange={(event) => setLocalValue(event.target.value)}
      placeholder={placeholder}
      value={localValue}
    />
  );
}
