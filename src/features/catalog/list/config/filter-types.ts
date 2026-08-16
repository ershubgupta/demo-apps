import type {
  CatalogListParams,
  CatalogStatus,
} from "@/features/catalog-ho/types";
import { CATALOG_STATUS_OPTIONS } from "@/constant";
import { getCatalogStatusLabel } from "@/features/catalog-ho/config/status-config";
import type { Translate } from "@/i18n/types";
import { formatDateForDisplay } from "@/lib/utils/date-format";
import { CatalogTypeEnum, type CatalogType } from "@/types/catalog";

export const emptyCatalogFilters = {
  search: "",
  mmid: "",
  cvCode: "",
  customerName: "",
  itemNo: "",
  itemDescription: "",
  number: "",
  revision: "",
  charge: "",
  startDate: "",
  endDate: "",
  priceStartDate: "",
  priceEndDate: "",
  status: "",
  store: "",
  catalogType: "",
};

export type CatalogFiltersState = typeof emptyCatalogFilters;

export const catalogStatusOptions = CATALOG_STATUS_OPTIONS;

export const catalogTypeOptions = [
  CatalogTypeEnum.Catalog_HO,
  CatalogTypeEnum.CATALOG_STORE,
] as const;

export function createCatalogStatusOptions(t: Translate) {
  return CATALOG_STATUS_OPTIONS.map((option) => ({
    ...option,
    label: getCatalogStatusLabel(option.value, t),
  }));
}

export function createCatalogTypeOptions(t: Translate) {
  return [
    {
      label: t("navigation.catalogHo"),
      value: CatalogTypeEnum.Catalog_HO,
    },
    {
      label: t("navigation.catalogStore"),
      value: CatalogTypeEnum.CATALOG_STORE,
    },
  ];
}

export function getCatalogTypeLabel(
  catalogType: CatalogType | string,
  t: Translate
) {
  if (catalogType === CatalogTypeEnum.Catalog_HO)
    return t("navigation.catalogHo");
  if (catalogType === CatalogTypeEnum.CATALOG_STORE) {
    return t("navigation.catalogStore");
  }
  return catalogType;
}

export function getActiveCatalogFilters(
  filters: CatalogFiltersState,
  t: Translate = (key) => key,
  options: { showCatalogTypeFilter?: boolean } = {}
) {
  const labels: Record<keyof CatalogFiltersState, string> = {
    search: t("common.filters.search"),
    mmid: t("common.fields.mmid"),
    cvCode: t("common.fields.cvCode"),
    customerName: t("common.fields.customer"),
    itemNo: t("common.fields.item"),
    itemDescription: t("common.fields.description"),
    number: t("common.fields.number"),
    revision: t("common.fields.revision"),
    charge: t("common.fields.charge"),
    startDate: t("common.fields.startDate"),
    endDate: t("common.fields.endDate"),
    priceStartDate: t("common.fields.priceStart"),
    priceEndDate: t("common.fields.priceEnd"),
    status: t("common.fields.status"),
    store: t("common.fields.store"),
    catalogType: t("common.fields.catalogType"),
  };

  return (Object.keys(filters) as (keyof CatalogFiltersState)[])
    .filter((name) => filters[name])
    .filter((name) => options.showCatalogTypeFilter || name !== "catalogType")
    .map((name) => ({
      name,
      label: `${labels[name]}: ${formatCatalogFilterValue(name, filters[name], t)}`,
    }));
}

export function toCatalogSearchParams(
  filters: CatalogFiltersState,
  fixedCatalogTypes: CatalogType[]
): CatalogListParams {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([key, value]) => key !== "catalogType" && value.trim()
    )
  ) as CatalogListParams;

  return {
    ...params,
    catalogType: filters.catalogType
      ? [filters.catalogType as CatalogType]
      : fixedCatalogTypes,
    status: filters.status ? (filters.status as CatalogStatus) : undefined,
  };
}

function formatCatalogFilterValue(
  name: keyof CatalogFiltersState,
  value: string,
  t: Translate
) {
  if (
    (name === "startDate" ||
      name === "endDate" ||
      name === "priceStartDate" ||
      name === "priceEndDate") &&
    value
  ) {
    return formatDateForDisplay(value);
  }

  if (name === "status" && value) {
    return getCatalogStatusLabel(value as CatalogStatus, t);
  }

  if (name === "catalogType" && value) {
    return getCatalogTypeLabel(value, t);
  }

  return value;
}
