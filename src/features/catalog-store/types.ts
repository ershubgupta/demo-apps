import type {
  CatalogStoreStatus,
  PaginatedListResponse,
} from "@/types/catalog";

export type { CatalogStoreStatus } from "@/types/catalog";

export type CatalogStore = {
  id: string;
  catalogType: string;
  number: string;
  revision: number;
  mmid: string;
  cvCode: string;
  customerName: string;
  itemNo: string;
  itemDescription: string;
  startDate: string;
  endDate: string;
  priceStartDate: string;
  priceEndDate: string;
  store: string;
  status: CatalogStoreStatus;
};

export type CatalogStoreListParams = {
  search?: string;
  mmid?: string;
  cvCode?: string;
  customerName?: string;
  itemNo?: string;
  itemDescription?: string;
  catalogType?: string;
  number?: string;
  revision?: string;
  startDate?: string;
  endDate?: string;
  priceStartDate?: string;
  priceEndDate?: string;
  store?: string;
  status?: CatalogStoreStatus | "ALL";
  page?: number;
  pageSize?: number;
};

export type CatalogStoreListResponse = PaginatedListResponse<CatalogStore>;

export type CatalogStoreItemStatus = "ACTIVE" | "DISCONTINUED" | "INACTIVE";

export type CatalogStoreItem = {
  id: string;
  priceSource: number;
  department: number;
  classNo: number;
  itemNo: string;
  itemDescription: string;
  status: CatalogStoreItemStatus;
  regularPriceInVat: number;
  catalogChargePercent: number;
  charge: number;
  shelfPriceInVatPlusCharge: number;
  finalPriceInVat: number;
  finalPriceExVat: number;
  vat: number;
  catalogTier: string;
};

export type CatalogStoreItemListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  tier?: string;
  itemNo?: string;
  itemDescription?: string;
};

export type CatalogStoreItemListResponse =
  PaginatedListResponse<CatalogStoreItem>;

export type CatalogStoreCustomer = {
  id: string;
  cvCode: string;
  mmid: string;
  customerName: string;
  catalogTier: string;
  operationStore: string;
};

export type CatalogStoreDetail = {
  id: string;
  status: CatalogStoreStatus;
  catalogType: string;
  charge: number;
  number: string;
  revision: number;
  storeMaster: string;
  periodStart: string;
  periodEnd: string;
  priceStart: string;
  priceEnd: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  approvedAt?: string;
  totalItems: number;
  customers: CatalogStoreCustomer[];
};
