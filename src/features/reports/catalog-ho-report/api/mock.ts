import type {
  CatalogHoReportListParams,
  CatalogHoReportListResponse,
  CatalogHoReportRow,
  GenerateCatalogHoReportInput,
} from "../types";
import type { ReportDownloadAsset } from "../../shared/types";

const now = () => Date.now();
type MutableRow = CatalogHoReportRow & {
  pending?: Partial<
    Record<"itemReport" | "itemCustomerReport", { completeAt: number }>
  >;
};
const rows: MutableRow[] = [
  {
    id: "ho-1",
    catalogNumber: "0000-HO0C-000067",
    catalogRevision: 5,
    catalogStatus: "Active",
    catalogType: "Catalog HO",
    pricePeriod: "16-Jul-2026 - 31-Jul-2026",
    itemReport: {
      status: "Idle",
      message:
        "Catalog report (Catalog_HO) exported successfully with 3 records.",
    },
    itemCustomerReport: {
      status: "Processing",
      message: "Catalog report generation started. Check status again shortly.",
    },
    pending: { itemCustomerReport: { completeAt: now() + 9000 } },
  },
  {
    id: "ho-2",
    catalogNumber: "0000-HO0C-000066",
    catalogRevision: 4,
    catalogStatus: "Active",
    catalogType: "Catalog HO",
    pricePeriod: "09-Jul-2026 - 31-Jul-2026",
    itemReport: {
      status: "Failed",
      message:
        "No data available for the selected criteria. Please adjust your filters or try again later.",
    },
    itemCustomerReport: { status: "Idle", message: "" },
  },
  {
    id: "ho-3",
    catalogNumber: "0000-HO0C-000063",
    catalogRevision: 1000,
    catalogStatus: "Approved",
    catalogType: "Catalog HO",
    pricePeriod: "31-May-2026 - 29-Jun-2026",
    itemReport: {
      status: "Failed",
      message:
        "Catalog master details not found for catalogNumber: 0000-HO0C-000063 and catalogStatus: APPROVED and catalogRevision: 1000",
    },
    itemCustomerReport: { status: "Idle", message: "" },
  },
  {
    id: "ho-4",
    catalogNumber: "0000-HO0C-000062",
    catalogRevision: 7,
    catalogStatus: "Active",
    catalogType: "Catalog HO",
    pricePeriod: "03-Jul-2026 - 31-Jul-2026",
    itemReport: {
      status: "Completed",
      message:
        "Catalog report (Catalog_HO) exported successfully with 293 records.",
      asset: createAsset(
        "Catalog_HO_Item_0000-HO0C-000062.csv",
        "Item",
        "item"
      ),
    },
    itemCustomerReport: {
      status: "Completed",
      message:
        "Catalog report (Catalog_HO) exported successfully with 293 records.",
      asset: createAsset(
        "Catalog_HO_Item_Customer_0000-HO0C-000062.csv",
        "Item + Customer",
        "itemCustomer"
      ),
    },
  },
];
export async function listMockCatalogHoReports(
  params: CatalogHoReportListParams = {}
): Promise<CatalogHoReportListResponse> {
  advancePending();
  return paginate(
    rows.filter((row) => matches(row, params)).map(stripPending),
    params
  );
}
export async function generateMockCatalogHoReport(
  input: GenerateCatalogHoReportInput
): Promise<CatalogHoReportRow> {
  const row = rows.find((item) => item.id === input.rowId);
  if (!row) throw new Error("Report row not found.");
  const key = input.variant === "item" ? "itemReport" : "itemCustomerReport";
  row[key].status = "Processing";
  row[key].message = "Report generation started. Check status again shortly.";
  row.pending = { ...row.pending, [key]: { completeAt: now() + 9000 } };
  return stripPending(row);
}
function advancePending() {
  rows.forEach((row) => {
    Object.entries(row.pending ?? {}).forEach(([key, pending]) => {
      if (!pending || pending.completeAt > now()) return;
      const job = row[key as "itemReport" | "itemCustomerReport"];
      const variant = key === "itemReport" ? "item" : "itemCustomer";
      job.status = "Completed";
      job.asset = createAsset(
        row.catalogNumber + "_" + variant + ".csv",
        variant === "item" ? "Item" : "Item + Customer",
        variant
      );
      job.message =
        "Catalog report (Catalog_HO) exported successfully with " +
        row.catalogRevision +
        " records.";
      delete row.pending?.[key as "itemReport" | "itemCustomerReport"];
    });
  });
}
function matches(row: CatalogHoReportRow, params: CatalogHoReportListParams) {
  return (
    includes(row.catalogNumber, params.catalogNumber) &&
    row.catalogRevision === (params.catalogRevision ?? row.catalogRevision) &&
    includes(row.catalogStatus, params.catalogStatus) &&
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
function stripPending(row: MutableRow): CatalogHoReportRow {
  const { pending, ...rest } = row;
  void pending;
  return { ...rest };
}
function includes(value: string, filter?: string) {
  return filter ? value.toLowerCase().includes(filter.toLowerCase()) : true;
}
function createAsset<TVariant extends "item" | "itemCustomer">(
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
