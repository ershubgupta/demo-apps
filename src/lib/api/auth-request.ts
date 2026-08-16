import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { applyCountryLocaleHeaders } from "@/lib/api/locale-headers";
import { getSessionCountryCode } from "@/lib/api/session-context";
import { env } from "@/lib/env";

type SearchParams = Record<
  string,
  string | number | boolean | readonly string[] | null | undefined
>;

type AuthRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  searchParams?: SearchParams;
};

function buildUrl(baseUrl: string, path: string, searchParams?: SearchParams) {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        value
          .filter((entry) => entry !== "")
          .forEach((entry) => url.searchParams.append(key, entry));
      } else if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

const getCachedToken = cache(async () => {
  return getAuthToken();
});

const getCachedCountryCode = cache(async () => {
  return getSessionCountryCode();
});

async function getFreshToken() {
  return getAuthToken();
}

async function getAuthToken() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const tokenUrl = new URL(
    `${env.AUTH_API_PATH_PREFIX.replace(/\/$/, "")}/token`,
    env.AUTH_API_URL
  );

  const response = await fetch(tokenUrl.toString(), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = (await response.json().catch(() => null)) as {
    token?: string;
  } | null;
  return payload?.token ?? null;
}

/**
 * Central auth header policy for backend calls.
 * DEV_BYPASS_AUTH uses local headers unless a Kong bearer token is provided.
 */
async function buildHeaders(
  baseUrl: string,
  extra?: HeadersInit,
  opts?: { token?: string | null }
): Promise<Headers> {
  const headers = new Headers(extra);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");

  applyCountryLocaleHeaders(
    headers,
    await getCachedCountryCode().catch(() => null)
  );

  if (env.DEV_BYPASS_AUTH === "true") {
    const kongToken = env.DEV_KONG_BEARER_TOKEN?.trim();
    if (kongToken) {
      headers.set("Authorization", `Bearer ${kongToken}`);
    } else if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      headers.set("x-user-id", "local-dev-user");
      headers.set("x-user-email", "dev@local.test");
      headers.set("x-user-role", "CATALOG_ADMIN");
    } else {
      const token = opts?.token ?? (await getCachedToken().catch(() => null));
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  const token = opts?.token ?? (await getCachedToken());
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export function createAuthRequest(baseUrl: string) {
  async function request<T>(
    method: string,
    path: string,
    options: AuthRequestOptions = {}
  ) {
    const { body, searchParams, headers: extraHeaders, ...rest } = options;
    let headers = await buildHeaders(baseUrl, extraHeaders);
    const url = buildUrl(baseUrl, path, searchParams);
    let response = await fetch(url, {
      ...rest,
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: rest.cache ?? "no-store",
    });

    if (response.status === 401 && env.DEV_BYPASS_AUTH !== "true") {
      const token = await getFreshToken();
      if (token) {
        headers = await buildHeaders(baseUrl, extraHeaders, { token });
        response = await fetch(url, {
          ...rest,
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          cache: rest.cache ?? "no-store",
        });
      }
    }

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  return {
    get: <T>(path: string, options?: AuthRequestOptions) =>
      request<T>("GET", path, options),
    post: <T>(path: string, body?: unknown, options?: AuthRequestOptions) =>
      request<T>("POST", path, { ...options, body }),
    put: <T>(path: string, body?: unknown, options?: AuthRequestOptions) =>
      request<T>("PUT", path, { ...options, body }),
    patch: <T>(path: string, body?: unknown, options?: AuthRequestOptions) =>
      request<T>("PATCH", path, { ...options, body }),
    delete: <T>(path: string, options?: AuthRequestOptions) =>
      request<T>("DELETE", path, options),
  };
}
