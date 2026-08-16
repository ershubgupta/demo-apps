# Production Has No Source Maps. Now What?

Production-style React/Vite frontend demo for the DiAverageGuy video. The app is intentionally small, but the bug path is layered like a normal frontend: page state, filter controls, a hook, an API client, and a query builder.

## Critical Design Review

The core idea is technically realistic if the demo stays honest about what is being shown:

- Public source maps are common in development-like deployments and occasionally in production, but many teams do not expose them publicly.
- Keeping matching private maps is a common release-artifact pattern. The important rule is that the public JS and private `.map` must come from the same production build.
- Manually loading a private source map in Chrome is a supported DevTools workflow, but it requires local access to the exact map and source-map support enabled in DevTools.
- The no-map build cannot recover original TypeScript or React component source. It can still be debugged via generated/minified JavaScript, Network, call stacks, and XHR/fetch breakpoints.

## Architecture

```text
src/
  api/products.ts
  components/ProductCard.tsx
  components/ProductDetail.tsx
  components/ProductFilters.tsx
  components/ProductGrid.tsx
  hooks/useProducts.ts
  pages/DemoHome.tsx
  pages/ProductCatalog.tsx
  types/product.ts
  utils/productQuery.ts
  App.tsx
  main.tsx
  styles.css
scripts/
  build-release.mjs
  dev-server.mjs
  mock-products.mjs
  serve-map-artifacts.mjs
  serve-release.mjs
  server-utils.mjs
```

The active app is Vite React. `/` is a home/navigator page, and the source-map recording target is `/source-map-debug/product-catalog`. Older files from the previous Next demo are kept in the repo and listed on the navigator, but they are not served by the Vite workflow.

## Intentional Bug

The UI uses `ProductSort` values:

```text
newest
priceAsc
priceDesc
```

The API query builder in `src/utils/productQuery.ts` maps those UI values to backend query tokens. The intentional bug is:

```text
newest -> price
```

So the screen clearly shows `Sort: Newest`, while DevTools Network shows:

```text
GET /api/products?sort=price
```

This is deterministic and realistic because the request is built outside the UI component through a mapping/configuration layer.

## Commands

Install:

```bash
pnpm install
```

Development server with real `/api/products` fetches:

```bash
pnpm run dev
```

Open:

```text
http://127.0.0.1:5173/
http://127.0.0.1:5173/source-map-debug/product-catalog
```

Build A, public source maps:

```bash
pnpm run build:maps
pnpm run serve:maps
```

Build B, public bundle with private retained maps:

```bash
pnpm run build:hidden-map
pnpm run serve:hidden-map
pnpm run serve:map
```

Build C, no source maps:

```bash
pnpm run build:no-map
pnpm run serve:no-map
```

Use `PORT=4180` or `MAP_PORT=4181` if you need different ports.

## Build Strategy

### Build A: `release-map-public`

`pnpm run build:maps` runs a normal Vite production build with `build.sourcemap: true`.

Output:

```text
dist-public-map/
  index.html
  assets/*.js
  assets/*.css
  assets/*.js.map
```

The generated JS contains a `//# sourceMappingURL=...js.map` comment, and the map file is publicly served next to the JS.

### Build B: `release-map-private`

`npm run build:hidden-map` runs one Vite production build with source maps enabled, then moves `.map` files out of the public directory.

Output:

```text
dist-private-public/
  index.html
  assets/*.js
  assets/*.css

release-artifacts/release-map-private/
  assets/*.js.map
  MAP_MANIFEST.json
```

The public JS still contains `sourceMappingURL`, so Chrome initially tries and fails to load the missing public map. The retained private map is the exact file from that same build.

### Build C: `release-no-map`

`npm run build:no-map` runs Vite with `build.sourcemap: false`.

Output:

```text
dist-no-map/
  index.html
  assets/*.js
  assets/*.css
```

