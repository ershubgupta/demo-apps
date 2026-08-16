"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { useSelectedDeleteAction } from "../../hooks/use-selected-delete-action";
import type { CatalogCustomer } from "@/features/catalog-ho/types";

type CustomersPanelProps = {
  catalogId: string;
  customers: CatalogCustomer[];
  isLoading?: boolean;
  onSelectedDeleteActionChange: (
    selectedCount: number,
    onDeleteSelected: (() => void) | null
  ) => void;
};

type CatalogDeleteScope = "selected" | "all";

export function CustomersPanel({
  catalogId,
  customers,
  isLoading = false,
  onSelectedDeleteActionChange,
}: CustomersPanelProps) {
  const t = useTranslations();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteConfirmScope, setDeleteConfirmScope] =
    useState<CatalogDeleteScope | null>(null);
  const deleteConfirmedRef = useRef(false);

  const requestSelectedDelete = useCallback(() => {
    setDeleteConfirmScope("selected");
  }, []);

  useSelectedDeleteAction({
    onDeleteSelected: requestSelectedDelete,
    onSelectedDeleteActionChange,
    rowSelection,
  });

  const columns = useMemo<ColumnDef<CatalogCustomer>[]>(
    () => [
      {
        accessorKey: "cvCode",
        header: t("common.fields.cvCodeCompact"),
        cell: ({ row }) => (
          <span className="font-medium text-primary">
            {row.original.cvCode}
          </span>
        ),
        meta: { width: "15%", noWrap: true },
      },
      {
        accessorKey: "mmid",
        header: t("common.fields.mmid"),
        meta: { width: "15%", noWrap: true },
      },
      {
        accessorKey: "customerName",
        header: t("common.fields.customerName"),
        meta: { width: "20%" },
      },
      {
        accessorKey: "catalogTier",
        header: t("common.fields.catalogTier"),
        meta: { width: "50%" },
      },
    ],
    [t]
  );

  const handleDeleteConfirm = () => {
    if (deleteConfirmScope === "selected") {
      console.info("Delete selected catalog customers", {
        catalogId,
        selectedIds: Object.keys(rowSelection).filter((id) => rowSelection[id]),
      });
      toast.success("Catalog customers deleted", {
        description: "Selected catalog customers have been removed.",
      });
      setRowSelection({});
    } else if (deleteConfirmScope === "all") {
      console.info("Delete all catalog customers", { catalogId });
    }
    setDeleteConfirmScope(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        data={customers}
        minWidth={615}
        emptyMessage={t("details.customers.empty")}
        enableRowSelection
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        initialPageSize={TABLE_PAGE_SIZE}
        isLoading={isLoading}
        mobileCard={{
          renderTitle: (customer) => customer.cvCode,
          renderSubtitle: (customer) => customer.customerName,
          fields: [
            {
              label: t("common.fields.mmid"),
              render: (customer) => customer.mmid,
            },
            {
              label: t("common.fields.catalogTier"),
              render: (customer) => customer.catalogTier,
            },
          ],
        }}
      />

      <ConfirmationAlert
        confirmLabel={t("common.actions.delete")}
        description={t("details.customers.deleteSelectedDescription")}
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
        title={t("details.customers.deleteSelectedTitle")}
        variant="destructive"
      />
    </div>
  );
}
