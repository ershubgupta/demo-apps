"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ActionsMenu } from "@/components/actions-menu";
import { AppBadge } from "@/components/app-badge";
import {
  contractPriceStatusLabelKey,
  contractPriceStatusVariant,
} from "@/features/contract-price/config/status-config";
import type { ContractPricePeriod } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";
import { getContractPricePeriodActions } from "./period-actions";

/** Builds desktop table columns for contract price periods. */
export function createContractPricePeriodColumns(
  t: Translate = (key) => key
): ColumnDef<ContractPricePeriod>[] {
  return [
    {
      accessorKey: "period",
      header: t("common.fields.period"),
      cell: ({ row }) => (
        <span className="font-medium">
          {`${row.original.startDate} - ${row.original.endDate}`}
        </span>
      ),
      meta: { width: "26%", noWrap: true },
    },
    {
      accessorKey: "itemCount",
      header: t("common.fields.items"),
      meta: { align: "right", isNumeric: true, width: "10%" },
    },
    {
      accessorKey: "requestedBy",
      header: t("common.fields.requestedBy"),
      cell: ({ row }) => (
        <span
          className="block max-w-[280px] truncate"
          title={`${row.original.requestedBy} ${row.original.requestedAt}`}
        >
          {`${row.original.requestedBy} ${row.original.requestedAt}`}
        </span>
      ),
      meta: { width: "24%" },
    },
    {
      accessorKey: "approvedBy",
      header: t("common.fields.approvedBy"),
      cell: ({ row }) => {
        if (!row.original.approvedBy) return null;
        return (
          <span
            className="block max-w-[280px] truncate"
            title={`${row.original.approvedBy} ${row.original.approvedAt}`}
          >
            {`${row.original.approvedBy} ${row.original.approvedAt}`}
          </span>
        );
      },
      meta: { width: "24%" },
    },
    {
      accessorKey: "status",
      header: t("common.fields.status"),
      cell: ({ row }) => (
        <AppBadge
          showDot
          variant={contractPriceStatusVariant[row.original.status]}
        >
          {t(contractPriceStatusLabelKey[row.original.status])}
        </AppBadge>
      ),
      meta: { width: "14%", align: "center" },
    },
    {
      accessorKey: "actions",
      header: t("common.fields.actions"),
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsMenu
          actions={getContractPricePeriodActions(row.original)}
          ariaLabel={t("common.fields.actions")}
          contentClassName="min-w-52"
        />
      ),
      meta: { align: "right", noWrap: true, width: "8%" },
    },
  ];
}
