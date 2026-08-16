import "server-only";

import { cookies } from "next/headers";

import { parseCurrentUser } from "@/features/session/utils";
import { env } from "@/lib/env";
import { getDefaultCountryCode } from "./locale-headers";

export async function getSessionCountryCode() {
  if (env.DEV_BYPASS_AUTH === "true") return getDefaultCountryCode();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const sessionUrl = new URL(
    `${env.AUTH_API_PATH_PREFIX.replace(/\/$/, "")}/get-session`,
    env.AUTH_API_URL
  );

  const response = await fetch(sessionUrl.toString(), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) return null;
  const payload = await response.json().catch(() => null);
  return parseCurrentUser(payload)?.countryCode ?? null;
}
