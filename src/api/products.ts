import type { ProductFilters, ProductResponse } from "../types/product";
import { getStaticProducts } from "./staticProducts";
import { buildProductQuery } from "../utils/productQuery";

export async function fetchProducts(filters: ProductFilters, signal?: AbortSignal) {
  const query = buildProductQuery(filters);
  try {
    const response = await fetch(`/api/products?${query}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.includes("application/json")) {
      return getStaticProducts(filters);
    }

    return (await response.json()) as ProductResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return getStaticProducts(filters);
  }
}
