import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import type { ProductFilters, ProductResponse } from "../types/product";

type ProductsState = {
  data: ProductResponse | null;
  error: string | null;
  isLoading: boolean;
};

export function useProducts(filters: ProductFilters) {
  const [state, setState] = useState<ProductsState>({
    data: null,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((current) => ({ ...current, error: null, isLoading: true }));

    fetchProducts(filters, controller.signal)
      .then((data) => {
        setState({ data, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({
          data: null,
          error: error instanceof Error ? error.message : "Product request failed",
          isLoading: false
        });
      });

    return () => controller.abort();
  }, [filters]);

  return state;
}
