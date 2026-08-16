import { legacyRoutes, sourceMapCatalogRoute } from "../routes";

type DemoHomeProps = {
  currentPath: string;
};

export function DemoHome({ currentPath }: DemoHomeProps) {
  const isUnknownPath = currentPath !== "/";

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Storefront Admin</p>
          <h1>Demo Navigator</h1>
        </div>
        <div className="header-meta">
          <span>Production Debug Demo</span>
          <span>Home</span>
        </div>
      </header>

      <section className="home-panel">
        {isUnknownPath ? (
          <div className="route-notice">
            <strong>{currentPath}</strong> is a legacy or unknown route in the Vite app. Use the links below to open the
            active demo or locate the old source route.
          </div>
        ) : null}

        <div className="home-heading">
          <p className="section-label">Available Routes</p>
          <h2>Choose a demo</h2>
        </div>

        <section className="demo-section" aria-labelledby="active-demos-heading">
          <h3 id="active-demos-heading">Active Vite Demo</h3>
          <div className="demo-grid">
            <a className="demo-link-card" href={sourceMapCatalogRoute.path}>
              <span>{sourceMapCatalogRoute.status}</span>
              <strong>{sourceMapCatalogRoute.name}</strong>
              <code>{sourceMapCatalogRoute.path}</code>
              <p>{sourceMapCatalogRoute.description}</p>
            </a>
          </div>
        </section>

        <section className="demo-section" aria-labelledby="legacy-demos-heading">
          <div className="legacy-heading-row">
            <h3 id="legacy-demos-heading">Legacy Demo URLs</h3>
            <span>Served by the Vite router</span>
          </div>
          <div className="legacy-route-list">
            {legacyRoutes.map((demo) => (
              <a className="legacy-route" href={demo.path} key={demo.path}>
                <div>
                  <strong>{demo.name}</strong>
                  <code>{demo.path}</code>
                </div>
                <small>{demo.status}</small>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
