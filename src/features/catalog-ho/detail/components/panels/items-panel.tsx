"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";

import { AppBadge } from "@/components/app-badge";
import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { catalogItemListQueryOptions } from "@/features/catalog-ho/api/queries";
import {
  catalogItemStatusLabel,
  catalogItemStatusVariant,
} from "@/features/catalog-ho/config/status-config";
import { useSelectedDeleteAction } from "../../hooks/use-selected-delete-action";
import type { CatalogItem } from "@/features/catalog-ho/types";

type ItemsPanelProps = {
  catalogId: string;
  onEditItem: (item: CatalogItem) => void;
  onSelectedDeleteActionChange: (
    selectedCount: number,
    onDeleteSelected: (() => void) | null
  ) => void;
};

type CatalogDeleteScope = "selected" | "all";

export function ItemsPanel({
  catalogId,
  onEditItem,
  onSelectedDeleteActionChange,
}: ItemsPanelProps) {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(TABLE_PAGE_SIZE);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteConfirmScope, setDeleteConfirmScope] =
    useState<CatalogDeleteScope | null>(null);
  const deleteConfirmedRef = useRef(false);

  const query = useQuery(
    catalogItemListQueryOptions(catalogId, {
      page,
      pageSize,
    })
  );

  const items = useMemo(() => query.data?.items ?? [], [query.data?.items]);
  const pagination = query.data?.pagination;

  const selectedItems = useMemo(
    () => items.filter((item) => rowSelection[item.id]),
    [items, rowSelection]
  );
  const requestSelectedDelete = useCallback(() => {
    setDeleteConfirmScope("selected");
  }, []);

  useSelectedDeleteAction({
    onDeleteSelected: requestSelectedDelete,
    onSelectedDeleteActionChange,
    rowSelection,
  });

  const columns = useMemo<ColumnDef<CatalogItem>[]>(
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
            variant={catalogItemStatusVariant[row.original.status]}
          >
            {catalogItemStatusLabel[row.original.status]}
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
        meta: { align: "right", isNumeric: true, width: "7%" },
      },
      {
        accessorKey: "charge",
        header: t("common.fields.charge"),
        meta: { align: "right", isNumeric: true, width: "4%" },
      },
    ],
    [t]
  );

  const handleDeleteConfirm = () => {
    if (deleteConfirmScope === "selected") {
      console.info("Delete selected catalog items", {
        catalogId,
        selectedIds: Object.keys(rowSelection).filter((id) => rowSelection[id]),
      });
      toast.success("Catalog items deleted", {
        description: "Selected catalog items have been removed.",
      });
      setRowSelection({});
    } else if (deleteConfirmScope === "all") {
      console.info("Delete all catalog items", { catalogId });
    }
    setDeleteConfirmScope(null);
  };

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
          minWidth={1400}
          emptyMessage={t("details.items.empty")}
          enableRowSelection
          stickySelectionColumn
          getRowId={(row) => row.id}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={onEditItem}
          isLoading={query.isLoading}
          mobileCard={{
            renderTitle: (item) => item.itemNo,
            renderSubtitle: (item) => item.itemDescription,
            renderStatus: (item) => (
              <AppBadge showDot variant={catalogItemStatusVariant[item.status]}>
                {catalogItemStatusLabel[item.status]}
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
                label: t("common.fields.charge"),
                render: (item) => item.charge,
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

      <ConfirmationAlert
        confirmLabel={t("common.actions.delete")}
        description={
          <div className="space-y-3">
            <p>{t("details.items.deleteSelectedDescription")}</p>
            {selectedItems.length > 0 ? (
              <ul className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border bg-muted/30 p-2">
                {selectedItems.map((item) => (
                  <li
                    key={item.id}
                    className="text-xs leading-relaxed text-foreground"
                  >
                    <span className="font-semibold text-primary">
                      {item.itemNo}
                    </span>
                    <span className="text-muted-foreground"> - </span>
                    <span>{item.itemDescription}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        }
        open={deleteConfirmScope !== null}
        onOpenChange={(next) => {
          if (next) return;
          if (deleteConfirmedRef.current) {
            deleteConfirmedRef.current = false;
            return;
          }
          setDeleteConfirmScope(null);
        }}
        onConfirm={() => {
          deleteConfirmedRef.current = true;
          handleDeleteConfirm();
        }}
        title={t("details.items.deleteSelectedTitle")}
        variant="destructive"
      />
    </div>
  );
}
