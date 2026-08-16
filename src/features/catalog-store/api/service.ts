"use server";

import { createAuthRequest } from "@/lib/api/auth-request";
import { env } from "@/lib/env";
import {
  catalogStoreDetailSchema,
  catalogStoreItemListParamsSchema,
  catalogStoreItemListResponseSchema,
  catalogStoreListParamsSchema,
  catalogStoreListResponseSchema,
} from "@/features/catalog-store/schemas/schema";
import type {
  CatalogStoreDetail,
  CatalogStoreItemListParams,
  CatalogStoreItemListResponse,
  CatalogStoreListParams,
  CatalogStoreListResponse,
} from "@/features/catalog-store/types";
import {
  getMockCatalogStoreDetail,
  listMockCatalogStoreItems,
  listMockCatalogStores,
} from "./mock";

const catalogApi = createAuthRequest(env.CATALOG_API_URL);

export async function listCatalogStores(
  params: CatalogStoreListParams = {}
): Promise<CatalogStoreListResponse> {
  const searchParams = catalogStoreListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") return listMockCatalogStores(searchParams);

  const response = await catalogApi.get<CatalogStoreListResponse>(
    "/catalog-store",
    { searchParams }
  );
  return catalogStoreListResponseSchema.parse(response);
}

export async function getCatalogStore(
  id: string
): Promise<CatalogStoreDetail | null> {
  if (env.USE_MOCK_API === "true") {
    const catalog = await getMockCatalogStoreDetail(id);
    return catalog ? catalogStoreDetailSchema.parse(catalog) : null;
  }
  try {
    const response = await catalogApi.get<CatalogStoreDetail>(
      `/catalog-store/${encodeURIComponent(id)}`
    );
    return catalogStoreDetailSchema.parse(response);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function listCatalogStoreItems(
  catalogId: string,
  params: CatalogStoreItemListParams = {}
): Promise<CatalogStoreItemListResponse> {
  const searchParams = catalogStoreItemListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") {
    const response = await listMockCatalogStoreItems(catalogId, searchParams);
    return catalogStoreItemListResponseSchema.parse(response);
  }
  const response = await catalogApi.get<CatalogStoreItemListResponse>(
    `/catalog-store/${encodeURIComponent(catalogId)}/items`,
    { searchParams }
  );
  return catalogStoreItemListResponseSchema.parse(response);
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && /status\s+404/i.test(error.message);
}
