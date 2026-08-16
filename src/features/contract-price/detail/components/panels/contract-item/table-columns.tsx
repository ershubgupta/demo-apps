"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AppBadge } from "@/components/app-badge";
import {
  contractPriceItemStatusLabel,
  contractPriceItemStatusVariant,
  contractPriceStatusLabelKey,
  contractPriceStatusVariant,
} from "@/features/contract-price/config/status-config";
import type { ContractPriceItem } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";
import { formatGpPercent } from "./format";

/** Builds desktop table columns for contract price items. */
export function createContractItemColumns(
  t: Translate = (key) => key
): ColumnDef<ContractPriceItem>[] {
  return [
    {
      accessorKey: "itemNo",
      header: t("common.fields.item"),
      cell: ({ row }) => (
        <span className="font-medium text-primary">{row.original.itemNo}</span>
      ),
      meta: { width: "8%", noWrap: true, stickyLeft: true },
    },
    {
      accessorKey: "itemDescription",
      header: t("common.fields.itemDescription"),
      cell: ({ row }) => (
        <span
          className="block max-w-[220px] truncate"
          title={row.original.itemDescription}
        >
          {row.original.itemDescription}
        </span>
      ),
      meta: { width: "14%" },
    },
    {
      accessorKey: "periodStatus",
      header: t("common.fields.status"),
      cell: ({ row }) => (
        <AppBadge
          showDot
          variant={contractPriceStatusVariant[row.original.periodStatus]}
        >
          {t(contractPriceStatusLabelKey[row.original.periodStatus])}
        </AppBadge>
      ),
      meta: { width: "10%", align: "center", noWrap: true },
    },
    {
      accessorKey: "periodDate",
      header: t("details.catalog.periodDate"),
      cell: ({ row }) => (
        <span className="font-medium">
          {`${row.original.periodStart} - ${row.original.periodEnd}`}
        </span>
      ),
      meta: { width: "16%", noWrap: true },
    },
    {
      accessorKey: "status",
      header: t("common.fields.itemStatus"),
      cell: ({ row }) => (
        <AppBadge
          showDot
          variant={contractPriceItemStatusVariant[row.original.status]}
        >
          {contractPriceItemStatusLabel[row.original.status]}
        </AppBadge>
      ),
      meta: { width: "10%", align: "center", noWrap: true },
    },
    {
      accessorKey: "normalGpPercent",
      header: t("common.fields.normalGpPercent"),
      cell: ({ row }) => formatGpPercent(row.original.normalGpPercent),
      meta: { align: "right", isNumeric: true, width: "8%" },
    },
    {
      accessorKey: "salesAtShelfPrice",
      header: t("common.fields.salesAtShelfPrice"),
      cell: ({ row }) => row.original.salesAtShelfPrice ?? "",
      meta: { align: "center", width: "10%", noWrap: true },
    },
    {
      accessorKey: "approvedPriceInVat",
      header: t("common.fields.approvedPriceInVat"),
      meta: { align: "right", isNumeric: true, width: "10%" },
    },
    {
      accessorKey: "finalPriceInVat",
      header: t("common.fields.finalPriceInVat"),
      meta: { align: "right", isNumeric: true, width: "9%" },
    },
    {
      accessorKey: "promoGpPercent",
      header: t("common.fields.promoGpPercent"),
      cell: ({ row }) => formatGpPercent(row.original.promoGpPercent),
      meta: { align: "right", isNumeric: true, width: "8%" },
    },
  ];
}
