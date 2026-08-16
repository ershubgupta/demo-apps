import type { RouteEntry } from "../routes";
import { routeHref } from "../routing";

type RouteInfoPageProps = {
  route: RouteEntry;
};

export function RouteInfoPage({ route }: RouteInfoPageProps) {
  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Storefront Admin</p>
          <h1>{route.name}</h1>
        </div>
        <div className="header-meta">
          <a href={routeHref("/")}>Home</a>
          <span>{route.status}</span>
        </div>
      </header>

      <section className="home-panel">
        <div className="legacy-demo-page">
          <p className="section-label">Archived Route</p>
          <h2>{route.name}</h2>
          <code>{route.path}</code>
          <p>{route.description}</p>

          <div className="route-detail-grid">
            <div>
              <strong>Current status</strong>
              <span>
                This URL is now handled by the Vite app so navigation works from the workbench home page and direct browser
                entry.
              </span>
            </div>
            <div>
              <strong>Original source</strong>
              <span>{route.source}</span>
            </div>
          </div>

          <div className="route-actions">
            <a href={routeHref("/")}>Back to Home</a>
            <a href={routeHref("/source-map-debug/product-catalog")}>Open Source Map Lab</a>
          </div>
        </div>
      </section>
    </main>
  );
}
