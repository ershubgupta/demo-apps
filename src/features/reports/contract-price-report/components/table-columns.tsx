import type { ColumnDef } from "@tanstack/react-table";
import {
  ReportDownloadCell,
  ReportStatusMessageCell,
} from "../../shared/components/report-action-cells";
import type { ContractPriceReportRow } from "../types";
import type { Translate } from "@/i18n/types";
export function createContractPriceReportColumns(
  t: Translate = (key) => key
): ColumnDef<ContractPriceReportRow>[] {
  return [
    {
      accessorKey: "reportNo",
      header: t("common.fields.reportNo"),
      meta: { width: 190, noWrap: true },
    },
    {
      accessorKey: "reportCreatedDate",
      header: t("common.fields.reportCreatedDate"),
      meta: { width: 170, noWrap: true },
    },
    {
      accessorKey: "pricePeriod",
      header: t("common.fields.pricePeriod"),
      meta: { width: 320, noWrap: true },
    },
    {
      id: "report-status",
      header: t("common.fields.reportStatus"),
      cell: ({ row }) => (
        <ReportStatusMessageCell
          job={row.original.report}
          label={t("common.fields.report")}
        />
      ),
      meta: { align: "center", width: 150 },
    },
    {
      id: "report-download",
      header: t("common.fields.reportDownload"),
      cell: ({ row }) => <ReportDownloadCell job={row.original.report} />,
      enableSorting: false,
      meta: { align: "center", width: 140 },
    },
  ];
}
