import type {
  ContractPriceDailyReportListParams,
  ContractPriceDailyReportListResponse,
  ContractPriceDailyReportRow,
  GenerateContractPriceDailyReportInput,
} from "../types";
import type { ReportDownloadAsset } from "../../shared/types";
const now = () => Date.now();
type MutableRow = ContractPriceDailyReportRow & {
  pending?: { report?: { completeAt: number } };
};
const rows: MutableRow[] = [
  {
    id: "contract-daily-1",
    reportNo: "20260722090000001",
    reportCreatedDate: "22-Jul-2026 09:00",
    pricePeriod: "22-Jul-2026 00:00 - 22-Jul-2026 23:59",
    report: {
      status: "Completed",
      message:
        "Daily contract price report exported successfully with 18 records.",
      asset: createAsset("Contract_Price_Daily_20260722.csv", "Daily Report"),
    },
  },
];
export async function listMockContractPriceDailyReports(
  params: ContractPriceDailyReportListParams = {}
): Promise<ContractPriceDailyReportListResponse> {
  advancePending();
  return paginate(
    rows.filter((row) => matches(row, params)).map(stripPending),
    params
  );
}
export async function generateMockContractPriceDailyReport(
  input: GenerateContractPriceDailyReportInput
): Promise<ContractPriceDailyReportRow> {
  const row = input.rowId
    ? rows.find((item) => item.id === input.rowId)
    : rows[0];
  if (!row) throw new Error("Report row not found.");
  row.report.status = "Processing";
  row.report.message = "Report generation started. Check status again shortly.";
  row.pending = { report: { completeAt: now() + 9000 } };
  return stripPending(row);
}
function advancePending() {
  rows.forEach((row) => {
    if (!row.pending?.report || row.pending.report.completeAt > now()) return;
    row.report.status = "Completed";
    row.report.asset = createAsset(
      row.reportNo + "_contractPrice.csv",
      "Report"
    );
    row.report.message =
      "Daily contract price report exported successfully with 18 records.";
    delete row.pending.report;
  });
}
function matches(
  row: ContractPriceDailyReportRow,
  params: ContractPriceDailyReportListParams
) {
  return (
    includes(row.reportNo, params.reportNo) &&
    includes(row.reportCreatedDate, params.reportCreatedDate) &&
    (!params.priceStartDate ||
      row.pricePeriod.includes(params.priceStartDate)) &&
    (!params.priceEndDate || row.pricePeriod.includes(params.priceEndDate))
  );
}
function paginate<T>(items: T[], params: { page?: number; pageSize?: number }) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    },
  };
}
function stripPending(row: MutableRow): ContractPriceDailyReportRow {
  const { pending, ...rest } = row;
  void pending;
  return { ...rest };
}
function includes(value: string, filter?: string) {
  return filter ? value.toLowerCase().includes(filter.toLowerCase()) : true;
}
function createAsset(
  fileName: string,
  label: string
): ReportDownloadAsset<"contractPrice"> {
  const csv = ["report,label", "contractPrice," + label].join("\n");
  return {
    fileName,
    label,
    url: "data:text/csv;charset=utf-8," + encodeURIComponent(csv),
    variant: "contractPrice",
  };
}
