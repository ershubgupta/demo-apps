import { describe, expect, it } from "vitest";

import { QUERY_KEYS } from "./query-keys";

describe("QUERY_KEYS", () => {
  it("keeps catalog list keys scoped", () => {
    expect(QUERY_KEYS.catalog.list({ page: 1 })).toEqual([
      "catalogs",
      "list",
      { page: 1 },
    ]);
  });
});
