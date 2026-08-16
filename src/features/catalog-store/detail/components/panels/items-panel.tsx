"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { AppBadge } from "@/components/app-badge";
import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { catalogStoreItemListQueryOptions } from "@/features/catalog-store/api/queries";
import {
  catalogStoreItemStatusLabel,
  catalogStoreItemStatusVariant,
} from "@/features/catalog-store/config/status-config";
import type { CatalogStoreItem } from "@/features/catalog-store/types";

type ItemsPanelProps = {
  catalogId: string;
  itemDescription?: string;
  itemNo?: string;
  tier?: string;
};

export function ItemsPanel({
  catalogId,
  itemDescription,
  itemNo,
  tier,
}: ItemsPanelProps) {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(TABLE_PAGE_SIZE);
  const filterKey = `${tier ?? ""}|${itemNo ?? ""}|${itemDescription ?? ""}`;
  const [pageFilterKey, setPageFilterKey] = useState(filterKey);

  if (filterKey !== pageFilterKey) {
    setPageFilterKey(filterKey);
    setPage(1);
  }

  const query = useQuery(
    catalogStoreItemListQueryOptions(catalogId, {
      page,
      pageSize,
      tier: tier || undefined,
      itemNo: itemNo || undefined,
      itemDescription: itemDescription || undefined,
    })
  );

  const items = useMemo(() => query.data?.items ?? [], [query.data?.items]);
  const pagination = query.data?.pagination;

  const columns = useMemo<ColumnDef<CatalogStoreItem>[]>(
    () => [
      {
        accessorKey: "itemNo",
        header: t("common.fields.item"),
        cell: ({ row }) => (
          <span className="font-medium text-primary">
            {row.original.itemNo}
          </span>
        ),
        meta: { width: "12%", noWrap: true, stickyLeft: true },
      },
      {
        accessorKey: "itemDescription",
        header: t("common.fields.itemDescription"),
        cell: ({ row }) => (
          <span
            className="block max-w-[260px] truncate"
            title={row.original.itemDescription}
          >
            {row.original.itemDescription}
          </span>
        ),
        meta: { width: "27%" },
      },
      {
        accessorKey: "priceSource",
        header: t("common.fields.priceSource"),
        meta: { align: "right", isNumeric: true, width: "9%" },
      },
      {
        accessorKey: "department",
        header: t("common.fields.department"),
        meta: { align: "right", isNumeric: true, width: "9%" },
      },
      {
        accessorKey: "classNo",
        header: t("common.fields.classNo"),
        meta: { align: "right", isNumeric: true, width: "8%" },
      },
      {
        accessorKey: "status",
        header: t("common.fields.itemStatus"),
        cell: ({ row }) => (
          <AppBadge
            showDot
            variant={catalogStoreItemStatusVariant[row.original.status]}
          >
            {catalogStoreItemStatusLabel[row.original.status]}
          </AppBadge>
        ),
        meta: { width: "12%", align: "center" },
      },
      {
        accessorKey: "regularPriceInVat",
        header: t("common.fields.regularPriceInVat"),
        meta: { align: "right", isNumeric: true, width: "12%" },
      },
      {
        accessorKey: "catalogChargePercent",
        header: t("common.fields.catalogChargePercent"),
        meta: { align: "right", isNumeric: true, width: "8%" },
      },
      {
        accessorKey: "charge",
        header: t("common.fields.chargedPriceInVat"),
        meta: { align: "right", isNumeric: true, width: "10%" },
      },
      {
        accessorKey: "finalPriceExVat",
        header: t("common.fields.finalPriceExVat"),
        meta: { align: "right", isNumeric: true, width: "10%" },
      },
      {
        accessorKey: "vat",
        header: t("common.fields.vat"),
        meta: { align: "right", isNumeric: true, width: "6%" },
      },
      {
        accessorKey: "finalPriceInVat",
        header: t("common.fields.finalPriceInVat"),
        meta: { align: "right", isNumeric: true, width: "10%" },
      },
    ],
    [t]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {query.isError ? (
        <AppErrorState
          className="min-h-0 flex-1 items-center justify-center p-8 text-center"
          onRetry={() => {
            void query.refetch();
          }}
          title={t("details.items.loadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 flex-1"
          columns={columns}
          data={items}
          minWidth={1700}
          emptyMessage={t("details.items.empty")}
          getRowId={(row) => row.id}
          isLoading={query.isLoading}
          mobileCard={{
            renderTitle: (item) => item.itemNo,
            renderSubtitle: (item) => item.itemDescription,
            renderStatus: (item) => (
              <AppBadge
                showDot
                variant={catalogStoreItemStatusVariant[item.status]}
              >
                {catalogStoreItemStatusLabel[item.status]}
              </AppBadge>
            ),
            fields: [
              {
                label: t("common.fields.priceSource"),
                render: (item) => item.priceSource,
              },
              {
                label: t("common.fields.department"),
                render: (item) => item.department,
              },
              {
                label: t("common.fields.classNo"),
                render: (item) => item.classNo,
              },
              {
                label: t("common.fields.regularPrice"),
                render: (item) => item.regularPriceInVat,
              },
              {
                label: t("common.fields.catalogChargePercent"),
                render: (item) => item.catalogChargePercent,
              },
              {
                label: t("common.fields.chargedPrice"),
                render: (item) => item.charge,
              },
              {
                label: t("common.fields.finalPriceExVat"),
                render: (item) => item.finalPriceExVat,
              },
              { label: t("common.fields.vat"), render: (item) => item.vat },
              {
                label: t("common.fields.finalPriceInVat"),
                render: (item) => item.finalPriceInVat,
              },
            ],
          }}
          pagination={
            pagination
              ? {
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                  totalItems: pagination.totalItems,
                  onPageChange: setPage,
                  onPageSizeChange: (nextPageSize) => {
                    setPage(1);
                    setPageSize(nextPageSize);
                  },
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
