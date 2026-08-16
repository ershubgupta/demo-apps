import { useRouter, useSearchParams } from "next/navigation";

import { TABLE_PAGE_SIZE, TABLE_PAGE_SIZE_OPTIONS } from "@/constant";

type SearchParams = ReturnType<typeof useSearchParams>;
type Router = ReturnType<typeof useRouter>;

type FilterValidators<K extends string> = Partial<
  Record<K, (value: string) => boolean>
>;

type UrlParamValue = string | number | boolean | null | undefined;

/**
 * Reads known filter values from URL search params.
 *
 * @param searchParams - Current Next.js search params.
 * @param emptyFilters - Default filter object used for missing or invalid values.
 * @param validators - Optional per-filter validators.
 * @returns A complete filter state object.
 */
export function getFiltersFromSearchParams<K extends string>(
  searchParams: SearchParams,
  emptyFilters: Record<K, string>,
  validators: FilterValidators<K> = {}
): Record<K, string> {
  const nextFilters: Record<K, string> = {
    ...emptyFilters,
  };

  (Object.keys(emptyFilters) as K[]).forEach((key) => {
    const value = searchParams.get(key) ?? emptyFilters[key];
    const validator = validators[key];

    nextFilters[key] =
      validator && !validator(value) ? emptyFilters[key] : value;
  });

  return nextFilters;
}

/**
 * Reads a positive page number from URL search params.
 *
 * @param searchParams - Current Next.js search params.
 * @returns The requested page number, or 1 when missing or invalid.
 */
export function getPageFromSearchParams(searchParams: SearchParams): number {
  const page = Number(searchParams.get("page") ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

/**
 * Reads a supported page size from URL search params.
 *
 * @param searchParams - Current Next.js search params.
 * @returns The requested page size, or the default table page size when missing or invalid.
 */
export function getPageSizeFromSearchParams(
  searchParams: SearchParams
): number {
  const pageSize = Number(
    searchParams.get("pageSize") ?? String(TABLE_PAGE_SIZE)
  );

  return TABLE_PAGE_SIZE_OPTIONS.includes(
    pageSize as (typeof TABLE_PAGE_SIZE_OPTIONS)[number]
  )
    ? pageSize
    : TABLE_PAGE_SIZE;
}

/**
 * Reads a tab value from URL search params and validates it against allowed tabs.
 *
 * @param searchParams - Current Next.js search params.
 * @param validTabs - Allowed tab keys for the current page.
 * @param defaultTab - Fallback tab when the URL value is missing or invalid.
 * @param paramName - Query parameter name. Defaults to `tab`.
 * @returns The validated tab key or the fallback tab.
 */
export function getTabFromSearchParams<TTab extends string>(
  searchParams: SearchParams,
  validTabs: readonly TTab[],
  defaultTab: TTab,
  paramName = "tab"
): TTab {
  const value = searchParams.get(paramName);

  return validTabs.includes(value as TTab) ? (value as TTab) : defaultTab;
}

/**
 * Applies URL query parameter updates without scrolling the page.
 *
 * Null, undefined, and empty string values remove the parameter.
 *
 * @param router - Next.js router instance.
 * @param pathname - Current pathname without query string.
 * @param searchParams - Current Next.js search params.
 * @param updates - Parameter values to set or remove.
 * @returns Nothing.
 */
export function updateUrlParams<T extends object>(
  router: Router,
  pathname: string,
  searchParams: SearchParams,
  updates: Partial<
    Record<Extract<keyof T, string> | "page" | "pageSize", UrlParamValue>
  >
): void {
  const nextParams = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      nextParams.delete(key);
      return;
    }

    const normalizedValue = String(value).trim();

    if (normalizedValue) {
      nextParams.set(key, normalizedValue);
    } else {
      nextParams.delete(key);
    }
  });

  const queryString = nextParams.toString();

  router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
    scroll: false,
  });
}
