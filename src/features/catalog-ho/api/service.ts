"use server";

import { createAuthRequest } from "@/lib/api/auth-request";
import { env } from "@/lib/env";
import {
  catalogDetailSchema,
  catalogItemListParamsSchema,
  catalogItemListResponseSchema,
  catalogListParamsSchema,
} from "@/features/catalog-ho/schemas/schema";
import type {
  CatalogDetail,
  CatalogItemListParams,
  CatalogItemListResponse,
  CatalogListParams,
  CatalogListResponse,
} from "@/features/catalog-ho/types";
import {
  getMockCatalogDetail,
  listMockCatalogItems,
  listMockCatalogs,
} from "./mock";

const catalogApi = createAuthRequest(env.CATALOG_API_URL);

/**
 * Reference feature service: server-only catalog list call with centralized auth headers.
 */
export async function listCatalogs(params: CatalogListParams = {}) {
  const searchParams = catalogListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") return listMockCatalogs(searchParams);
  return catalogApi.get<CatalogListResponse>("/catalog-ho/", { searchParams });
}

export async function getCatalog(id: string): Promise<CatalogDetail | null> {
  if (env.USE_MOCK_API === "true") {
    const catalog = await getMockCatalogDetail(id);
    return catalog ? catalogDetailSchema.parse(catalog) : null;
  }
  try {
    const response = await catalogApi.get<CatalogDetail>(
      `/catalog-ho/${encodeURIComponent(id)}`
    );
    return catalogDetailSchema.parse(response);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function listCatalogItems(
  catalogId: string,
  params: CatalogItemListParams = {}
): Promise<CatalogItemListResponse> {
  const searchParams = catalogItemListParamsSchema.parse(params);
  if (env.USE_MOCK_API === "true") {
    const response = await listMockCatalogItems(catalogId, searchParams);
    return catalogItemListResponseSchema.parse(response);
  }
  const response = await catalogApi.get<CatalogItemListResponse>(
    `/catalog-ho/${encodeURIComponent(catalogId)}/items`,
    { searchParams }
  );
  return catalogItemListResponseSchema.parse(response);
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && /status\s+404/i.test(error.message);
}
