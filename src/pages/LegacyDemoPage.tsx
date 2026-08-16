import type { DemoRoute } from "../routes";

type LegacyDemoPageProps = {
  route: DemoRoute;
};

export function LegacyDemoPage({ route }: LegacyDemoPageProps) {
  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Storefront Admin</p>
          <h1>{route.name}</h1>
        </div>
        <div className="header-meta">
          <a href="/">Demo Home</a>
          <span>{route.status}</span>
        </div>
      </header>

      <section className="home-panel">
        <div className="legacy-demo-page">
          <p className="section-label">Legacy Demo Route</p>
          <h2>{route.name}</h2>
          <code>{route.path}</code>
          <p>{route.description}</p>

          <div className="route-detail-grid">
            <div>
              <strong>Current status</strong>
              <span>
                This URL is now handled by the Vite app so navigation works from the demo home page and direct browser
                entry.
              </span>
            </div>
            <div>
              <strong>Original source</strong>
              <span>{route.source}</span>
            </div>
          </div>

          <div className="route-actions">
            <a href="/">Back to Demo Home</a>
            <a href="/source-map-debug/product-catalog">Open Source Map Demo</a>
          </div>
        </div>
      </section>
    </main>
  );
}
