import type {
  CatalogStatus,
  CatalogType,
  PaginatedListResponse,
} from "@/types/catalog";

export { StatusEnum } from "@/types/catalog";
export type { CatalogStatus, Pagination } from "@/types/catalog";

export type Catalog = {
  id: string;
  catalogType: CatalogType;
  number: string;
  mmid: string;
  cvCode: string;
  customerName: string;
  itemNo: string;
  itemDescription: string;
  revision: number;
  charge: number;
  startDate: string;
  endDate: string;
  priceStartDate: string;
  priceEndDate: string;
  store: string;
  status: CatalogStatus;
};

export type CatalogListParams = {
  search?: string;
  mmid?: string;
  cvCode?: string;
  customerName?: string;
  itemNo?: string;
  itemDescription?: string;
  catalogType?: CatalogType[];
  number?: string;
  revision?: number;
  startDate?: string;
  endDate?: string;
  priceStartDate?: string;
  priceEndDate?: string;
  store?: string;
  status?: CatalogStatus | "ALL";
  page?: number;
  pageSize?: number;
};

export type CatalogListResponse = PaginatedListResponse<Catalog>;

export type CatalogItemStatus = "ACTIVE" | "DISCONTINUED" | "INACTIVE";

export type CatalogItem = {
  id: string;
  priceSource: number;
  department: number;
  classNo: number;
  itemNo: string;
  itemDescription: string;
  status: CatalogItemStatus;
  regularPriceInVat: number;
  catalogChargePercent: number;
  charge: number;
  shelfPriceInVatPlusCharge: number;
  finalPriceInVat: number;
  finalPriceExVat: number;
  vat: number;
};

export type CatalogItemListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type CatalogItemListResponse = PaginatedListResponse<CatalogItem>;

export type CatalogCustomer = {
  id: string;
  cvCode: string;
  mmid: string;
  customerName: string;
  catalogTier: string;
};

export type CatalogDetail = {
  id: string;
  status: CatalogStatus;
  catalogType: string;
  charge: number;
  number: string;
  revision: number;
  storeMasterAndPriceSequence: string;
  periodStart: string;
  periodEnd: string;
  priceStart: string;
  priceEnd: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  approvedAt?: string;
  totalItems: number;
  customers: CatalogCustomer[];
};

export type StoreMasterItem = {
  id: string;
  storeId: string;
};
