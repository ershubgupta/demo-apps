export type DemoRoute = {
  description: string;
  name: string;
  path: string;
  source?: string;
  status: string;
};

export const sourceMapCatalogRoute: DemoRoute = {
  name: "Production Source Map Debug Demo",
  path: "/source-map-debug/product-catalog",
  status: "Active Vite route",
  description: "Product catalog with the deterministic sort mismatch used for source-map debugging."
};

export const legacyRoutes: DemoRoute[] = [
  {
    name: "Cart Recorder Discount Demo",
    path: "/debug-demos/cart-recorder",
    status: "Compatibility route",
    description: "Original cart discount debugging demo kept from the previous app.",
    source: "src/features/debug-demos/cart-recorder/CartRecorderDemo.tsx"
  },
  {
    name: "Stale Search Race Demo",
    path: "/debug-demos/stale-search/broken",
    status: "Compatibility route",
    description: "Broken stale-search demo from the previous app.",
    source: "src/features/debug-demos/stale-search/BrokenProductSearch.tsx"
  },
  {
    name: "Stale Search Fixed Demo",
    path: "/debug-demos/stale-search/fixed",
    status: "Compatibility route",
    description: "Fixed stale-search demo from the previous app.",
    source: "src/features/debug-demos/stale-search/FixedProductSearch.tsx"
  },
  {
    name: "DOM Removal Broken Demo",
    path: "/debug-demos/dom-removal/broken",
    status: "Compatibility route",
    description: "Broken detached-DOM debugging demo from the previous app.",
    source: "src/features/debug-demos/dom-removal/BrokenDatePickerDemo.tsx"
  },
  {
    name: "DOM Removal Fixed Demo",
    path: "/debug-demos/dom-removal/fixed",
    status: "Compatibility route",
    description: "Fixed detached-DOM debugging demo from the previous app.",
    source: "src/features/debug-demos/dom-removal/FixedDatePickerDemo.tsx"
  },
  {
    name: "Request Origin Broken Demo",
    path: "/debug-demos/request-origin/broken",
    status: "Compatibility route",
    description: "Broken duplicate request-origin demo from the previous app.",
    source: "src/features/debug-demos/request-origin/BrokenDraftEditor.tsx"
  },
  {
    name: "Request Origin Fixed Demo",
    path: "/debug-demos/request-origin/fixed",
    status: "Compatibility route",
    description: "Fixed duplicate request-origin demo from the previous app.",
    source: "src/features/debug-demos/request-origin/FixedDraftEditor.tsx"
  }
];

export const allRoutes = [sourceMapCatalogRoute, ...legacyRoutes];
