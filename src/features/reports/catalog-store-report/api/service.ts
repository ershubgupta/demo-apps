"use server";
import type {
  CatalogStoreReportListParams,
  GenerateCatalogStoreReportInput,
} from "../types";
import {
  generateMockCatalogStoreReport,
  listMockCatalogStoreReports,
} from "./mock";
export async function listCatalogStoreReports(
  params: CatalogStoreReportListParams = {}
) {
  return listMockCatalogStoreReports(params);
}
export async function generateCatalogStoreReport(
  input: GenerateCatalogStoreReportInput
) {
  return generateMockCatalogStoreReport(input);
}
