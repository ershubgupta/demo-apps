import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query/query-keys";
import type {
  CatalogStoreItemListParams,
  CatalogStoreListParams,
} from "@/features/catalog-store/types";
import {
  getCatalogStore,
  listCatalogStoreItems,
  listCatalogStores,
} from "./service";

export function catalogStoreListQueryOptions(
  params: CatalogStoreListParams = {}
) {
  return queryOptions({
    queryKey: QUERY_KEYS.catalogStore.list(params),
    queryFn: () => listCatalogStores(params),
  });
}

export function catalogStoreDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.catalogStore.detail(id),
    queryFn: () => getCatalogStore(id),
  });
}

export function catalogStoreItemListQueryOptions(
  catalogId: string,
  params: CatalogStoreItemListParams = {}
) {
  return queryOptions({
    queryKey: QUERY_KEYS.catalogStore.items(catalogId, params),
    queryFn: () => listCatalogStoreItems(catalogId, params),
    placeholderData: keepPreviousData,
  });
}
