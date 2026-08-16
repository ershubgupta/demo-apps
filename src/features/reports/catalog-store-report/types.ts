import type { PaginatedListResponse } from "@/types/catalog";
import type { ReportJob } from "../shared/types";

export type CatalogStoreReportRow = {
  id: string;
  reportNo: string;
  reportCreatedDate: string;
  catalogNumber: string;
  catalogType: string;
  pricePeriod: string;
  itemReport: ReportJob<"storeItem">;
  fullReport: ReportJob<"fullStore">;
};

export type CatalogStoreReportListParams = {
  catalogNumber?: string;
  catalogType?: string;
  priceStartDate?: string;
  priceEndDate?: string;
  reportCreatedDate?: string;
  reportNo?: string;
  page?: number;
  pageSize?: number;
};

export type CatalogStoreReportListResponse =
  PaginatedListResponse<CatalogStoreReportRow>;
export type GenerateCatalogStoreReportInput = {
  rowId?: string;
  variant: "storeItem" | "fullStore";
};
