import { describe, expect, it } from "vitest";

import { catalogListParamsSchema } from "./schema";

describe("catalogListParamsSchema", () => {
  it("accepts supported catalog list filters", () => {
    const result = catalogListParamsSchema.safeParse({
      buyerCode: "FB1",
      catalogType: "Catalog HO",
      from: "2026-07-01",
      itemNo: "SKU-1001",
      search: "customer a",
      status: "Approved",
      page: 1,
      pageSize: 20,
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsupported status values", () => {
    const result = catalogListParamsSchema.safeParse({
      status: "DELETED",
    });

    expect(result.success).toBe(false);
  });
});
