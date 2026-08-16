"use server";
import type {
  CatalogHoReportListParams,
  GenerateCatalogHoReportInput,
} from "../types";
import { generateMockCatalogHoReport, listMockCatalogHoReports } from "./mock";
export async function listCatalogHoReports(
  params: CatalogHoReportListParams = {}
) {
  return listMockCatalogHoReports(params);
}
export async function generateCatalogHoReport(
  input: GenerateCatalogHoReportInput
) {
  return generateMockCatalogHoReport(input);
}
