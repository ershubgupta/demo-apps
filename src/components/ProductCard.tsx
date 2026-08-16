import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <article className="product-card">
      <button type="button" className="product-card-button" onClick={() => onSelect(product)}>
        <div
          className="product-art"
          role="img"
          aria-label={product.name}
          style={{ backgroundImage: `url(${product.imageUrl})` }}
        />
        <div className="product-card-body">
          <div>
            <p className="product-category">{product.category}</p>
            <h2>{product.name}</h2>
          </div>
          <div className="rating-row" aria-label={`${product.rating} rating from ${product.reviewCount} reviews`}>
            <span aria-hidden="true">★</span>
            <strong>{product.rating}</strong>
            <small>({product.reviewCount.toLocaleString()} reviews)</small>
          </div>
          <div className="product-meta">
            <strong>{currency.format(product.price)}</strong>
            <span className={`stock-pill stock-${product.stockStatus.toLowerCase().replace(" ", "-")}`}>
              {product.stockStatus}
            </span>
          </div>
          <p className="inventory-copy">{product.inventory} units available</p>
        </div>
      </button>
    </article>
  );
}
