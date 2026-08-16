"use server";
import type {
  ContractPriceReportListParams,
  GenerateContractPriceReportInput,
} from "../types";
import {
  generateMockContractPriceReport,
  listMockContractPriceReports,
} from "./mock";
export async function listContractPriceReports(
  params: ContractPriceReportListParams = {}
) {
  return listMockContractPriceReports(params);
}
export async function generateContractPriceReport(
  input: GenerateContractPriceReportInput
) {
  return generateMockContractPriceReport(input);
}
