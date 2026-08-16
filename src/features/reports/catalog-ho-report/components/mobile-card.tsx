import type { DataTableMobileCard } from "@/components/data-table/data-table";
import type { Translate } from "@/i18n/types";

import {
  ReportDownloadCell,
  ReportGenerateButton,
  ReportStatusMessageCell,
} from "../../shared/components/report-action-cells";
import type { CatalogHoReportRow } from "../types";

export function createCatalogHoReportMobileCard(
  onGenerate: (
    row: CatalogHoReportRow,
    variant: "item" | "itemCustomer"
  ) => void,
  t: Translate = (key) => key
): DataTableMobileCard<CatalogHoReportRow> {
  return {
    renderTitle: (row) => row.catalogNumber,
    renderSubtitle: (row) => row.pricePeriod,
    fields: [
      {
        label: t("reports.catalogHo.mobile.revision"),
        render: (row) => row.catalogRevision,
      },
      {
        label: t("reports.catalogHo.mobile.status"),
        render: (row) => row.catalogStatus,
      },
      {
        label: t("reports.catalogHo.mobile.type"),
        render: (row) => row.catalogType,
      },
      {
        label: t("reports.catalogHo.mobile.item"),
        fullWidth: true,
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            <ReportGenerateButton
              job={row.itemReport}
              onGenerate={() => onGenerate(row, "item")}
            />
            <ReportStatusMessageCell
              job={row.itemReport}
              label={t("common.fields.item")}
            />
            <ReportDownloadCell job={row.itemReport} />
          </div>
        ),
      },
      {
        label: t("reports.catalogHo.mobile.itemCustomer"),
        fullWidth: true,
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            <ReportGenerateButton
              job={row.itemCustomerReport}
              onGenerate={() => onGenerate(row, "itemCustomer")}
            />
            <ReportStatusMessageCell
              job={row.itemCustomerReport}
              label={t("common.fields.reportItemCustomer")}
            />
            <ReportDownloadCell job={row.itemCustomerReport} />
          </div>
        ),
      },
    ],
  };
}
