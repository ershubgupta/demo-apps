"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Filter, RotateCcw, Search } from "lucide-react";

import type { ActiveFilter } from "@/components/filters/responsive-filter-shell";
import { ResponsiveFilterShell } from "@/components/filters/responsive-filter-shell";
import type {
  FilterFieldConfig,
  FilterOption,
} from "@/components/filters/filter-config";
import { AppDropdown } from "@/components/app-dropdown";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/calendar/date-picker";
import { AppInput } from "@/components/app-input";
import { AppTooltip } from "@/components/app-tooltip";
import { useTranslations } from "next-intl";
import {
  APP_DATE_QUERY_FORMAT,
  formatDateForDisplay,
} from "@/lib/utils/date-format";
import { cn } from "@/lib/utils/cnName";

const ALL_VALUE = "__all__";

type ConfigurableListFiltersProps<TFilters extends Record<string, string>> = {
  /** Active filters already applied by the parent, used for badges and reset state. */
  activeFilters: ActiveFilter[];
  /** Empty/default filter object used when clearing staged mobile filters. */
  emptyFilters: TFilters;
  /** Field definitions that describe what inputs to render. */
  fields: FilterFieldConfig<TFilters>[];
  /** Current filter state keyed by filter field name. */
  filters: TFilters;
  /** Layout class for the expanded desktop more-filters grid. */
  moreGridClassName?: string;
  /** Called when the mobile drawer Apply action is pressed. Falls back to onChange. */
  onApplyFilters?: (filters: TFilters) => void;
  /** Called when a filter value changes. */
  onChange: (name: keyof TFilters, value: string) => void;
  /** Clears all filters and associated URL state. */
  onReset: () => void;
  /** Layout class for the primary desktop filter grid. */
  primaryGridClassName?: string;
  /** Shows the desktop more-filters toggle. Disable when every filter is already primary. */
  showMoreToggle?: boolean;
};

/**
 * A config-driven list filter renderer.
 *
 * @component
 * @template TFilters - Filter state object with string keys and values.
 * @param {object} props - The props for the configurable list filters.
 * @param {ActiveFilter[]} props.activeFilters - Active filters already applied by the parent, used for badges and reset state.
 * @param {TFilters} props.emptyFilters - Empty/default filter object used when clearing staged mobile filters.
 * @param {FilterFieldConfig<TFilters>[]} props.fields - Field definitions that describe what inputs to render.
 * @param {TFilters} props.filters - Current filter state keyed by filter field name.
 * @param {string} [props.moreGridClassName="mt-3 grid gap-3 border-t border-border pt-3 md:grid-cols-2 xl:grid-cols-5"] - Layout class for the expanded desktop more-filters grid.
 * @param {(filters: TFilters) => void} [props.onApplyFilters] - Called when the mobile drawer Apply action is pressed. Falls back to onChange.
 * @param {(name: keyof TFilters, value: string) => void} props.onChange - Called when a filter value changes.
 * @param {() => void} props.onReset - Clears all filters and associated URL state.
 * @param {string} [props.primaryGridClassName="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]"] - Layout class for the primary desktop filter grid.
 * @returns {JSX.Element} The rendered configurable list filters component.
 */
export function ConfigurableListFilters<
  TFilters extends Record<string, string>,
>({
  activeFilters,
  emptyFilters,
  fields,
  filters,
  moreGridClassName = "mt-3 grid gap-3 border-t border-border pt-3 md:grid-cols-2 xl:grid-cols-5",
  onApplyFilters,
  onChange,
  onReset,
  primaryGridClassName = "grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]",
  showMoreToggle = true,
}: ConfigurableListFiltersProps<TFilters>) {
  const t = useTranslations();
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<TFilters>(filters);
  const draftActiveFilters = getActiveFiltersFromFields(fields, draftFilters);
  const primaryFields = fields.filter((field) => field.placement === "primary");
  const moreFields = fields.filter((field) => field.placement === "more");

  const openMobileSheet = () => {
    setDraftFilters(filters);
  };

  const updateDraftFilter = (name: keyof TFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [name]: value }));
  };

  const applyDraftFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(draftFilters);
    } else {
      (Object.keys(emptyFilters) as (keyof TFilters)[]).forEach((key) => {
        if (draftFilters[key] !== filters[key])
          onChange(key, draftFilters[key]);
      });
    }
    setMobileSheetOpen(false);
  };

  const clearDraftFilters = () => {
    setDraftFilters({ ...emptyFilters });
  };

  return (
    <ResponsiveFilterShell
      activeFilters={activeFilters}
      applyLabel={t("common.actions.apply")}
      clearDisabled={
        mobileSheetOpen
          ? draftActiveFilters.length === 0
          : activeFilters.length === 0
      }
      mobileContent={
        <FilterFields
          fields={fields}
          filters={draftFilters}
          onChange={updateDraftFilter}
        />
      }
      onApply={applyDraftFilters}
      onClearAll={mobileSheetOpen ? clearDraftFilters : onReset}
      onOpenChange={setMobileSheetOpen}
      onOpenFilters={openMobileSheet}
      onRemoveFilter={(name) => onChange(name as keyof TFilters, "")}
      open={mobileSheetOpen}
      title={t("common.filters.title")}
    >
      <div className={primaryGridClassName}>
        <FilterFields
          fields={primaryFields}
          filters={filters}
          onChange={onChange}
        />
        <div className="flex items-end justify-end gap-2 md:col-span-2 md:ml-auto xl:col-span-1 xl:col-start-[-2] xl:ml-0">
          {showMoreToggle && moreFields.length > 0 ? (
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
                className={cn("relative", showMoreFilters && "border-primary")}
                size="icon-lg"
                onClick={() => setShowMoreFilters((value) => !value)}
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
          ) : null}
          <AppTooltip content={t("common.filters.resetAll")} variant="icon">
            <Button
              aria-label={t("common.filters.resetAll")}
              disabled={activeFilters.length === 0}
              size="icon-lg"
              onClick={onReset}
              type="button"
              variant="secondary"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </AppTooltip>
        </div>
      </div>

      {showMoreFilters && moreFields.length > 0 ? (
        <div className={moreGridClassName}>
          <FilterFields
            fields={moreFields}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ) : null}
    </ResponsiveFilterShell>
  );
}

