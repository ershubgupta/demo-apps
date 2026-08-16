import type { DataTableMobileCard } from "@/components/data-table/data-table";
import {
  ReportDownloadCell,
  ReportStatusMessageCell,
} from "../../shared/components/report-action-cells";
import type { ContractPriceReportRow } from "../types";
import type { Translate } from "@/i18n/types";
export function createMobileCard(
  t: Translate = (key) => key
): DataTableMobileCard<ContractPriceReportRow> {
  return {
    renderTitle: (row) => row.reportNo,
    renderSubtitle: (row) => row.pricePeriod,
    fields: [
      {
        label: t("common.fields.reportCreatedDate"),
        render: (row) => row.reportCreatedDate,
      },
      {
        label: t("common.fields.status"),
        render: (row) => (
          <ReportStatusMessageCell
            job={row.report}
            label={t("common.fields.report")}
          />
        ),
      },
      {
        label: t("common.fields.reportDownload"),
        render: (row) => <ReportDownloadCell job={row.report} />,
      },
    ],
  };
}
