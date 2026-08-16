import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import en from "../../../messages/en.json";
import type { Translate } from "@/i18n/types";

import {
  catalogHoReportFilterFields,
  createCatalogHoReportColumns,
} from "./catalog-ho-report";
import {
  catalogStoreReportFilterFields,
  createCatalogStoreReportColumns,
} from "./catalog-store-report";
import {
  contractPriceReportFilterFields,
  createContractPriceReportColumns,
} from "./contract-price-report";

function headers(columns: { header?: unknown }[]) {
  return columns
    .map((column) => column.header)
    .filter((header): header is string => typeof header === "string");
}
function fieldNames(fields: { name: string }[]) {
  return fields.map((field) => field.name);
}

function englishTranslator(): Translate {
  return createTranslator({
    locale: "en",
    messages: en,
  }) as unknown as Translate;
}

describe("report page-owned columns and filters", () => {
  it("keeps Catalog HO catalog-specific fields on the HO page", () => {
    expect(fieldNames(catalogHoReportFilterFields)).toEqual([
      "catalogNumber",
      "catalogRevision",
      "catalogStatus",
      "catalogType",
      "priceStartDate",
      "priceEndDate",
    ]);
    expect(
      headers(createCatalogHoReportColumns(() => {}, englishTranslator()))
    ).toContain("Report Item + Customer Download");
  });
  it("keeps Catalog Store fields separate from HO revision/status", () => {
    expect(fieldNames(catalogStoreReportFilterFields)).toEqual([
      "reportNo",
      "reportCreatedDate",
      "catalogNumber",
      "catalogType",
      "priceStartDate",
      "priceEndDate",
    ]);
    expect(headers(createCatalogStoreReportColumns(() => {}))).not.toContain(
      "Catalog revision"
    );
  });
  it("keeps Contract Price compact with no catalog fields", () => {
    expect(fieldNames(contractPriceReportFilterFields)).toEqual([
      "reportNo",
      "reportCreatedDate",
      "priceStartDate",
      "priceEndDate",
    ]);
    const t = englishTranslator();
    const contractHeaders = headers(createContractPriceReportColumns(t));
    expect(contractHeaders).toEqual([
      "Report no",
      "Report created date",
      "Price period",
      "Report Status",
      "Report Download",
    ]);
    expect(contractHeaders).not.toContain("Catalog number");
    expect(contractHeaders).not.toContain("Catalog revision");
  });
});
