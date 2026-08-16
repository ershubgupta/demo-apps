"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { contractPriceItemListQueryOptions } from "@/features/contract-price/api/queries";
import { createContractItemMobileCard } from "./mobile-card";
import { createContractItemColumns } from "./table-columns";

type ContractItemPanelProps = {
  approvedPriceInVat?: string;
  contractId: string;
  itemDescription?: string;
  itemNo?: string;
  salesAtShelfPrice?: string;
};

function resolveSalesAtShelfPriceFilter(value?: string): "Y" | "N" | undefined {
  return value === "Y" || value === "N" ? value : undefined;
}

export function ContractItemPanel({
  approvedPriceInVat,
  contractId,
  itemDescription,
  itemNo,
  salesAtShelfPrice,
}: ContractItemPanelProps) {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(TABLE_PAGE_SIZE);
  const resolvedSalesAtShelfPrice =
    resolveSalesAtShelfPriceFilter(salesAtShelfPrice);
  const filterKey = `${itemNo ?? ""}|${itemDescription ?? ""}|${resolvedSalesAtShelfPrice ?? ""}|${approvedPriceInVat ?? ""}`;
  const [pageFilterKey, setPageFilterKey] = useState(filterKey);

  if (filterKey !== pageFilterKey) {
    setPageFilterKey(filterKey);
    setPage(1);
  }

  const query = useQuery(
    contractPriceItemListQueryOptions(contractId, {
      page,
      pageSize,
      itemNo: itemNo || undefined,
      itemDescription: itemDescription || undefined,
      salesAtShelfPrice: resolvedSalesAtShelfPrice,
      approvedPriceInVat: approvedPriceInVat || undefined,
    })
  );

  const items = useMemo(() => query.data?.items ?? [], [query.data?.items]);
  const pagination = query.data?.pagination;
  const columns = useMemo(() => createContractItemColumns(t), [t]);
  const mobileCard = useMemo(() => createContractItemMobileCard(t), [t]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {query.isError ? (
        <AppErrorState
          className="min-h-0 flex-1 items-center justify-center p-8 text-center"
          onRetry={() => {
            void query.refetch();
          }}
          title={t("details.contractPrice.itemsLoadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 flex-1"
          columns={columns}
          data={items}
          minWidth={1500}
          emptyMessage={t("details.contractPrice.itemsEmpty")}
          getRowId={(row) => row.id}
          isLoading={query.isLoading}
          mobileCard={mobileCard}
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
