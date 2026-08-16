import { QUERY_KEYS } from "@/lib/query/query-keys";
import type { ContractPriceReportListParams } from "../types";
import { listContractPriceReports } from "./service";
export function contractPriceReportListQueryOptions(
  params: ContractPriceReportListParams = {}
) {
  return {
    queryKey: QUERY_KEYS.reports.contractPrice.list(params),
    queryFn: () => listContractPriceReports(params),
  };
}
