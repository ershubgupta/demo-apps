import type { ProductFilters, ProductSort } from "../types/product";

export const SORT_LABELS: Record<ProductSort, string> = {
  newest: "Newest",
  priceAsc: "Price: Low to High",
  priceDesc: "Price: High to Low"
};

const SORT_QUERY_MAP: Record<ProductSort, string> = {
  newest: "price",
  priceAsc: "price_asc",
  priceDesc: "price_desc"
};

export function buildProductQuery(filters: ProductFilters) {
  const params = new URLSearchParams();
  const search = filters.search.trim();

  if (search) {
    params.set("search", search);
  }

  if (filters.category !== "All") {
    params.set("category", filters.category);
  }

  params.set("sort", SORT_QUERY_MAP[filters.sort]);

  return params.toString();
}
