"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgePercent,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DemoProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
};

type DemoStep = "products" | "detail" | "cart";

const products: DemoProduct[] = [
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
  {
    id: "coffee-tumbler",
    name: "Insulated Coffee Tumbler",
    category: "Kitchen",
    price: 950,
    rating: 4.6,
    reviewCount: 1189,
    imageUrl:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
    description:
      "Leak-resistant stainless steel tumbler that keeps drinks hot or cold for hours.",
  },
  {
    id: "tablet-stand",
    name: "Aluminum Tablet Stand",
    category: "Accessories",
    price: 1250,
    rating: 4.5,
    reviewCount: 461,
    imageUrl:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80",
    description:
      "Stable foldable stand for tablets, phones, and compact second-screen setups.",
  },
  {
    id: "packing-cubes",
    name: "Travel Packing Cube Set",
    category: "Travel",
    price: 1100,
    rating: 4.4,
    reviewCount: 729,
    imageUrl:
      "https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight packing cubes with mesh panels for organized weekend trips.",
  },
  {
    id: "wireless-mouse",
    name: "Ergonomic Wireless Mouse",
    category: "Computer accessories",
    price: 1600,
    rating: 4.6,
    reviewCount: 1016,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    description:
      "Quiet-click wireless mouse with adjustable DPI and a sculpted right-hand grip.",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatPrice(value: number) {
  return currencyFormatter.format(value);
}

function getInitialCartState() {
  return {
    product: null as DemoProduct | null,
    quantity: 0,
    couponCode: "",
    appliedCoupon: "",
  };
}

export function CartRecorderDemo() {
  const [step, setStep] = useState<DemoStep>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(
    null
  );
  const [cart, setCart] = useState(getInitialCartState);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [searchQuery]);

  const subtotal = cart.product ? cart.product.price * cart.quantity : 0;
  const discountAmount =
    cart.appliedCoupon === "SAVE10PERCENT" ? subtotal * 0.1 : 0;
  const total = Math.max(subtotal - discountAmount, 0);

  function resetDemo() {
    setStep("products");
    setSearchQuery("");
    setSelectedProduct(null);
    setCart(getInitialCartState());
  }

  function openProduct(product: DemoProduct) {
    setSelectedProduct(product);
    setStep("detail");
  }

  function addSelectedProductToCart() {
    if (!selectedProduct) {
      return;
    }

    setCart({
      product: selectedProduct,
      quantity: 1,
      couponCode: "",
      appliedCoupon: "",
    });
    setStep("cart");
  }

  function applyCoupon() {
    if (cart.couponCode.trim().toUpperCase() !== "SAVE10PERCENT") {
      return;
    }

    setCart((currentCart) => ({
      ...currentCart,
      couponCode: "SAVE10PERCENT",
      appliedCoupon: "SAVE10PERCENT",
    }));
  }

  function increaseQuantity() {
    setCart((currentCart) => ({
      ...currentCart,
      quantity: currentCart.quantity + 1,
    }));
  }

  function decreaseQuantity() {
    setCart((currentCart) => ({
      ...currentCart,
      quantity: Math.max(currentCart.quantity - 1, 1),
    }));
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-foreground">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="Back to demos"
            >
              <Link href="/debug-demos">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
                M
              </span>
              <div>
                <p className="text-sm font-semibold">Marketlane</p>
                <p className="text-xs text-muted-foreground">
                  Premium marketplace
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              aria-label="Open cart"
              data-testid="cart-button"
              onClick={() => setStep("cart")}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              Cart {cart.quantity > 0 ? `(${cart.quantity})` : ""}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetDemo}
              data-testid="start-over-button"
            >
              Start over
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        {step === "products" ? (
          <ProductsView
            searchQuery={searchQuery}
            filteredProducts={filteredProducts}
            onSearchChange={setSearchQuery}
            onOpenProduct={openProduct}
          />
        ) : null}

        {step === "detail" && selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setStep("products")}
            onAddToCart={addSelectedProductToCart}
          />
        ) : null}

        {step === "cart" ? (
          <CartView
            cart={cart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            onCouponChange={(couponCode) =>
              setCart((currentCart) => ({ ...currentCart, couponCode }))
            }
            onApplyCoupon={applyCoupon}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            onContinueShopping={() => setStep("products")}
          />
        ) : null}
      </div>
    </main>
  );
}

