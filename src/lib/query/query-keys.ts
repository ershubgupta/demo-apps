export const QUERY_KEYS = {
  catalog: {
    all: ["catalogs"] as const,
    list: (params: unknown) => ["catalogs", "list", params] as const,
    detail: (id: string) => ["catalogs", "detail", id] as const,
    items: (id: string, params: unknown) =>
      ["catalogs", id, "items", params] as const,
  },
  catalogStore: {
    all: ["catalog-store"] as const,
    list: (params: unknown) => ["catalog-store", "list", params] as const,
    detail: (id: string) => ["catalog-store", "detail", id] as const,
    items: (id: string, params: unknown) =>
      ["catalog-store", id, "items", params] as const,
  },
  contractPrice: {
    all: ["contract-price"] as const,
    list: (params: unknown) => ["contract-price", "list", params] as const,
    detail: (id: string) => ["contract-price", "detail", id] as const,
    periods: (id: string, params: unknown) =>
      ["contract-price", id, "periods", params] as const,
    items: (id: string, params: unknown) =>
      ["contract-price", id, "items", params] as const,
  },
  session: {
    all: ["session"] as const,
    currentUser: ["session", "current-user"] as const,
  },
  reports: {
    all: ["reports"] as const,
    catalogHo: {
      all: ["reports", "catalog-ho"] as const,
      list: (params: unknown) =>
        ["reports", "catalog-ho", "list", params] as const,
    },
    catalogStore: {
      all: ["reports", "catalog-store"] as const,
      list: (params: unknown) =>
        ["reports", "catalog-store", "list", params] as const,
    },
    contractPrice: {
      all: ["reports", "contract-price"] as const,
      list: (params: unknown) =>
        ["reports", "contract-price", "list", params] as const,
    },
    contractPriceDaily: {
      all: ["reports", "contract-price-daily"] as const,
      list: (params: unknown) =>
        ["reports", "contract-price-daily", "list", params] as const,
    },
  },
} as const;
