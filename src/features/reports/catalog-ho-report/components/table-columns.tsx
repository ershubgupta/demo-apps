import type { ColumnDef } from "@tanstack/react-table";

import type { Translate } from "@/i18n/types";

import {
  ReportDownloadCell,
  ReportGenerateButton,
  ReportStatusMessageCell,
} from "../../shared/components/report-action-cells";
import type { CatalogHoReportRow } from "../types";

export function createCatalogHoReportColumns(
  onGenerate: (
    row: CatalogHoReportRow,
    variant: "item" | "itemCustomer"
  ) => void,
  t: Translate = (key) => key
): ColumnDef<CatalogHoReportRow>[] {
  return [
    {
      accessorKey: "catalogNumber",
      header: t("reports.catalogHo.columns.catalogNumber"),
      meta: { width: 170, noWrap: true },
    },
    {
      accessorKey: "catalogRevision",
      header: t("reports.catalogHo.columns.catalogRevision"),
      meta: { width: 130, align: "center" },
    },
    {
      accessorKey: "catalogStatus",
      header: t("reports.catalogHo.columns.catalogStatus"),
      meta: { width: 130, align: "center" },
    },
    {
      accessorKey: "catalogType",
      header: t("reports.catalogHo.columns.catalogType"),
      meta: { width: 140, noWrap: true },
    },
    {
      accessorKey: "pricePeriod",
      header: t("reports.catalogHo.columns.pricePeriod"),
      meta: { width: 240, noWrap: true },
    },
    {
      id: "item-generate",
      header: t("reports.catalogHo.columns.reportItem"),
      cell: ({ row }) => (
        <ReportGenerateButton
          job={row.original.itemReport}
          onGenerate={() => onGenerate(row.original, "item")}
        />
      ),
      meta: { align: "center", width: 120 },
    },
    {
      id: "item-status",
      header: t("reports.catalogHo.columns.reportItemStatus"),
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
      header: t("reports.catalogHo.columns.reportItemDownload"),
      cell: ({ row }) => <ReportDownloadCell job={row.original.itemReport} />,
      enableSorting: false,
      meta: { align: "center", width: 150 },
    },
    {
      id: "item-customer-generate",
      header: t("reports.catalogHo.columns.reportItemCustomer"),
      cell: ({ row }) => (
        <ReportGenerateButton
          job={row.original.itemCustomerReport}
          onGenerate={() => onGenerate(row.original, "itemCustomer")}
        />
      ),
      meta: { align: "center", width: 170 },
    },
    {
      id: "item-customer-status",
      header: t("reports.catalogHo.columns.reportItemCustomerStatus"),
      cell: ({ row }) => (
        <ReportStatusMessageCell
          job={row.original.itemCustomerReport}
          label={t("common.fields.reportItemCustomer")}
        />
      ),
      meta: { align: "center", width: 190 },
    },
    {
      id: "item-customer-download",
      header: t("reports.catalogHo.columns.reportItemCustomerDownload"),
      cell: ({ row }) => (
        <ReportDownloadCell job={row.original.itemCustomerReport} />
      ),
      enableSorting: false,
      meta: { align: "center", width: 190 },
    },
  ];
}
