import { QUERY_KEYS } from "@/lib/query/query-keys";
import type { CatalogStoreReportListParams } from "../types";
import { listCatalogStoreReports } from "./service";
export function catalogStoreReportListQueryOptions(
  params: CatalogStoreReportListParams = {}
) {
  return {
    queryKey: QUERY_KEYS.reports.catalogStore.list(params),
    queryFn: () => listCatalogStoreReports(params),
  };
}
