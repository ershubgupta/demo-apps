import { legacyRoutes, sourceMapCatalogRoute } from "../routes";
import { routeHref } from "../routing";

type HomePageProps = {
  currentPath: string;
};

export function HomePage({ currentPath }: HomePageProps) {
  const isUnknownPath = currentPath !== "/";

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Storefront Admin</p>
          <h1>Debug Workbench</h1>
        </div>
        <div className="header-meta">
          <span>Production Debug Lab</span>
          <span>Home</span>
        </div>
      </header>

      <section className="home-panel">
        {isUnknownPath ? (
          <div className="route-notice">
            <strong>{currentPath}</strong> is an archived or unknown route in the Vite app. Use the links below to open
            an active scenario or locate the original source route.
          </div>
        ) : null}

        <div className="home-heading">
          <p className="section-label">Available Routes</p>
          <h2>Choose a scenario</h2>
        </div>

        <section className="demo-section" aria-labelledby="active-demos-heading">
          <h3 id="active-demos-heading">Active Scenario</h3>
          <div className="demo-grid">
            <a className="demo-link-card" href={routeHref(sourceMapCatalogRoute.path)}>
              <span>{sourceMapCatalogRoute.status}</span>
              <strong>{sourceMapCatalogRoute.name}</strong>
              <code>{sourceMapCatalogRoute.path}</code>
              <p>{sourceMapCatalogRoute.description}</p>
            </a>
          </div>
        </section>

        <section className="demo-section" aria-labelledby="legacy-demos-heading">
          <div className="legacy-heading-row">
            <h3 id="legacy-demos-heading">Archived Routes</h3>
            <span>Served by the Vite router</span>
          </div>
          <div className="legacy-route-list">
            {legacyRoutes.map((route) => (
              <a className="legacy-route" href={routeHref(route.path)} key={route.path}>
                <div>
                  <strong>{route.name}</strong>
                  <code>{route.path}</code>
                </div>
                <small>{route.status}</small>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
