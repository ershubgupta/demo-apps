import { ShoppingCart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DebugProduct } from "./types";

type ProductCardProps = {
  product: DebugProduct;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div
          role="img"
          aria-label={product.name}
          className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.imageUrl})` }}
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex min-h-52 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {product.category}
          </p>
          <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-foreground">
            {product.name}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star
            className="size-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span className="font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">
                {currencyFormatter.format(product.price)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {currencyFormatter.format(product.originalPrice)}
              </span>
            </div>
            <p className="text-xs font-medium text-status-active">
              {product.discountLabel}
            </p>
          </div>
          <Button type="button" size="sm" className="gap-2 whitespace-nowrap">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
