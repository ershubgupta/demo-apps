import type { PaginatedListResponse } from "@/types/catalog";
import { StatusEnum } from "@/types/catalog";

export { StatusEnum } from "@/types/catalog";

/** Contract Price period statuses use the full shared StatusEnum (includes Pending). */
export type ContractPricePeriodStatus = `${StatusEnum}`;

export type ContractPriceItemStatus = "ACTIVE" | "DISCONTINUED" | "INACTIVE";

export type ContractPrice = {
  id: string;
  number: string;
  type: string;
  cvCode: string;
  customerName: string;
  itemNo: string;
  itemDescription: string;
  startDate: string;
  endDate: string;
  store: string;
  requestedBy: string;
};

export type ContractPriceListParams = {
  search?: string;
  itemNo?: string;
  itemDescription?: string;
  cvCode?: string;
  customerName?: string;
  number?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  store?: string;
  requestedBy?: string;
  page?: number;
  pageSize?: number;
};

export type ContractPriceListResponse = PaginatedListResponse<ContractPrice>;

export type CustomerOption = {
  id: string;
  label: string;
  charge: number;
  primaryStore: number;
  storeOperation: number;
  cvCode: string;
  customerName: string;
  tier: string;
};

export type ContractPriceDetail = {
  id: string;
  contractType: string;
  charge: number;
  number: string;
  primaryStore: string;
  storeOperation: string;
  cvCode: string;
  mmid: string;
  customerName: string;
  periodStart: string;
  periodEnd: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  submittedBy: string;
  submittedAt: string;
  totalPeriods: number;
  totalItems: number;
};

export type ContractPricePeriod = {
  id: string;
  startDate: string;
  endDate: string;
  itemCount: number;
  requestedBy: string;
  requestedAt: string;
  approvedBy: string;
  approvedAt: string;
  status: ContractPricePeriodStatus;
};

export type ContractPricePeriodListParams = {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  status?: ContractPricePeriodStatus[];
};

export type ContractPricePeriodListResponse =
  PaginatedListResponse<ContractPricePeriod>;

export type ContractPriceItem = {
  id: string;
  priceSource: number;
  department: number;
  classNo: number;
  itemNo: string;
  itemDescription: string;
  status: ContractPriceItemStatus;
  periodStatus: ContractPricePeriodStatus;
  periodStart: string;
  periodEnd: string;
  normalGpPercent: number;
  promoGpPercent: number;
  salesAtShelfPrice: "Y" | "N" | null;
  approvedPriceInVat: number;
  regularPriceInVat: number;
  catalogChargePercent: number;
  charge: number;
  shelfPriceInVatPlusCharge: number;
  finalPriceInVat: number;
  finalPriceExVat: number;
  vat: number;
  catalogTier: string;
};

export type ContractPriceItemListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  itemNo?: string;
  itemDescription?: string;
  salesAtShelfPrice?: "Y" | "N";
  approvedPriceInVat?: string;
};

export type ContractPriceItemListResponse =
  PaginatedListResponse<ContractPriceItem>;
