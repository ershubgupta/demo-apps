import type { Product } from "../types/product";

type ProductDetailProps = {
  product: Product;
  onClose: () => void;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  return (
    <section className="product-detail" aria-label="Product detail">
      <div
        className="product-detail-image"
        role="img"
        aria-label={product.name}
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
      <div className="product-detail-copy">
        <button type="button" className="back-button" onClick={onClose}>
          Back to catalog
        </button>
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="rating-row">
          <span aria-hidden="true">★</span>
          <strong>{product.rating}</strong>
          <small>{product.reviewCount.toLocaleString()} reviews</small>
        </div>
        <p className="detail-price">{currency.format(product.price)}</p>
        <p className="detail-description">{product.description}</p>
        <div className="detail-stock-row">
          <span className={`stock-pill stock-${product.stockStatus.toLowerCase().replace(" ", "-")}`}>
            {product.stockStatus}
          </span>
          <span>{product.inventory} units available</span>
        </div>
      </div>
    </section>
  );
}
