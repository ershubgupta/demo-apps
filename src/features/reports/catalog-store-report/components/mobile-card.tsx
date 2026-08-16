import type { DataTableMobileCard } from "@/components/data-table/data-table";
import {
  ReportDownloadCell,
  ReportGenerateButton,
  ReportStatusMessageCell,
} from "../../shared/components/report-action-cells";
import type { CatalogStoreReportRow } from "../types";
import type { Translate } from "@/i18n/types";
export function createCatalogStoreReportMobileCard(
  onGenerate: (row: CatalogStoreReportRow) => void,
  t: Translate = (key) => key
): DataTableMobileCard<CatalogStoreReportRow> {
  return {
    renderTitle: (row) => row.reportNo,
    renderSubtitle: (row) => row.pricePeriod,
    fields: [
      {
        label: t("common.fields.reportCreatedDate"),
        render: (row) => row.reportCreatedDate,
      },
      {
        label: t("common.fields.catalogNumber"),
        render: (row) => row.catalogNumber || "-",
      },
      { label: t("common.fields.type"), render: (row) => row.catalogType },
      {
        label: t("common.fields.item"),
        fullWidth: true,
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            <ReportGenerateButton
              job={row.itemReport}
              onGenerate={() => onGenerate(row)}
            />
            <ReportStatusMessageCell
              job={row.itemReport}
              label={t("common.fields.item")}
            />
            <ReportDownloadCell job={row.itemReport} />
          </div>
        ),
      },
    ],
  };
}
