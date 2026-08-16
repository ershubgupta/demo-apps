import { SearchX } from "lucide-react";

import type { DebugProduct } from "./types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: DebugProduct[];
  isLoading: boolean;
  query: string;
  hasSearched: boolean;
};

export function ProductGrid({
  products,
  isLoading,
  query,
  hasSearched,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border bg-card shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="flex items-center justify-between pt-4">
                <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                <div className="h-9 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length > 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed bg-card px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold">
        {hasSearched ? "No matching products" : "Start a product search"}
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {hasSearched
          ? `No products were found for "${query}". Try shoes, buds, backpacks, watches, jackets, or sunglasses.`
          : "Search the storefront catalog by product type, brand, or category."}
      </p>
    </div>
  );
}