The JS has no `sourceMappingURL` comment and no `.map` file is generated.

## Chrome Verification

Before each recording pass, open DevTools, right-click the reload button, and choose `Empty Cache and Hard Reload`. Keep DevTools open while testing.

### Build A

1. Run `pnpm run build:maps` and `pnpm run serve:maps`.
2. Open `http://127.0.0.1:4173/source-map-debug/product-catalog`.
3. Confirm the header shows `Build: release-map-public`.
4. Select `Newest` if needed.
5. In Network, confirm `/api/products?sort=price`.
6. In Sources, confirm authored files such as `src/utils/productQuery.ts` are visible.
7. In Developer Resources, confirm the source map status is successful.

### Build B

1. Run `pnpm run build:hidden-map`.
2. Run `pnpm run serve:hidden-map`.
3. In another terminal, run `pnpm run serve:map`.
4. Open `http://127.0.0.1:4173/source-map-debug/product-catalog`.
5. Confirm the header shows `Build: release-map-private`.
6. In Network, confirm `/api/products?sort=price`.
7. In Developer Resources, confirm the public map load fails at first.
8. Open the deployed JS in Sources, right-click the editor, choose `Add source map`, and enter the matching map URL from `release-artifacts/release-map-private/MAP_MANIFEST.json`, usually:

```text
http://127.0.0.1:4174/assets/<hashed-file>.js.map
```

9. Confirm authored files appear after the manual map load.

### Build C

1. Run `pnpm run build:no-map` and `pnpm run serve:no-map`.
2. Open `http://127.0.0.1:4173/source-map-debug/product-catalog`.
3. Confirm the header shows `Build: release-no-map`.
4. Confirm Network still shows `/api/products?sort=price`.
5. Confirm Sources shows generated/minified JS, not authored React/TypeScript files.
6. In Sources > XHR/fetch Breakpoints, add `/api/products`.
7. Reproduce by changing sort.
8. Confirm Chrome pauses in generated JS.

## Recording Checklist

1. Start with Build A briefly: show public map, authored source, easy breakpoint.
2. Switch to Build B: show the app, `Sort: Newest`, Network request `sort=price`, and missing map in Developer Resources.
3. Serve the retained private map, manually add it, then show authored source becoming available.
4. Switch to Build C: show no authored source, add XHR/fetch breakpoint `/api/products`, reproduce, and inspect generated JS.
5. Close by showing the bug source in `src/utils/productQuery.ts` outside the browser recording if you want the reveal.

## Troubleshooting

- Source map does not attach: verify JavaScript source maps are enabled in DevTools Settings > Preferences > Sources.
- CORS or map loading error: use `npm run serve:map`; it sends `Access-Control-Allow-Origin: *`.
- Browser shows an old map: use Empty Cache and Hard Reload with DevTools open, or change the serve port.
- Build hash changed: hashes can change between separate builds. For Build B, use only the `.map` from `release-artifacts/release-map-private` generated by the same `npm run build:hidden-map` command.
- Breakpoint does not trigger: use `/api/products` in XHR/fetch Breakpoints and change a filter or sort to issue a fresh request.
- Authored sources appear unexpectedly in Build C: confirm `dist-no-map/assets` contains no `.map` files and the JS file has no `sourceMappingURL` comment.

## Documentation Notes

- Vite documents `build.sourcemap` as `false` by default, `true` for separate map files, and `hidden` for maps without comments: https://vite.dev/config/build-options.html#build-sourcemap
- Chrome documents that source maps let DevTools show authored files while the browser runs deployed/minified code: https://developer.chrome.com/docs/devtools/javascript/source-maps
- Chrome documents Developer Resources status/error checks and manual source-map loading: https://developer.chrome.com/docs/devtools/developer-resources
- Chrome documents XHR/fetch breakpoints pausing when the request URL contains a specified string: https://developer.chrome.com/docs/devtools/javascript/breakpoints#xhr
