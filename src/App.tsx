import { ProductCatalog } from "./pages/ProductCatalog";
import { DemoHome } from "./pages/DemoHome";
import { LegacyDemoPage } from "./pages/LegacyDemoPage";
import { CartRecorderDemo } from "./pages/CartRecorderDemo";
import { legacyRoutes, sourceMapCatalogRoute } from "./routes";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const legacyRoute = legacyRoutes.find((route) => route.path === path);

  if (path === sourceMapCatalogRoute.path) {
    return <ProductCatalog />;
  }

  if (path === "/product-catalog") {
    window.history.replaceState(null, "", sourceMapCatalogRoute.path);
    return <ProductCatalog />;
  }

  if (path === "/debug-demos/cart-recorder") {
    return <CartRecorderDemo />;
  }

  if (legacyRoute) {
    return <LegacyDemoPage route={legacyRoute} />;
  }

  return <DemoHome currentPath={path} />;
}
