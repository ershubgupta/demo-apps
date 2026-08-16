"use client";

import { ActionsMenu } from "@/components/actions-menu";
import { AppBadge } from "@/components/app-badge";
import type { DataTableMobileCard } from "@/components/data-table/data-table";
import {
  contractPriceStatusLabelKey,
  contractPriceStatusVariant,
} from "@/features/contract-price/config/status-config";
import type { ContractPricePeriod } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";
import { getContractPricePeriodActions } from "./period-actions";

/** Builds the mobile card layout for contract price periods. */
export function createContractPricePeriodMobileCard(
  t: Translate = (key) => key
): DataTableMobileCard<ContractPricePeriod> {
  return {
    renderTitle: (period) => `${period.startDate} - ${period.endDate}`,
    renderSubtitle: (period) => `${period.requestedBy} ${period.requestedAt}`,
    renderStatus: (period) => (
      <AppBadge showDot variant={contractPriceStatusVariant[period.status]}>
        {t(contractPriceStatusLabelKey[period.status])}
      </AppBadge>
    ),
    renderActions: (period) => (
      <ActionsMenu
        actions={getContractPricePeriodActions(period)}
        ariaLabel={t("common.fields.actions")}
        contentClassName="min-w-52"
      />
    ),
    fields: [
      {
        label: t("common.fields.items"),
        render: (period) => period.itemCount,
      },
      {
        label: t("common.fields.requestedBy"),
        render: (period) => period.requestedBy,
      },
      {
        label: t("common.fields.approvedBy"),
        render: (period) =>
          period.approvedBy ? `${period.approvedBy} ${period.approvedAt}` : "—",
      },
    ],
  };
}
