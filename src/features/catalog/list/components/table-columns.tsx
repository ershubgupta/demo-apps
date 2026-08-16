"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";

import { AppBadge } from "@/components/app-badge";
import { PrioritySequence } from "@/components/priority-sequence/priority-sequence";
import { RowActions } from "./row-actions";
import {
  catalogStatusVariant,
  getCatalogStatusLabel,
} from "@/features/catalog-ho/config/status-config";
import type { Catalog } from "@/features/catalog-ho/types";
import type { Translate } from "@/i18n/types";
import { CatalogTypeEnum } from "@/types/catalog";
import type { RowAction } from "./row-actions";
import {
  canShowCatalogActions,
  getCatalogDetailHref,
  type CatalogListPageConfig,
} from "../config/page-config";
import { getCatalogTypeLabel } from "../config/filter-types";

export function createCatalogColumns({
  config,
  onActionOpenChange,
  onAction,
  openActionRowId,
  t = (key) => key,
}: {
  config: CatalogListPageConfig;
  onActionOpenChange: (rowId: string, open: boolean) => void;
  onAction: (catalog: Catalog, action: RowAction) => void;
  openActionRowId: string | null;
  t?: Translate;
}): ColumnDef<Catalog>[] {
  const columns: ColumnDef<Catalog>[] = [
    {
      accessorKey: "number",
      header: t("common.fields.number"),
      cell: ({ row }) => (
        <Link
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href={getCatalogDetailHref(row.original)}
        >
          {row.original.number}
        </Link>
      ),
      meta: { width: 160, noWrap: true },
    },
  ];

  if (config.showCatalogTypeColumn) {
    columns.push({
      accessorKey: "catalogType",
      header: t("common.fields.catalogType"),
      cell: ({ row }) => getCatalogTypeLabel(row.original.catalogType, t),
      meta: { width: 140, noWrap: true },
    });
  }

  if (config.showRevisionColumn) {
    columns.push({
      accessorKey: "revision",
      header: t("common.fields.revision"),
      cell: ({ row }) =>
        row.original.catalogType === CatalogTypeEnum.CATALOG_STORE ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          row.original.revision
        ),
      meta: { align: "right", isNumeric: true, noWrap: true, width: 70 },
    });
  }

  columns.push(
    {
      accessorKey: "charge",
      header: t("common.fields.charge"),
      meta: { align: "right", isNumeric: true, noWrap: true, width: 80 },
    },
    {
      accessorKey: "startDate",
      header: t("common.fields.startDate"),
      meta: { noWrap: true, width: 120 },
    },
    {
      accessorKey: "endDate",
      header: t("common.fields.endDate"),
      meta: { noWrap: true, width: 120 },
    },
    {
      accessorKey: "priceStartDate",
      header: t("common.fields.priceStart"),
      meta: { noWrap: true, width: 120 },
    },
    {
      accessorKey: "priceEndDate",
      header: t("common.fields.priceEnd"),
      meta: { noWrap: true, width: 120 },
    },
    {
      accessorKey: "store",
      header: t("common.fields.store"),
      cell: ({ row }) => (
        <PrioritySequence
          className="max-w-37.5"
          maxVisibleItems={3}
          value={row.original.store}
          variant="badge"
        />
      ),
      meta: { noWrap: true, width: 150 },
    },
    {
      accessorKey: "status",
      header: t("common.fields.status"),
      cell: ({ row }) => (
        <AppBadge showDot variant={catalogStatusVariant[row.original.status]}>
          {getCatalogStatusLabel(row.original.status, t)}
        </AppBadge>
      ),
      meta: { noWrap: true, width: 110 },
    }
  );

  if (config.enableActions) {
    columns.push({
      id: "actions",
      header: t("common.fields.actions"),
      enableSorting: false,
      cell: ({ row }) =>
        canShowCatalogActions(row.original, config) ? (
          <RowActions
            catalog={row.original}
            onAction={onAction}
            onOpenChange={(open) => onActionOpenChange(row.original.id, open)}
            open={openActionRowId === row.original.id}
          />
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      meta: { align: "right", noWrap: true, width: 64 },
    });
  }

  return columns;
}
