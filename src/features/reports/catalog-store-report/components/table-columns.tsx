import type { ColumnDef } from "@tanstack/react-table";
import {
  ReportDownloadCell,
  ReportGenerateButton,
  ReportStatusMessageCell,
} from "../../shared/components/report-action-cells";
import type { CatalogStoreReportRow } from "../types";
import type { Translate } from "@/i18n/types";
export function createCatalogStoreReportColumns(
  onGenerate: (row: CatalogStoreReportRow) => void,
  t: Translate = (key) => key
): ColumnDef<CatalogStoreReportRow>[] {
  return [
    {
      accessorKey: "reportNo",
      header: t("common.fields.reportNo"),
      meta: { width: 160, noWrap: true },
    },
    {
      accessorKey: "reportCreatedDate",
      header: t("common.fields.reportCreatedDate"),
      meta: { width: 150, noWrap: true },
    },
    {
      accessorKey: "catalogNumber",
      header: t("common.fields.catalogNumber"),
      cell: ({ row }) => row.original.catalogNumber || "-",
      meta: { width: 170, noWrap: true },
    },
    {
      accessorKey: "catalogType",
      header: t("common.fields.catalogType"),
      meta: { width: 140, noWrap: true },
    },
    {
      accessorKey: "pricePeriod",
      header: t("common.fields.pricePeriod"),
      meta: { width: 240, noWrap: true },
    },
    {
      id: "item-generate",
      header: t("common.fields.reportItem"),
      cell: ({ row }) => (
        <ReportGenerateButton
          job={row.original.itemReport}
          onGenerate={() => onGenerate(row.original)}
        />
      ),
      meta: { align: "center", width: 120 },
    },
    {
      id: "item-status",
      header: t("common.fields.reportItemStatus"),
      cell: ({ row }) => (
        <ReportStatusMessageCell
          job={row.original.itemReport}
          label={t("common.fields.item")}
        />
      ),
      meta: { align: "center", width: 150 },
    },
    {
      id: "item-download",
      header: t("common.fields.reportItemDownload"),
      cell: ({ row }) => <ReportDownloadCell job={row.original.itemReport} />,
      enableSorting: false,
      meta: { align: "center", width: 150 },
    },
  ];
}
