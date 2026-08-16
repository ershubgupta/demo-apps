"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FilterSidebar } from "./FilterSidebar";
import { featuredProducts } from "./mock-products";
import { ProductGrid } from "./ProductGrid";
import { searchProducts } from "./productSearchApi";
import type { DebugProduct } from "./types";

const categories = ["New arrivals", "Sneakers", "Audio", "Sports", "Outlet"];

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function FixedProductSearch() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [products, setProducts] = useState<DebugProduct[]>(featuredProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const activeRequestController = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    const debounceTimer = window.setTimeout(() => {
      if (!trimmedQuery) {
        activeRequestController.current?.abort();
        activeRequestController.current = null;
        setProducts(featuredProducts);
        setActiveQuery("");
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      activeRequestController.current?.abort();

      const requestController = new AbortController();
      activeRequestController.current = requestController;

      setActiveQuery(trimmedQuery);
      setHasSearched(true);
      setIsLoading(true);

      void searchProducts(trimmedQuery, { signal: requestController.signal })
        .then((response) => {
          setProducts(response.products);
        })
        .catch((error) => {
          if (isAbortError(error)) {
            return;
          }

          setProducts([]);
        })
        .finally(() => {
          if (activeRequestController.current === requestController) {
            activeRequestController.current = null;
            setIsLoading(false);
          }
        });
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    return () => {
      activeRequestController.current?.abort();
    };
  }, []);

  const productCountLabel = useMemo(() => {
    if (isLoading) {
      return "Searching catalog";
    }

    if (!hasSearched) {
      return `${featuredProducts.length} featured products`;
    }

    return `${products.length} ${products.length === 1 ? "product" : "products"} found`;
  }, [hasSearched, isLoading, products.length]);

  const productScopeLabel = hasSearched
    ? `Showing results for ${activeQuery}`
    : "Curated picks across footwear, audio, and member deals";

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-foreground">
      <header className="sticky top-0 z-30 border-b bg-card/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" aria-hidden="true" />
          </Button>
          <Link href="/debug-demos" className="flex shrink-0 items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
              M
            </span>
            <span className="text-lg font-semibold">Marketlane</span>
          </Link>

          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shoes, buds, backpacks, watches, jackets"
              aria-label="Search products"
              className="h-11 rounded-lg border-input bg-secondary pl-12 text-base shadow-none"
              autoFocus
            />
          </div>

          <nav className="hidden items-center gap-1 xl:flex">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="ghost"
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Saved items"
            >
              <Heart className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Cart">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Profile"
            >
              <UserCircle className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="border-t bg-card xl:hidden">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-2">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6">
        <section className="mb-6 rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Marketplace deals
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">
                Search the product catalog
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Browse current inventory, compare discounts, and add products to
                your cart.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Metric label="Delivery" value="2-day" />
              <Metric label="Returns" value="30 days" />
              <Metric label="Members" value="Extra 5%" />
            </div>
          </div>
        </section>

        <div className="flex gap-6">
          <FilterSidebar />

          <section className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">{productCountLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {productScopeLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort</span>
                <Select defaultValue="recommended">
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest rated</SelectItem>
                    <SelectItem value="price-low">Price: low to high</SelectItem>
                    <SelectItem value="discount">Best discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ProductGrid
              products={products}
              isLoading={isLoading}
              query={activeQuery}
              hasSearched={hasSearched}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-secondary px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 whitespace-nowrap text-sm font-semibold">{value}</p>
    </div>
  );
}
