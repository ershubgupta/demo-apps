import { DEFAULT_COUNTRY_CODE, normalizeCountryCode } from "@/i18n/config";
import type { CurrentUser } from "./types";

type SessionPayload = {
  user?: {
    id?: string;
    email?: string;
    name?: string;
    countryCode?: string;
    country_code?: string;
    country?: string;
  };
  session?: {
    user?: SessionPayload["user"];
  };
};

export function parseCurrentUser(payload: unknown): CurrentUser | null {
  if (!payload || typeof payload !== "object") return null;
  const sessionPayload = payload as SessionPayload;
  const user = sessionPayload.user ?? sessionPayload.session?.user;
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    countryCode: normalizeCountryCode(
      user.countryCode ?? user.country_code ?? user.country
    ),
  };
}

export function createDevCurrentUser(): CurrentUser {
  return {
    id: "local-dev-user",
    email: "dev@local.test",
    name: "Catalog Admin",
    countryCode: DEFAULT_COUNTRY_CODE,
  };
}
