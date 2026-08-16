"use client";

import { AppBadge } from "@/components/app-badge";
import type { DataTableMobileCard } from "@/components/data-table/data-table";
import {
  contractPriceItemStatusLabel,
  contractPriceItemStatusVariant,
  contractPriceStatusLabelKey,
  contractPriceStatusVariant,
} from "@/features/contract-price/config/status-config";
import type { ContractPriceItem } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";
import { formatGpPercent } from "./format";

/** Builds the mobile card layout for contract price items. */
export function createContractItemMobileCard(
  t: Translate = (key) => key
): DataTableMobileCard<ContractPriceItem> {
  return {
    renderTitle: (item) => item.itemNo,
    renderSubtitle: (item) => item.itemDescription,
    renderStatus: (item) => (
      <AppBadge showDot variant={contractPriceStatusVariant[item.periodStatus]}>
        {t(contractPriceStatusLabelKey[item.periodStatus])}
      </AppBadge>
    ),
    fields: [
      {
        label: t("details.catalog.periodDate"),
        render: (item) => `${item.periodStart} - ${item.periodEnd}`,
      },
      {
        label: t("common.fields.itemStatus"),
        render: (item) => (
          <AppBadge
            showDot
            variant={contractPriceItemStatusVariant[item.status]}
          >
            {contractPriceItemStatusLabel[item.status]}
          </AppBadge>
        ),
      },
      {
        label: t("common.fields.normalGpPercent"),
        render: (item) => formatGpPercent(item.normalGpPercent),
      },
      {
        label: t("common.fields.salesAtShelfPrice"),
        render: (item) => item.salesAtShelfPrice ?? "—",
      },
      {
        label: t("common.fields.approvedPriceInVat"),
        render: (item) => item.approvedPriceInVat,
      },
      {
        label: t("common.fields.finalPriceInVat"),
        render: (item) => item.finalPriceInVat,
      },
      {
        label: t("common.fields.promoGpPercent"),
        render: (item) => formatGpPercent(item.promoGpPercent),
      },
    ],
  };
}
