import { CatalogTypeEnum, type CatalogType } from "@/types/catalog";
import type { TranslationKey } from "@/i18n/types";
import type { Catalog } from "@/features/catalog-ho/types";

export type CatalogListVariant = "catalog" | "catalog-ho" | "catalog-store";

export type CatalogListPageConfig = {
  createAriaKey: TranslationKey;
  emptyKey: TranslationKey;
  enableActions: boolean;
  fixedCatalogTypes: CatalogType[];
  loadFailedKey: TranslationKey;
  showCatalogTypeColumn: boolean;
  showCatalogTypeFilter: boolean;
  showRevisionColumn: boolean;
  subtitleKey: TranslationKey;
  titleKey: TranslationKey;
  variant: CatalogListVariant;
};

export const catalogListPageConfigs = {
  catalog: {
    createAriaKey: "pages.catalog.createNewAria",
    emptyKey: "pages.catalog.empty",
    enableActions: true,
    fixedCatalogTypes: [
      CatalogTypeEnum.Catalog_HO,
      CatalogTypeEnum.CATALOG_STORE,
    ],
    loadFailedKey: "pages.catalog.loadFailed",
    showCatalogTypeColumn: true,
    showCatalogTypeFilter: true,
    showRevisionColumn: true,
    subtitleKey: "pages.catalog.subtitle",
    titleKey: "pages.catalog.title",
    variant: "catalog",
  },
  catalogHo: {
    createAriaKey: "pages.catalogHo.createNewAria",
    emptyKey: "pages.catalogHo.empty",
    enableActions: true,
    fixedCatalogTypes: [CatalogTypeEnum.Catalog_HO],
    loadFailedKey: "pages.catalogHo.loadFailed",
    showCatalogTypeColumn: false,
    showCatalogTypeFilter: false,
    showRevisionColumn: true,
    subtitleKey: "pages.catalogHo.subtitle",
    titleKey: "pages.catalogHo.title",
    variant: "catalog-ho",
  },
  catalogStore: {
    createAriaKey: "pages.catalogStore.createNewAria",
    emptyKey: "pages.catalogStore.empty",
    enableActions: false,
    fixedCatalogTypes: [CatalogTypeEnum.CATALOG_STORE],
    loadFailedKey: "pages.catalogStore.loadFailed",
    showCatalogTypeColumn: false,
    showCatalogTypeFilter: false,
    showRevisionColumn: false,
    subtitleKey: "pages.catalogStore.subtitle",
    titleKey: "pages.catalogStore.title",
    variant: "catalog-store",
  },
} satisfies Record<string, CatalogListPageConfig>;

export function getCatalogDetailHref(catalog: Catalog) {
  if (catalog.catalogType === CatalogTypeEnum.CATALOG_STORE) {
    return `/catalog-store/${encodeURIComponent(catalog.number)}`;
  }

  return `/catalog-ho/${encodeURIComponent(catalog.id)}`;
}

export function canShowCatalogActions(
  catalog: Catalog,
  config: Pick<CatalogListPageConfig, "enableActions">
) {
  return (
    config.enableActions && catalog.catalogType === CatalogTypeEnum.Catalog_HO
  );
}
