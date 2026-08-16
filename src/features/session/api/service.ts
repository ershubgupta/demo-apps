import { createDevCurrentUser, parseCurrentUser } from "../utils";
import type { CurrentUser } from "../types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const response = await fetch("/api/auth/get-session", {
    cache: "no-store",
  }).catch(() => null);

  if (!response) return createDevCurrentUser();
  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  return parseCurrentUser(payload);
}