function ProductsView({
  searchQuery,
  filteredProducts,
  onSearchChange,
  onOpenProduct,
}: {
  searchQuery: string;
  filteredProducts: DemoProduct[];
  onSearchChange: (value: string) => void;
  onOpenProduct: (product: DemoProduct) => void;
}) {
  return (
    <section>
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Product listing
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              Shop popular products
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Search the current catalog and open a product detail page.
            </p>
          </div>
          <div className="relative w-full lg:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              aria-label="Search products"
              placeholder="Search headphones"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-10"
              data-testid="product-search-input"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-lg border bg-card shadow-sm"
          >
            <button
              type="button"
              aria-label={`Open ${product.name}`}
              className="block w-full text-left"
              data-testid={`product-card-${product.id}`}
              onClick={() => onOpenProduct(product)}
            >
              <div
                role="img"
                aria-label={product.name}
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
              <div className="p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {product.category}
                </p>
                <h2 className="mt-1 min-h-10 text-sm font-semibold leading-5">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <Star
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span>{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                <p className="mt-3 text-lg font-semibold">
                  {formatPrice(product.price)}
                </p>
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
  onBack,
  onAddToCart,
}: {
  product: DemoProduct;
  onBack: () => void;
  onAddToCart: () => void;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div
          role="img"
          aria-label={product.name}
          className="aspect-[16/10] bg-cover bg-center"
          style={{ backgroundImage: `url(${product.imageUrl})` }}
        />
      </div>
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to products
        </Button>
        <p className="mt-5 text-sm font-medium uppercase text-muted-foreground">
          {product.category}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Star
            className="size-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">
            {product.reviewCount} reviews
          </span>
        </div>
        <p className="mt-4 text-3xl font-semibold">
          {formatPrice(product.price)}
        </p>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        <Button
          type="button"
          className="mt-6 w-full gap-2"
          aria-label={`Add ${product.name} to cart`}
          data-testid="add-to-cart-button"
          onClick={onAddToCart}
        >
          <ShoppingCart className="size-4" aria-hidden="true" />
          Add to Cart
        </Button>
      </div>
    </section>
  );
}

function CartView({
  cart,
  subtotal,
  discountAmount,
  total,
  onCouponChange,
  onApplyCoupon,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onContinueShopping,
}: {
  cart: ReturnType<typeof getInitialCartState>;
  subtotal: number;
  discountAmount: number;
  total: number;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onContinueShopping: () => void;
}) {
  if (!cart.product) {
    return (
      <section className="rounded-lg border bg-card p-8 text-center shadow-sm">
        <PackageCheck
          className="mx-auto size-10 text-muted-foreground"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue shopping to add an item to the cart.
        </p>
        <Button type="button" className="mt-5" onClick={onContinueShopping}>
          Continue shopping
        </Button>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cart</p>
            <h1 className="text-2xl font-semibold tracking-normal">
              Review your order
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={onContinueShopping}>
            Continue shopping
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
          <div
            role="img"
            aria-label={cart.product.name}
            className="aspect-[4/3] w-full rounded-lg bg-cover bg-center sm:w-44"
            style={{ backgroundImage: `url(${cart.product.imageUrl})` }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {cart.product.category}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{cart.product.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ships tomorrow from the nearest fulfillment center.
            </p>
            <p className="mt-3 font-semibold">
              {formatPrice(cart.product.price)}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease Quantity"
              data-testid="decrease-quantity-button"
              onClick={onDecreaseQuantity}
            >
              <Minus className="size-4" aria-hidden="true" />
            </Button>
            <span
              className="flex h-9 w-10 items-center justify-center rounded-md border bg-secondary text-sm font-semibold"
              aria-label="Cart quantity"
              data-testid="cart-quantity"
            >
              {cart.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase Quantity"
              data-testid="increase-quantity-button"
              onClick={onIncreaseQuantity}
            >
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <aside className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-4">
          <BadgePercent
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="text-base font-semibold">Order summary</h2>
        </div>

        <label className="mt-5 block text-sm font-medium" htmlFor="promo-code">
          Promo code
        </label>
        <div className="mt-2 flex gap-2">
          <Input
            id="promo-code"
            aria-label="Promo code"
            value={cart.couponCode}
            onChange={(event) => onCouponChange(event.target.value)}
            placeholder="SAVE10PERCENT"
            data-testid="coupon-input"
          />
          <Button
            type="button"
            aria-label="Apply Coupon"
            data-testid="apply-coupon-button"
            onClick={onApplyCoupon}
          >
            Apply
          </Button>
        </div>
        {cart.appliedCoupon ? (
          <p className="mt-2 text-sm font-medium text-status-active">
            Promo code {cart.appliedCoupon} applied
          </p>
        ) : null}

        <dl className="mt-6 space-y-3 text-sm">
          <SummaryRow
            label="Subtotal"
            value={formatPrice(subtotal)}
            testId="cart-subtotal"
          />
          <SummaryRow
            label="10% discount"
            value={`-${formatPrice(discountAmount)}`}
            testId="cart-discount"
          />
          <div className="border-t pt-3">
            <SummaryRow
              label="Total"
              value={formatPrice(total)}
              testId="cart-total"
              strong
            />
          </div>
        </dl>
      </aside>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  testId,
  strong = false,
}: {
  label: string;
  value: string;
  testId: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={strong ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd
        className={strong ? "text-lg font-semibold" : "font-medium"}
        data-testid={testId}
      >
        {value}
      </dd>
    </div>
  );
}
