import { useMemo, useState } from "react";
import { useCoupon } from "../cart/hooks/useCoupon";
import { routeHref } from "../routing";

type CartProduct = {
  category: string;
  description: string;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
};

type CartStep = "products" | "detail" | "cart";

const products: CartProduct[] = [
  {
    id: "wireless-headphones",
    name: "Wireless Headphones",
    category: "Audio",
    price: 2000,
    rating: 4.8,
    reviewCount: 1284,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description:
      "Bluetooth over-ear headphones with active noise cancellation, 30-hour battery life, and quick USB-C charging.",
  },
  {
    id: "travel-backpack",
    name: "Travel Backpack",
    category: "Bags",
    price: 3200,
    rating: 4.6,
    reviewCount: 812,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description:
      "Durable 28L backpack with a padded laptop sleeve and weather-resistant finish.",
  },
  {
    id: "smart-watch",
    name: "Smart Fitness Watch",
    category: "Watches",
    price: 4500,
    rating: 4.5,
    reviewCount: 943,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description:
      "Daily activity tracking, heart-rate monitoring, and phone notifications in a slim case.",
  },
  {
    id: "classic-leather-watch",
    name: "Classic Leather Watch",
    category: "Watches",
    price: 2800,
    rating: 4.6,
    reviewCount: 618,
    imageUrl:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    description:
      "Minimal analog watch with a polished steel case and soft leather strap.",
  },
  {
    id: "sport-chronograph-watch",
    name: "Sport Chronograph Watch",
    category: "Watches",
    price: 3600,
    rating: 4.4,
    reviewCount: 771,
    imageUrl:
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80",
    description:
      "Water-resistant chronograph watch with luminous markers and a textured dial.",
  },
  {
    id: "hybrid-metal-watch",
    name: "Hybrid Metal Watch",
    category: "Watches",
    price: 5200,
    rating: 4.7,
    reviewCount: 489,
    imageUrl:
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80",
    description:
      "Premium hybrid watch with activity tracking and a stainless steel link bracelet.",
  },
  {
    id: "wireless-speaker",
    name: "Portable Wireless Speaker",
    category: "Audio",
    price: 1800,
    rating: 4.4,
    reviewCount: 677,
    imageUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    description:
      "Compact speaker with room-filling sound, water resistance, and a 12-hour battery.",
  },
  {
    id: "desk-lamp",
    name: "Adjustable Desk Lamp",
    category: "Home office",
    price: 1450,
    rating: 4.7,
    reviewCount: 534,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description:
      "Dimmable LED desk lamp with warm and cool light modes for focused work.",
  },
];

const formatPrice = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
}).format;

const couponLabels: Record<string, string> = {
  SAVE10PERCENT: "10% discount",
  SAVE20: "20% discount",
  SAVE30: "30% discount",
};

function getInitialCartState() {
  return {
    appliedCoupon: null as string | null,
    cartId: "cart-1001",
    couponCode: "",
    discountRate: 0,
    lastAppliedCoupon: null as string | null,
    product: null as CartProduct | null,
    quantity: 0,
  };
}

