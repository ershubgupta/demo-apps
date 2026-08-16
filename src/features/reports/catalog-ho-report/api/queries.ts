import { QUERY_KEYS } from "@/lib/query/query-keys";
import type { CatalogHoReportListParams } from "../types";
import { listCatalogHoReports } from "./service";
export function catalogHoReportListQueryOptions(
  params: CatalogHoReportListParams = {}
) {
  return {
    queryKey: QUERY_KEYS.reports.catalogHo.list(params),
    queryFn: () => listCatalogHoReports(params),
  };
}
