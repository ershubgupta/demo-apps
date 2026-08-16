import type {
  ContractPriceReportListParams,
  ContractPriceReportListResponse,
  ContractPriceReportRow,
  GenerateContractPriceReportInput,
} from "../types";
import type { ReportDownloadAsset } from "../../shared/types";
const now = () => Date.now();
type MutableRow = ContractPriceReportRow & {
  pending?: { report?: { completeAt: number } };
};
const rows: MutableRow[] = [
  {
    id: "contract-1",
    reportNo: "20260713185600003",
    reportCreatedDate: "13-Jul-2026 17:26",
    pricePeriod: "16-Jul-2024 00:00 - 17-Jul-2024 23:59",
    report: {
      status: "Failed",
      message:
        "No data available for the selected criteria. Please adjust your filters or try again later.",
    },
  },
];
export async function listMockContractPriceReports(
  params: ContractPriceReportListParams = {}
): Promise<ContractPriceReportListResponse> {
  advancePending();
  return paginate(
    rows.filter((row) => matches(row, params)).map(stripPending),
    params
  );
}
export async function generateMockContractPriceReport(
  input: GenerateContractPriceReportInput
): Promise<ContractPriceReportRow> {
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
      "Contract price report exported successfully with 1 records.";
    delete row.pending.report;
  });
}
function matches(
  row: ContractPriceReportRow,
  params: ContractPriceReportListParams
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
function stripPending(row: MutableRow): ContractPriceReportRow {
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
