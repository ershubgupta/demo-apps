import { queryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query/query-keys";
import { getCatalog, listCatalogItems, listCatalogs } from "./service";
import type {
  CatalogItemListParams,
  CatalogListParams,
} from "@/features/catalog-ho/types";

export function catalogListQueryOptions(params: CatalogListParams = {}) {
  return queryOptions({
    queryKey: QUERY_KEYS.catalog.list(params),
    queryFn: () => listCatalogs(params),
  });
}

export function catalogDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.catalog.detail(id),
    queryFn: () => getCatalog(id),
  });
}

export function catalogItemListQueryOptions(
  catalogId: string,
  params: CatalogItemListParams = {}
) {
  return queryOptions({
    queryKey: QUERY_KEYS.catalog.items(catalogId, params),
    queryFn: () => listCatalogItems(catalogId, params),
  });
}
