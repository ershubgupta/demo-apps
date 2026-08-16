export enum CatalogTypeEnum {
  Catalog_HO = "Catalog_HO",
  CONTRACT_PRICE = "Contract_Price",
  CATALOG_STORE = "Catalog_Store",
}
export type CatalogType = `${CatalogTypeEnum}`;

/** Supported lifecycle statuses shared by catalog features. */
export enum StatusEnum {
  Active = "Active",
  Approved = "Approved",
  Draft = "Draft",
  Expired = "Expired",
  Pending = "Pending",
  Preview = "Preview",
}

/**
 * Catalog HO lifecycle statuses.
 * Pending is reserved for other features (e.g. Contract Price) and excluded here.
 */
export type CatalogStatus = Exclude<`${StatusEnum}`, `${StatusEnum.Pending}`>;

/** Store catalog statuses include additional operational states. */
export type CatalogStoreStatus =
  | CatalogStatus
  | StatusEnum.Pending
  | "Rejected"
  | "Inactive EOD"
  | "Inactive Immediate";

/** Pagination metadata returned by list APIs. */
export type Pagination = {
  /** Current 1-based page number. */
  page: number;
  /** Number of records requested per page. */
  pageSize: number;
  /** Total number of records across all pages. */
  totalItems: number;
  /** Total number of available pages. */
  totalPages: number;
};

/** Standard paginated response shape for catalog list endpoints. */
export type PaginatedListResponse<TItem> = {
  /** Records for the current page. */
  items: TItem[];
  /** Pagination metadata for the result set. */
  pagination: Pagination;
};

/** Option shape used by catalog status filters. */
export type CatalogStatusOption<TStatus extends string = CatalogStatus> = {
  /** User-facing option label. */
  label: TStatus;
  /** Option value submitted in filters. */
  value: TStatus;
};
