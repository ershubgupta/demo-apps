import type { PaginatedListResponse } from "@/types/catalog";
import type { ReportJob } from "../shared/types";

export type CatalogHoReportRow = {
  id: string;
  catalogNumber: string;
  catalogRevision: number;
  catalogStatus: string;
  catalogType: string;
  pricePeriod: string;
  itemReport: ReportJob<"item">;
  itemCustomerReport: ReportJob<"itemCustomer">;
};

export type CatalogHoReportListParams = {
  catalogNumber?: string;
  catalogRevision?: number;
  catalogStatus?: string;
  catalogType?: string;
  priceStartDate?: string;
  priceEndDate?: string;
  page?: number;
  pageSize?: number;
};

export type CatalogHoReportListResponse =
  PaginatedListResponse<CatalogHoReportRow>;
export type GenerateCatalogHoReportInput = {
  rowId?: string;
  variant: "item" | "itemCustomer";
};
