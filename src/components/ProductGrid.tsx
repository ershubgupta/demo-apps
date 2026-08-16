import { ProductCard } from "./ProductCard";
import type { Product } from "../types/product";

type ProductGridProps = {
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  products: Product[];
};

export function ProductGrid({ isLoading, onSelectProduct, products }: ProductGridProps) {
  if (isLoading) {
    return <div className="empty-state">Loading catalog inventory...</div>;
  }

  if (products.length === 0) {
    return <div className="empty-state">No products match the current filters.</div>;
  }

  return (
    <section className="product-grid" aria-label="Products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
      ))}
    </section>
  );
}
