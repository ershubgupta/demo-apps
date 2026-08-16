"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import type { CatalogStoreCustomer } from "@/features/catalog-store/types";

type CustomersPanelProps = {
  customers: CatalogStoreCustomer[];
  cvCode?: string;
  customerName?: string;
  isLoading?: boolean;
  mmid?: string;
  tier?: string;
};

function matchesContains(value: string, filter?: string) {
  const normalized = filter?.trim().toLowerCase();
  if (!normalized) return true;
  return value.trim().toLowerCase().includes(normalized);
}

export function CustomersPanel({
  customers,
  cvCode,
  customerName,
  isLoading = false,
  mmid,
  tier,
}: CustomersPanelProps) {
  const t = useTranslations();
  const filteredCustomers = useMemo(() => {
    const normalizedTier = tier?.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesTier = normalizedTier
        ? customer.catalogTier.trim().toLowerCase() === normalizedTier
        : true;

      return (
        matchesTier &&
        matchesContains(customer.cvCode, cvCode) &&
        matchesContains(customer.mmid, mmid) &&
        matchesContains(customer.customerName, customerName)
      );
    });
  }, [customers, cvCode, customerName, mmid, tier]);

  const columns = useMemo<ColumnDef<CatalogStoreCustomer>[]>(
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
        meta: { width: "25%" },
      },
      {
        accessorKey: "catalogTier",
        header: t("common.fields.catalogTier"),
        meta: { width: "15%" },
      },
      {
        accessorKey: "operationStore",
        header: t("common.fields.operationStore"),
        meta: { width: "15%", noWrap: true },
      },
    ],
    [t]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        data={filteredCustomers}
        minWidth={800}
        emptyMessage={t("details.customers.empty")}
        getRowId={(row) => row.id}
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
            {
              label: t("common.fields.operationStore"),
              render: (customer) => customer.operationStore,
            },
          ],
        }}
      />
    </div>
  );
}
