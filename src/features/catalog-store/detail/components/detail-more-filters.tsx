"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Filter, Search } from "lucide-react";

import { AppDropdown } from "@/components/app-dropdown";
import { AppInput } from "@/components/app-input";
import type { FilterFieldConfig } from "@/components/filters/filter-config";
import type { ActiveFilter } from "@/components/filters/responsive-filter-shell";
import { ResponsiveFilterShell } from "@/components/filters/responsive-filter-shell";
import { AppTooltip } from "@/components/app-tooltip";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cnName";
import { getCatalogStoreDetailFilterFields } from "../config/filter-config";
import {
  emptyCatalogStoreDetailFilters,
  type CatalogStoreDetailFiltersState,
} from "../config/filter-types";
import type { DetailTab } from "../config/tabs";

const ALL_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;

type UseDetailMoreFiltersParams = {
  activeFilters: ActiveFilter[];
  activeTab: DetailTab;
  filters: CatalogStoreDetailFiltersState;
  onApplyFilters: (filters: CatalogStoreDetailFiltersState) => void;
  onChange: (name: keyof CatalogStoreDetailFiltersState, value: string) => void;
  onReset: () => void;
  showMoreFilters: boolean;
  onShowMoreFiltersChange: (open: boolean) => void;
};

/**
 * Catalog Store detail more-filters slots: desktop toolbar toggle + expandable
 * panel, and mobile header icon + bottom sheet (list-page behavior).
 */
export function useDetailMoreFilters({
  activeFilters,
  activeTab,
  filters,
  onApplyFilters,
  onChange,
  onReset,
  showMoreFilters,
  onShowMoreFiltersChange,
}: UseDetailMoreFiltersParams): {
  toolbarTrigger: ReactNode;
  desktopPanel: ReactNode;
  mobileShell: ReactNode;
} {
  const t = useTranslations();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<CatalogStoreDetailFiltersState>(filters);
  const visibleFields = getCatalogStoreDetailFilterFields(activeTab, t);
  const visibleNames = visibleFields.map((field) => field.name);

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
      visibleNames.forEach((name) => {
        next[name] = emptyCatalogStoreDetailFilters[name];
      });
      return next;
    });
  };

  const updateDraftFilter = (
    name: keyof CatalogStoreDetailFiltersState,
    value: string
  ) => {
    setDraftFilters((current) => ({ ...current, [name]: value }));
  };

  const draftActiveCount = visibleNames.filter(
    (name) => draftFilters[name]
  ).length;

  const toolbarTrigger = (
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
  );

  const desktopPanel = showMoreFilters ? (
    <div className="hidden rounded-xl border border-border bg-card p-4 shadow-sm md:block">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DetailFilterFields
          debounceSearch
          fields={visibleFields}
          filters={filters}
          onChange={onChange}
        />
      </div>
    </div>
  ) : null;

  const mobileShell = (
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
        />
      }
      onApply={applyDraftFilters}
      onClearAll={mobileSheetOpen ? clearDraftFilters : onReset}
      onOpenChange={setMobileSheetOpen}
      onOpenFilters={openMobileSheet}
      onRemoveFilter={(name) =>
        onChange(name as keyof CatalogStoreDetailFiltersState, "")
      }
      open={mobileSheetOpen}
      title={t("common.filters.title")}
    >
      <div />
    </ResponsiveFilterShell>
  );

  return { toolbarTrigger, desktopPanel, mobileShell };
}

function DetailFilterFields({
  debounceSearch = false,
  fields,
  filters,
  onChange,
}: {
  debounceSearch?: boolean;
  fields: FilterFieldConfig<CatalogStoreDetailFiltersState>[];
  filters: CatalogStoreDetailFiltersState;
  onChange: (name: keyof CatalogStoreDetailFiltersState, value: string) => void;
}) {
  return (
    <>
      {fields.map((field) => (
        <DetailFilterField
          debounceSearch={debounceSearch}
          field={field}
          key={field.name}
          onChange={onChange}
          value={filters[field.name]}
        />
      ))}
    </>
  );
}

function DetailFilterField({
  debounceSearch = false,
  field,
  onChange,
  value,
}: {
  debounceSearch?: boolean;
  field: FilterFieldConfig<CatalogStoreDetailFiltersState>;
  onChange: (name: keyof CatalogStoreDetailFiltersState, value: string) => void;
  value: string;
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
        value={value || ALL_VALUE}
      />
    );
  }

  if (debounceSearch) {
    return (
      <DebouncedSearchFilter
        label={field.label}
        onChange={(nextValue) => onChange(field.name, nextValue)}
        placeholder={field.placeholder}
        value={value}
      />
    );
  }

  return (
    <AppInput
      label={field.label}
      leadingIcon={<Search />}
      onChange={(event) => onChange(field.name, event.target.value)}
      placeholder={field.placeholder}
      value={value}
    />
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
