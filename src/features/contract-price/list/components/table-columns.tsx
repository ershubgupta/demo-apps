"use client";

import { type ColumnDef } from "@tanstack/react-table";

import type { ContractPrice } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";
import Link from "next/link";

export function createContractPriceColumns(
  t: Translate = (key) => key
): ColumnDef<ContractPrice>[] {
  return [
    {
      accessorKey: "number",
      header: t("common.fields.number"),
      cell: ({ row }) => (
        <Link
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href={`/contract-price/${encodeURIComponent(row.original.number)}`}
        >
          {row.original.number}
        </Link>
      ),
      meta: { width: 160, noWrap: true },
    },
    {
      accessorKey: "type",
      header: t("common.fields.type"),
      meta: { noWrap: true, width: 100 },
    },
    {
      accessorKey: "cvCode",
      header: t("common.fields.cvCode"),
      meta: { noWrap: true, width: 100 },
    },
    {
      accessorKey: "customerName",
      header: t("common.fields.customerName"),
      meta: { noWrap: true, width: 180 },
    },
    {
      accessorKey: "itemNo",
      header: t("common.fields.itemNo"),
      meta: { noWrap: true, width: 100 },
    },
    {
      accessorKey: "itemDescription",
      header: t("common.fields.itemDescription"),
      meta: { noWrap: true, width: 200 },
    },
    {
      accessorKey: "startDate",
      header: t("common.fields.startDate"),
      meta: { noWrap: true, width: 130 },
    },
    {
      accessorKey: "endDate",
      header: t("common.fields.endDate"),
      meta: { noWrap: true, width: 130 },
    },
    {
      accessorKey: "store",
      header: t("common.fields.store"),
      meta: { noWrap: true, width: 90 },
    },
    {
      accessorKey: "requestedBy",
      header: t("common.fields.requestedBy"),
      meta: { noWrap: true, width: 140 },
    },
  ];
}
