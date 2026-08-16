import type {
  CatalogStoreReportListParams,
  CatalogStoreReportListResponse,
  CatalogStoreReportRow,
  GenerateCatalogStoreReportInput,
} from "../types";
import type { ReportDownloadAsset, ReportJob } from "../../shared/types";
const now = () => Date.now();
type MutableRow = CatalogStoreReportRow & {
  pending?: Partial<
    Record<"itemReport" | "fullReport", { completeAt: number }>
  >;
};
const rows: MutableRow[] = [
  {
    id: "store-1",
    reportNo: "20260713185600001",
    reportCreatedDate: "13-Jul-2026",
    catalogNumber: "",
    catalogType: "Catalog Store",
    pricePeriod: "-",
    itemReport: {
      status: "Failed",
      message:
        "No data available for the selected criteria. Please adjust your filters or try again later.",
    },
    fullReport: {
      status: "Failed",
      message:
        "No data available for the selected criteria. Please adjust your filters or try again later.",
    },
  },
  {
    id: "store-2",
    reportNo: "0058-SC-000001",
    reportCreatedDate: "06-Jul-2026",
    catalogNumber: "0058-SC-000001",
    catalogType: "Catalog Store",
    pricePeriod: "30-Jun-2026 - 30-Jul-2026",
    itemReport: {
      status: "Completed",
      message:
        "Catalog report (Catalog_Store, Tier: T8) exported successfully with 105662 records.",
      asset: createAsset(
        "Catalog_Store_Item_0058-SC-000001.csv",
        "Store Item Report",
        "storeItem"
      ),
    },
    fullReport: { status: "Idle", message: "" },
  },
  ...["0057", "0017", "0008", "0001", "0500", "0074", "0073"].map(
    (prefix, index) => ({
      id: "store-" + (index + 3),
      reportNo: prefix + "-SC-000001",
      reportCreatedDate: "06-Jul-2026",
      catalogNumber: prefix + "-SC-000001",
      catalogType: "Catalog Store",
      pricePeriod: "30-Jun-2026 - 30-Jul-2026",
      itemReport: { status: "Idle", message: "" } as ReportJob<"storeItem">,
      fullReport: { status: "Idle", message: "" } as ReportJob<"fullStore">,
    })
  ),
];
export async function listMockCatalogStoreReports(
  params: CatalogStoreReportListParams = {}
): Promise<CatalogStoreReportListResponse> {
  advancePending();
  return paginate(
    rows.filter((row) => matches(row, params)).map(stripPending),
    params
  );
}
export async function generateMockCatalogStoreReport(
  input: GenerateCatalogStoreReportInput
): Promise<CatalogStoreReportRow> {
  const row = input.rowId
    ? rows.find((item) => item.id === input.rowId)
    : rows[0];
  if (!row) throw new Error("Report row not found.");
  const key = input.variant === "storeItem" ? "itemReport" : "fullReport";
  row[key].status = "Processing";
  row[key].message = "Report generation started. Check status again shortly.";
  row.pending = { ...row.pending, [key]: { completeAt: now() + 9000 } };
  return stripPending(row);
}
function advancePending() {
  rows.forEach((row) =>
    Object.entries(row.pending ?? {}).forEach(([key, pending]) => {
      if (!pending || pending.completeAt > now()) return;
      const job = row[key as "itemReport" | "fullReport"];
      const variant = key === "itemReport" ? "storeItem" : "fullStore";
      job.status = "Completed";
      job.asset = createAsset(
        row.reportNo + "_" + variant + ".csv",
        variant === "storeItem" ? "Store Item Report" : "Full Report",
        variant
      );
      job.message =
        "Catalog report (Catalog_Store) exported successfully with " +
        (variant === "fullStore" ? 105662 : 293) +
        " records.";
      delete row.pending?.[key as "itemReport" | "fullReport"];
    })
  );
}
function matches(
  row: CatalogStoreReportRow,
  params: CatalogStoreReportListParams
) {
  return (
    includes(row.reportNo, params.reportNo) &&
    includes(row.reportCreatedDate, params.reportCreatedDate) &&
    includes(row.catalogNumber, params.catalogNumber) &&
    includes(row.catalogType, params.catalogType) &&
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
function stripPending(row: MutableRow): CatalogStoreReportRow {
  const { pending, ...rest } = row;
  void pending;
  return { ...rest };
}
function includes(value: string, filter?: string) {
  return filter ? value.toLowerCase().includes(filter.toLowerCase()) : true;
}
function createAsset<TVariant extends "storeItem" | "fullStore">(
  fileName: string,
  label: string,
  variant: TVariant
): ReportDownloadAsset<TVariant> {
  const csv = ["report,label", variant + "," + label].join("\n");
  return {
    fileName,
    label,
    url: "data:text/csv;charset=utf-8," + encodeURIComponent(csv),
    variant,
  };
}
