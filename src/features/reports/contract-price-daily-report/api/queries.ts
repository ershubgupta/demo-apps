import { QUERY_KEYS } from "@/lib/query/query-keys";
import type { ContractPriceDailyReportListParams } from "../types";
import { listContractPriceDailyReports } from "./service";
export function contractPriceDailyReportListQueryOptions(
  params: ContractPriceDailyReportListParams = {}
) {
  return {
    queryKey: QUERY_KEYS.reports.contractPriceDaily.list(params),
    queryFn: () => listContractPriceDailyReports(params),
  };
}
