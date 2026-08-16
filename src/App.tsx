import { useEffect, useState } from "react";
import { ProductCatalog } from "./pages/ProductCatalog";
import { HomePage } from "./pages/HomePage";
import { RouteInfoPage } from "./pages/RouteInfoPage";
import { CartCouponPage } from "./pages/CartCouponPage";
import { legacyRoutes, sourceMapCatalogRoute } from "./routes";
import { getCurrentRoutePath } from "./routing";

export default function App() {
  const [path, setPath] = useState(getCurrentRoutePath);
  const legacyRoute = legacyRoutes.find((route) => route.path === path);

  useEffect(() => {
    function syncRoute() {
      setPath(getCurrentRoutePath());
    }

    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  if (path === sourceMapCatalogRoute.path) {
    return <ProductCatalog />;
  }

  if (path === "/product-catalog") {
    window.location.hash = sourceMapCatalogRoute.path;
    return <ProductCatalog />;
  }

  if (path === "/debug-demos/cart-recorder") {
    return <CartCouponPage />;
  }

  if (legacyRoute) {
    return <RouteInfoPage route={legacyRoute} />;
  }

  return <HomePage currentPath={path} />;
}
