import type { ProductSearchResponse } from "./types";

type SearchProductsOptions = {
  signal?: AbortSignal;
};

export async function searchProducts(
  query: string,
  options: SearchProductsOptions = {}
): Promise<ProductSearchResponse> {
  const response = await fetch(
    `/api/debug/products/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: options.signal,
    }
  );

  if (!response.ok) {
    throw new Error(`Product search failed with ${response.status}`);
  }

  return response.json() as Promise<ProductSearchResponse>;
}

export type { DebugProduct, ProductSearchResponse } from "./types";
