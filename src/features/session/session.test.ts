import { describe, expect, it } from "vitest";

import { parseCurrentUser } from "./utils";

describe("session helpers", () => {
  it("parses country code from direct user payload", () => {
    expect(
      parseCurrentUser({
        user: { id: "1", email: "user@example.com", countryCode: "ph" },
      })
    ).toMatchObject({ id: "1", countryCode: "PH" });
  });

  it("parses country code from nested session payload", () => {
    expect(
      parseCurrentUser({
        session: { user: { email: "user@example.com", country_code: "th" } },
      })
    ).toMatchObject({ email: "user@example.com", countryCode: "TH" });
  });

  it("returns null when user is unavailable", () => {
    expect(parseCurrentUser({ session: null })).toBeNull();
  });
});
