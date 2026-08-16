export type RouteEntry = {
  description: string;
  name: string;
  path: string;
  source?: string;
  status: string;
};

export const sourceMapCatalogRoute: RouteEntry = {
  name: "Production Source Map Investigation",
  path: "/source-map-debug/product-catalog",
  status: "Active route",
  description: "Product catalog with the deterministic sort mismatch used for source-map debugging."
};

export const legacyRoutes: RouteEntry[] = [
  {
    name: "Cart Coupon Investigation",
    path: "/debug-demos/cart-recorder",
    status: "Archived route",
    description: "Cart discount debugging scenario kept from the previous app.",
    source: "src/pages/CartCouponPage.tsx"
  },
  {
    name: "Stale Search Race",
    path: "/debug-demos/stale-search/broken",
    status: "Archived route",
    description: "Broken stale-search scenario from the previous app.",
    source: "src/features/debug-demos/stale-search/BrokenProductSearch.tsx"
  },
  {
    name: "Stale Search Fixed",
    path: "/debug-demos/stale-search/fixed",
    status: "Archived route",
    description: "Fixed stale-search scenario from the previous app.",
    source: "src/features/debug-demos/stale-search/FixedProductSearch.tsx"
  },
  {
    name: "DOM Removal Broken",
    path: "/debug-demos/dom-removal/broken",
    status: "Archived route",
    description: "Broken detached-DOM debugging scenario from the previous app.",
    source: "src/features/debug-demos/dom-removal/BrokenDatePickerDemo.tsx"
  },
  {
    name: "DOM Removal Fixed",
    path: "/debug-demos/dom-removal/fixed",
    status: "Archived route",
    description: "Fixed detached-DOM debugging scenario from the previous app.",
    source: "src/features/debug-demos/dom-removal/FixedDatePickerDemo.tsx"
  },
  {
    name: "Request Origin Broken",
    path: "/debug-demos/request-origin/broken",
    status: "Archived route",
    description: "Broken duplicate request-origin scenario from the previous app.",
    source: "src/features/debug-demos/request-origin/BrokenDraftEditor.tsx"
  },
  {
    name: "Request Origin Fixed",
    path: "/debug-demos/request-origin/fixed",
    status: "Archived route",
    description: "Fixed duplicate request-origin scenario from the previous app.",
    source: "src/features/debug-demos/request-origin/FixedDraftEditor.tsx"
  }
];

export const allRoutes = [sourceMapCatalogRoute, ...legacyRoutes];
