import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query/query-keys";
import type {
  ContractPriceItemListParams,
  ContractPriceListParams,
  ContractPricePeriodListParams,
} from "../types";
import {
  getContractPrice,
  listContractPrice,
  listContractPriceItems,
  listContractPricePeriods,
} from "./service";

export function contractPriceListQueryOptions(
  params: ContractPriceListParams = {}
) {
  return queryOptions({
    queryKey: QUERY_KEYS.contractPrice.list(params),
    queryFn: () => listContractPrice(params),
  });
}

export function contractPriceDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.contractPrice.detail(id),
    queryFn: () => getContractPrice(id),
  });
}

export function contractPricePeriodListQueryOptions(
  contractId: string,
  params: ContractPricePeriodListParams = {}
) {
  return queryOptions({
    queryKey: QUERY_KEYS.contractPrice.periods(contractId, params),
    queryFn: () => listContractPricePeriods(contractId, params),
    placeholderData: keepPreviousData,
  });
}

export function contractPriceItemListQueryOptions(
  contractId: string,
  params: ContractPriceItemListParams = {}
) {
  return queryOptions({
    queryKey: QUERY_KEYS.contractPrice.items(contractId, params),
    queryFn: () => listContractPriceItems(contractId, params),
    placeholderData: keepPreviousData,
  });
}