function FilterFields<TFilters extends Record<string, string>>({
  fields,
  filters,
  onChange,
}: {
  fields: FilterFieldConfig<TFilters>[];
  filters: TFilters;
  onChange: (name: keyof TFilters, value: string) => void;
}) {
  return (
    <>
      {fields.map((field) => (
        <FilterField
          field={field}
          key={field.name}
          onChange={onChange}
          value={filters[field.name]}
        />
      ))}
    </>
  );
}

function FilterField<TFilters extends Record<string, string>>({
  field,
  onChange,
  value,
}: {
  field: FilterFieldConfig<TFilters>;
  onChange: (name: keyof TFilters, value: string) => void;
  value: string;
}) {
  if (field.kind === "select") {
    return (
      <SelectFilter
        className={field.className}
        label={field.label}
        onChange={(nextValue) => onChange(field.name, nextValue)}
        options={field.options}
        placeholder={field.placeholder}
        value={value}
      />
    );
  }

  if (field.kind === "date") {
    return (
      <DateFilter
        className={field.className}
        label={field.label}
        placeholder={field.placeholder}
        onChange={(nextValue) => onChange(field.name, nextValue)}
        value={value}
      />
    );
  }

  if (field.kind === "dateRange" || field.kind === "multiSelect") {
    return null;
  }

  return (
    <SearchFilter
      className={field.className}
      label={field.label}
      onChange={(nextValue) => onChange(field.name, nextValue)}
      placeholder={field.placeholder}
      value={value}
    />
  );
}

function SearchFilter({
  className,
  label,
  onChange,
  placeholder,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <AppInput
      label={label}
      leadingIcon={<Search />}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
      wrapperClassName={className}
    />
  );
}

function SelectFilter({
  className,
  label,
  onChange,
  options,
  placeholder,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  value: string;
}) {
  return (
    <AppDropdown
      options={[{ label: placeholder, value: ALL_VALUE }, ...options]}
      onValueChange={(nextValue) =>
        onChange(nextValue === ALL_VALUE ? "" : nextValue)
      }
      value={value || ALL_VALUE}
      label={label}
      wrapperClassName={className}
    />
  );
}

function DateFilter({
  className,
  label,
  placeholder,
  onChange,
  value,
}: {
  className?: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <DatePicker
      mode="single"
      value={value ? parseISO(value) : undefined}
      placeholder={placeholder}
      onChange={(date) =>
        onChange(date ? format(date, APP_DATE_QUERY_FORMAT) : "")
      }
      label={label}
      wrapperClassName={className}
    />
  );
}

function getActiveFiltersFromFields<TFilters extends Record<string, string>>(
  fields: FilterFieldConfig<TFilters>[],
  filters: TFilters
): ActiveFilter[] {
  return fields
    .filter((field) => filters[field.name])
    .map((field) => ({
      name: field.name,
      label: `${field.label}: ${getFilterDisplayValue(field, filters[field.name])}`,
    }));
}

function getFilterDisplayValue<TFilters extends Record<string, string>>(
  field: FilterFieldConfig<TFilters>,
  value: string
) {
  if (field.kind === "date") {
    return formatDateForDisplay(value);
  }
  if (field.kind === "select") {
    return (
      field.options.find((option) => option.value === value)?.label ?? value
    );
  }
  return value;
}
