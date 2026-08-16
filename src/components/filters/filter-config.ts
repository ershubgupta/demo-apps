/** Label/value option used by configurable app filters. */
export type FilterOption = {
  /** Reader-facing option label. */
  label: string;
  /** Value stored in filter state and URL params. */
  value: string;
};

type BaseFilterFieldConfig<TFilters extends Record<string, string>> = {
  className?: string;
  label: string;
  name: Extract<keyof TFilters, string>;
  placement: "primary" | "more";
};

/** Search input filter field configuration. */
export type SearchFilterFieldConfig<TFilters extends Record<string, string>> =
  BaseFilterFieldConfig<TFilters> & {
    kind: "search";
    placeholder: string;
  };

/** Select/dropdown filter field configuration. */
export type SelectFilterFieldConfig<TFilters extends Record<string, string>> =
  BaseFilterFieldConfig<TFilters> & {
    kind: "select";
    options: FilterOption[];
    placeholder: string;
  };

/** Multi-select combobox filter field configuration. */
export type MultiSelectFilterFieldConfig<
  TFilters extends Record<string, string>,
> = BaseFilterFieldConfig<TFilters> & {
  kind: "multiSelect";
  options: FilterOption[];
  placeholder: string;
};

/** Date input filter field configuration. */
export type DateFilterFieldConfig<TFilters extends Record<string, string>> =
  BaseFilterFieldConfig<TFilters> & {
    kind: "date";
    placeholder: string;
  };

/** Date-range filter field configuration (start + end URL params). */
export type DateRangeFilterFieldConfig<
  TFilters extends Record<string, string>,
> = BaseFilterFieldConfig<TFilters> & {
  kind: "dateRange";
  /** Filter state key for the range end date. */
  endName: Extract<keyof TFilters, string>;
  placeholder: string;
};

/** Union of supported configurable filter field definitions. */
export type FilterFieldConfig<TFilters extends Record<string, string>> =
  | SearchFilterFieldConfig<TFilters>
  | SelectFilterFieldConfig<TFilters>
  | MultiSelectFilterFieldConfig<TFilters>
  | DateFilterFieldConfig<TFilters>
  | DateRangeFilterFieldConfig<TFilters>;

/** Converts plain string values into label/value filter options. */
export function toFilterOptions(values: string[]): FilterOption[] {
  return values.map((value) => ({ label: value, value }));
}
