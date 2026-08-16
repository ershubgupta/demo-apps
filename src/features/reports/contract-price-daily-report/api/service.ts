"use server";
import type {
  ContractPriceDailyReportListParams,
  GenerateContractPriceDailyReportInput,
} from "../types";
import {
  generateMockContractPriceDailyReport,
  listMockContractPriceDailyReports,
} from "./mock";
export async function listContractPriceDailyReports(
  params: ContractPriceDailyReportListParams = {}
) {
  return listMockContractPriceDailyReports(params);
}
export async function generateContractPriceDailyReport(
  input: GenerateContractPriceDailyReportInput
) {
  return generateMockContractPriceDailyReport(input);
}
