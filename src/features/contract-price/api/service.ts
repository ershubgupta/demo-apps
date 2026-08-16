"use server";

import { createAuthRequest } from "@/lib/api/auth-request";
import { env } from "@/lib/env";
import {
  getMockContractPriceDetail,
  listMockContractPriceItems,
  listMockContractPricePeriods,
  listMockContractPrices,
} from "./mock";
import type {
  ContractPriceDetail,
  ContractPriceItemListParams,
  ContractPriceItemListResponse,
  ContractPriceListParams,
  ContractPriceListResponse,
  ContractPricePeriodListParams,
  ContractPricePeriodListResponse,
} from "../types";
import {
  contractPriceDetailSchema,
  contractPriceItemListParamsSchema,
  contractPriceItemListResponseSchema,
  contractPriceListParamsSchema,
  contractPriceListResponseSchema,
  contractPricePeriodListParamsSchema,
  contractPricePeriodListResponseSchema,
} from "../schemas/schema";

const contractApi = createAuthRequest(env.CONTRACT_PRICE_API_URL);

export async function listContractPrice(
  params: ContractPriceListParams = {}
): Promise<ContractPriceListResponse> {
  const searchParams = contractPriceListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") return listMockContractPrices(searchParams);

  const response = await contractApi.get<ContractPriceListResponse>(
    "/contract-price",
    { searchParams }
  );
  return contractPriceListResponseSchema.parse(response);
}

export async function getContractPrice(
  id: string
): Promise<ContractPriceDetail | null> {
  if (env.USE_MOCK_API === "true") {
    const contract = await getMockContractPriceDetail(id);
    return contract ? contractPriceDetailSchema.parse(contract) : null;
  }
  try {
    const response = await contractApi.get<ContractPriceDetail>(
      `/contract-price/${encodeURIComponent(id)}`
    );
    return contractPriceDetailSchema.parse(response);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function listContractPricePeriods(
  contractId: string,
  params: ContractPricePeriodListParams = {}
): Promise<ContractPricePeriodListResponse> {
  const searchParams = contractPricePeriodListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") {
    const response = await listMockContractPricePeriods(
      contractId,
      searchParams
    );
    return contractPricePeriodListResponseSchema.parse(response);
  }
  const { status, ...rest } = searchParams;
  const response = await contractApi.get<ContractPricePeriodListResponse>(
    `/contract-price/${encodeURIComponent(contractId)}/periods`,
    {
      searchParams: {
        ...rest,
        ...(status?.length ? { status: status.join(",") } : {}),
      },
    }
  );
  return contractPricePeriodListResponseSchema.parse(response);
}

export async function listContractPriceItems(
  contractId: string,
  params: ContractPriceItemListParams = {}
): Promise<ContractPriceItemListResponse> {
  const searchParams = contractPriceItemListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") {
    const response = await listMockContractPriceItems(contractId, searchParams);
    return contractPriceItemListResponseSchema.parse(response);
  }
  const response = await contractApi.get<ContractPriceItemListResponse>(
    `/contract-price/${encodeURIComponent(contractId)}/items`,
    { searchParams }
  );
  return contractPriceItemListResponseSchema.parse(response);
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && /status\s+404/i.test(error.message);
}
