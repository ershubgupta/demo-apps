export function getCurrentRoutePath() {
  if (window.location.hash.startsWith("#/")) {
    return normalizePath(window.location.hash.slice(1));
  }

  return normalizePath(window.location.pathname);
}

export function routeHref(path: string) {
  return `#${normalizePath(path)}`;
}

function normalizePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}