export function CartCouponPage() {
  const [step, setStep] = useState<CartStep>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(
    null
  );
  const [cart, setCart] = useState(getInitialCartState);
  const { applyCoupon, error: couponError, isApplying } = useCoupon();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter(
      (product) =>
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const subtotal = cart.product ? cart.product.price * cart.quantity : 0;
  const discountAmount = subtotal * cart.discountRate;
  const total = subtotal - discountAmount;

  function resetCart() {
    setStep("products");
    setSearchQuery("");
    setSelectedProduct(null);
    setCart(getInitialCartState());
  }

  function openProduct(product: CartProduct) {
    setSelectedProduct(product);
    setStep("detail");
  }

  function addSelectedProductToCart() {
    if (!selectedProduct) {
      return;
    }

    setCart({
      appliedCoupon: null,
      cartId: "cart-1001",
      couponCode: "",
      discountRate: 0,
      lastAppliedCoupon: null,
      product: selectedProduct,
      quantity: 1,
    });
    setStep("cart");
  }

  async function handleApplyCoupon() {
    const enteredCoupon = cart.couponCode;
    try {
      const response = await applyCoupon(
        {
          appliedCoupon: cart.appliedCoupon,
          cartId: cart.cartId,
        },
        enteredCoupon
      );

      setCart((currentCart) => ({
        ...currentCart,
        appliedCoupon: currentCart.appliedCoupon ?? response.couponCode,
        couponCode: enteredCoupon,
        discountRate: currentCart.appliedCoupon
          ? currentCart.discountRate
          : response.discountRate,
        lastAppliedCoupon: response.couponCode,
      }));
    } catch {
      setCart((currentCart) => ({
        ...currentCart,
        couponCode: enteredCoupon,
      }));
    }
  }

  return (
    <main className="legacy-cart-page">
      <header className="legacy-cart-header">
        <div className="legacy-cart-header-inner">
          <div className="legacy-cart-brand-group">
            <a
              className="legacy-icon-button"
              href={routeHref("/")}
              aria-label="Back to workbench"
            >
              &lt;
            </a>
            <div className="legacy-cart-brand">
              <span>M</span>
              <div>
                <p>Marketlane</p>
                <small>Premium marketplace</small>
              </div>
            </div>
          </div>
          <div className="legacy-cart-actions">
            <button
              type="button"
              className="legacy-button legacy-button-outline"
              data-testid="cart-button"
              onClick={() => setStep("cart")}
            >
              Cart {cart.quantity > 0 ? `(${cart.quantity})` : ""}
            </button>
            <button
              type="button"
              className="legacy-button legacy-button-outline"
              data-testid="start-over-button"
              onClick={resetCart}
            >
              My Account
            </button>
          </div>
        </div>
      </header>

      <div className="legacy-cart-container">
        {step === "products" ? (
          <ProductsView
            filteredProducts={filteredProducts}
            onOpenProduct={openProduct}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
          />
        ) : null}

        {step === "detail" && selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onAddToCart={addSelectedProductToCart}
            onBack={() => setStep("products")}
          />
        ) : null}

        {step === "cart" ? (
          <CartView
            cart={cart}
            couponError={couponError}
            discountAmount={discountAmount}
            isApplying={isApplying}
            onApplyCoupon={handleApplyCoupon}
            onContinueShopping={() => setStep("products")}
            onCouponChange={(couponCode) =>
              setCart((currentCart) => ({ ...currentCart, couponCode }))
            }
            onDecreaseQuantity={() =>
              setCart((currentCart) => ({
                ...currentCart,
                quantity: Math.max(currentCart.quantity - 1, 1),
              }))
            }
            onIncreaseQuantity={() =>
              setCart((currentCart) => ({
                ...currentCart,
                quantity: currentCart.quantity + 1,
              }))
            }
            subtotal={subtotal}
            total={total}
          />
        ) : null}
      </div>
    </main>
  );
}

