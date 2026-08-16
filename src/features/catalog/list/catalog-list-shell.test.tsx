import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import en from "../../../../messages/en.json";
import type { Catalog } from "@/features/catalog-ho/types";
import type { Translate } from "@/i18n/types";
import { CatalogTypeEnum } from "@/types/catalog";
import { createCatalogColumns } from "./components/table-columns";
import {
  emptyCatalogFilters,
  toCatalogSearchParams,
} from "./config/filter-types";
import {
  canShowCatalogActions,
  catalogListPageConfigs,
  getCatalogDetailHref,
} from "./config/page-config";

function englishTranslator(): Translate {
  return createTranslator({
    locale: "en",
    messages: en,
  }) as unknown as Translate;
}

function headers(columns: { header?: unknown }[]) {
  return columns
    .map((column) => column.header)
    .filter((header): header is string => typeof header === "string");
}

function columnIds(columns: { id?: string; accessorKey?: string }[]) {
  return columns.map((column) => column.id ?? column.accessorKey);
}

const catalogStoreRow = {
  id: "store-row",
  catalogType: CatalogTypeEnum.CATALOG_STORE,
  number: "0058-SC-000001",
  revision: 0,
  charge: 0,
  startDate: "30-Jun-2026",
  endDate: "30-Jul-2026",
  priceStartDate: "30-Jun-2026",
  priceEndDate: "30-Jul-2026",
  store: "58",
  status: "Active",
  mmid: "",
  cvCode: "",
  customerName: "",
  itemNo: "",
  itemDescription: "",
} satisfies Catalog;

describe("catalog list shell", () => {
  it("passes both catalog types for the combined Catalog page", () => {
    expect(
      toCatalogSearchParams(
        emptyCatalogFilters,
        catalogListPageConfigs.catalog.fixedCatalogTypes
      ).catalogType
    ).toEqual([CatalogTypeEnum.Catalog_HO, CatalogTypeEnum.CATALOG_STORE]);
  });

  it("passes one catalog type for dedicated pages", () => {
    expect(
      toCatalogSearchParams(
        emptyCatalogFilters,
        catalogListPageConfigs.catalogHo.fixedCatalogTypes
      ).catalogType
    ).toEqual([CatalogTypeEnum.Catalog_HO]);

    expect(
      toCatalogSearchParams(
        emptyCatalogFilters,
        catalogListPageConfigs.catalogStore.fixedCatalogTypes
      ).catalogType
    ).toEqual([CatalogTypeEnum.CATALOG_STORE]);
  });

  it("lets the combined Catalog page filter down to one catalog type", () => {
    expect(
      toCatalogSearchParams(
        {
          ...emptyCatalogFilters,
          catalogType: CatalogTypeEnum.CATALOG_STORE,
        },
        catalogListPageConfigs.catalog.fixedCatalogTypes
      ).catalogType
    ).toEqual([CatalogTypeEnum.CATALOG_STORE]);
  });

  it("shows combined Catalog columns without forcing them onto dedicated pages", () => {
    const t = englishTranslator();
    const combinedHeaders = headers(
      createCatalogColumns({
        config: catalogListPageConfigs.catalog,
        onAction: () => {},
        onActionOpenChange: () => {},
        openActionRowId: null,
        t,
      })
    );
    const storeColumnIds = columnIds(
      createCatalogColumns({
        config: catalogListPageConfigs.catalogStore,
        onAction: () => {},
        onActionOpenChange: () => {},
        openActionRowId: null,
        t,
      })
    );

    expect(combinedHeaders).toContain("Catalog type");
    expect(combinedHeaders).toContain("Revision");
    expect(storeColumnIds).not.toContain("revision");
    expect(storeColumnIds).not.toContain("actions");
  });

  it("does not show Catalog Store row actions in the combined Catalog page", () => {
    expect(
      canShowCatalogActions(catalogStoreRow, catalogListPageConfigs.catalog)
    ).toBe(false);
    expect(getCatalogDetailHref(catalogStoreRow)).toBe(
      "/catalog-store/0058-SC-000001"
    );
  });
});
