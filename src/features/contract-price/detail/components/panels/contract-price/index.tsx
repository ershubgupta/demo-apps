"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { contractPricePeriodListQueryOptions } from "@/features/contract-price/api/queries";
import { CONTRACT_PRICE_STATUS_OPTIONS } from "@/features/contract-price/config/status-config";
import type { ContractPricePeriodStatus } from "@/features/contract-price/types";
import { createContractPricePeriodMobileCard } from "./mobile-card";
import { createContractPricePeriodColumns } from "./table-columns";

type ContractPricePanelProps = {
  contractId: string;
  endDate?: string;
  startDate?: string;
  status?: string;
};

function resolveStatusFilters(
  status?: string
): ContractPricePeriodStatus[] | undefined {
  if (!status) return undefined;

  const statuses = status
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is ContractPricePeriodStatus =>
      CONTRACT_PRICE_STATUS_OPTIONS.includes(value as ContractPricePeriodStatus)
    );

  return statuses.length > 0 ? statuses : undefined;
}

export function ContractPricePanel({
  contractId,
  endDate,
  startDate,
  status,
}: ContractPricePanelProps) {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(TABLE_PAGE_SIZE);
  const resolvedStatuses = resolveStatusFilters(status);
  const filterKey = `${startDate ?? ""}|${endDate ?? ""}|${resolvedStatuses?.join(",") ?? ""}`;
  const [pageFilterKey, setPageFilterKey] = useState(filterKey);

  if (filterKey !== pageFilterKey) {
    setPageFilterKey(filterKey);
    setPage(1);
  }

  const query = useQuery(
    contractPricePeriodListQueryOptions(contractId, {
      page,
      pageSize,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: resolvedStatuses,
    })
  );

  const periods = useMemo(() => query.data?.items ?? [], [query.data?.items]);
  const pagination = query.data?.pagination;
  const columns = useMemo(() => createContractPricePeriodColumns(t), [t]);
  const mobileCard = useMemo(() => createContractPricePeriodMobileCard(t), [t]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {query.isError ? (
        <AppErrorState
          className="min-h-0 flex-1 items-center justify-center p-8 text-center"
          onRetry={() => {
            void query.refetch();
          }}
          title={t("details.contractPrice.periodsLoadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 flex-1"
          columns={columns}
          data={periods}
          minWidth={1100}
          emptyMessage={t("details.contractPrice.periodsEmpty")}
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
