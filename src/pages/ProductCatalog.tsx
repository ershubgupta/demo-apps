import { useMemo, useState } from "react";
import { ProductDetail } from "../components/ProductDetail";
import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import type { Product, ProductFilters as ProductFiltersValue } from "../types/product";
import { SORT_LABELS } from "../utils/productQuery";

const initialFilters: ProductFiltersValue = {
  search: "",
  category: "All",
  sort: "newest"
};

const releaseLabel = import.meta.env.VITE_RELEASE_LABEL ?? "local-dev";

export function ProductCatalog() {
  const [filters, setFilters] = useState<ProductFiltersValue>(initialFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const stableFilters = useMemo(() => filters, [filters]);
  const { data, error, isLoading } = useProducts(stableFilters);

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Storefront Admin</p>
          <h1>Product Catalog</h1>
        </div>
        <div className="header-meta">
          <a href="/">Demo Home</a>
          <span>Production Debug Demo</span>
          <span>Build: {releaseLabel}</span>
        </div>
      </header>

      <section className="catalog-panel">
        <div className="catalog-heading">
          <div>
            <p className="section-label">Demo Store</p>
            <h2>Product Catalog</h2>
          </div>
          <div className="active-sort">Sort: {SORT_LABELS[filters.sort]}</div>
        </div>

        <ProductFilters value={filters} onChange={setFilters} />

        {error ? <div className="error-state">{error}</div> : null}

        {selectedProduct ? <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} /> : null}

        <ProductGrid isLoading={isLoading} products={data?.products ?? []} onSelectProduct={setSelectedProduct} />
      </section>
    </main>
  );
}