function ProductsView({
  filteredProducts,
  onOpenProduct,
  onSearchChange,
  searchQuery,
}: {
  filteredProducts: CartProduct[];
  onOpenProduct: (product: CartProduct) => void;
  onSearchChange: (value: string) => void;
  searchQuery: string;
}) {
  return (
    <section>
      <div className="legacy-card legacy-products-toolbar">
        <div>
          <p>Product listing</p>
          <h1>Shop popular products</h1>
          <span>
            Search the current catalog and open a product detail page.
          </span>
        </div>
        <div className="legacy-search-field">
          <span aria-hidden="true">Search</span>
          <input
            aria-label="Search products"
            data-testid="product-search-input"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search headphones"
            value={searchQuery}
          />
        </div>
      </div>

      <div className="legacy-product-grid">
        {filteredProducts.map((product) => (
          <article className="legacy-product-card" key={product.id}>
            <button
              type="button"
              aria-label={`Open ${product.name}`}
              data-testid={`product-card-${product.id}`}
              onClick={() => onOpenProduct(product)}
            >
              <div
                role="img"
                aria-label={product.name}
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
              <div>
                <p>{product.category}</p>
                <h2>{product.name}</h2>
                <div className="legacy-rating-row">
                  <span aria-hidden="true">{"\u2605"}</span>
                  <strong>{product.rating}</strong>
                  <small>({product.reviewCount})</small>
                </div>
                <strong>{formatPrice(product.price)}</strong>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductDetailView({
  product,
  onAddToCart,
  onBack,
}: {
  product: CartProduct;
  onAddToCart: () => void;
  onBack: () => void;
}) {
  return (
    <section className="legacy-detail-layout">
      <div
        className="legacy-card legacy-detail-image"
        role="img"
        aria-label={product.name}
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
      <div className="legacy-card legacy-detail-copy">
        <button
          type="button"
          className="legacy-button legacy-button-outline"
          onClick={onBack}
        >
          Back to products
        </button>
        <p>{product.category}</p>
        <h1>{product.name}</h1>
        <div className="legacy-rating-row">
          <span aria-hidden="true">{"\u2605"}</span>
          <strong>{product.rating}</strong>
          <small>{product.reviewCount} reviews</small>
        </div>
        <strong>{formatPrice(product.price)}</strong>
        <p>{product.description}</p>
        <button
          type="button"
          className="legacy-button legacy-button-primary"
          data-testid="add-to-cart-button"
          onClick={onAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </section>
  );
}

function CartView({
  cart,
  couponError,
  discountAmount,
  isApplying,
  onApplyCoupon,
  onContinueShopping,
  onCouponChange,
  onDecreaseQuantity,
  onIncreaseQuantity,
  subtotal,
  total,
}: {
  cart: ReturnType<typeof getInitialCartState>;
  couponError: string | null;
  discountAmount: number;
  isApplying: boolean;
  onApplyCoupon: () => Promise<void>;
  onContinueShopping: () => void;
  onCouponChange: (value: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  subtotal: number;
  total: number;
}) {
  if (!cart.product) {
    return (
      <section className="legacy-card legacy-empty-cart">
        <h1>Your cart is empty</h1>
        <p>Continue shopping to add an item to the cart.</p>
        <button
          type="button"
          className="legacy-button legacy-button-primary"
          onClick={onContinueShopping}
        >
          Continue shopping
        </button>
      </section>
    );
  }

  return (
    <section className="legacy-cart-review">
      <div className="legacy-card">
        <div className="legacy-cart-review-header">
          <div>
            <p>Cart</p>
            <h1>Review your order</h1>
          </div>
          <button
            type="button"
            className="legacy-button legacy-button-outline"
            onClick={onContinueShopping}
          >
            Continue shopping
          </button>
        </div>

        <div className="legacy-cart-line">
          <div
            role="img"
            aria-label={cart.product.name}
            style={{ backgroundImage: `url(${cart.product.imageUrl})` }}
          />
          <div>
            <p>{cart.product.category}</p>
            <h2>{cart.product.name}</h2>
            <span>Ships tomorrow from the nearest fulfillment center.</span>
            <strong>{formatPrice(cart.product.price)}</strong>
          </div>
          <div className="legacy-quantity-control">
            <button
              type="button"
              aria-label="Decrease Quantity"
              data-testid="decrease-quantity-button"
              onClick={onDecreaseQuantity}
            >
              -
            </button>
            <span aria-label="Cart quantity" data-testid="cart-quantity">
              {cart.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase Quantity"
              data-testid="increase-quantity-button"
              onClick={onIncreaseQuantity}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <aside className="legacy-card legacy-order-summary">
        <h2>Order summary</h2>
        <label htmlFor="promo-code">Promo code</label>
        <div className="legacy-promo-row">
          <input
            id="promo-code"
            aria-label="Promo code"
            data-testid="coupon-input"
            onChange={(event) => onCouponChange(event.target.value)}
            placeholder="SAVE10PERCENT"
            value={cart.couponCode}
          />
          <button
            type="button"
            className="legacy-button legacy-button-primary"
            data-testid="apply-coupon-button"
            disabled={isApplying}
            onClick={() => {
              void onApplyCoupon();
            }}
          >
            {isApplying ? "Applying" : "Apply"}
          </button>
        </div>
        {cart.lastAppliedCoupon ? (
          <p>{couponLabels[cart.lastAppliedCoupon] ?? "Promo code"} applied</p>
        ) : null}
        {couponError ? (
          <p className="legacy-coupon-error">{couponError}</p>
        ) : null}
        <dl>
          <SummaryRow
            label="Subtotal"
            testId="cart-subtotal"
            value={formatPrice(subtotal)}
          />
          <SummaryRow
            label={
              cart.lastAppliedCoupon
                ? (couponLabels[cart.lastAppliedCoupon] ?? "Coupon discount")
                : "Coupon discount"
            }
            testId="cart-discount"
            value={`-${formatPrice(discountAmount)}`}
          />
          <SummaryRow
            label="Total"
            strong
            testId="cart-total"
            value={formatPrice(total)}
          />
        </dl>
      </aside>
    </section>
  );
}

function SummaryRow({
  label,
  strong,
  testId,
  value,
}: {
  label: string;
  strong?: boolean;
  testId: string;
  value: string;
}) {
  return (
    <div
      className={
        strong
          ? "legacy-summary-row legacy-summary-row-strong"
          : "legacy-summary-row"
      }
    >
      <dt>{label}</dt>
      <dd data-testid={testId}>{value}</dd>
    </div>
  );
}
