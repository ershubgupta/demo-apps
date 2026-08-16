import type { ProductFilters, ProductResponse } from "../types/product";
import { buildProductQuery } from "../utils/productQuery";

export async function fetchProducts(filters: ProductFilters, signal?: AbortSignal) {
  const query = buildProductQuery(filters);
  const response = await fetch(`/api/products?${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal
  });

  if (!response.ok) {
    throw new Error(`Product request failed with ${response.status}`);
  }

  return (await response.json()) as ProductResponse;
}
