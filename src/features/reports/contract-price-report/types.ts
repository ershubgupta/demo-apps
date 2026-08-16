import type { PaginatedListResponse } from "@/types/catalog";
import type { ReportJob } from "../shared/types";

export type ContractPriceReportRow = {
  id: string;
  reportNo: string;
  reportCreatedDate: string;
  pricePeriod: string;
  report: ReportJob<"contractPrice">;
};

export type ContractPriceReportListParams = {
  priceStartDate?: string;
  priceEndDate?: string;
  reportCreatedDate?: string;
  reportNo?: string;
  page?: number;
  pageSize?: number;
};

export type ContractPriceReportListResponse =
  PaginatedListResponse<ContractPriceReportRow>;
export type GenerateContractPriceReportInput = {
  rowId?: string;
  variant: "contractPrice";
};
