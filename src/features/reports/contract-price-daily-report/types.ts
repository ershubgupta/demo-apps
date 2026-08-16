import type { PaginatedListResponse } from "@/types/catalog";
import type { ReportJob } from "../shared/types";

export type ContractPriceDailyReportRow = {
  id: string;
  reportNo: string;
  reportCreatedDate: string;
  pricePeriod: string;
  report: ReportJob<"contractPrice">;
};

export type ContractPriceDailyReportListParams = {
  priceStartDate?: string;
  priceEndDate?: string;
  reportCreatedDate?: string;
  reportNo?: string;
  page?: number;
  pageSize?: number;
};

export type ContractPriceDailyReportListResponse =
  PaginatedListResponse<ContractPriceDailyReportRow>;
export type GenerateContractPriceDailyReportInput = {
  rowId?: string;
  variant: "contractPrice";
};
