"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfigurableListFilters } from "@/components/filters/configurable-list-filters";
import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { POLL_TIMEOUT_MS, TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import {
  getFiltersFromSearchParams,
  getPageFromSearchParams,
  getPageSizeFromSearchParams,
  updateUrlParams,
} from "@/lib/utils/urlParams";
import { QUERY_KEYS } from "@/lib/query/query-keys";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contractPriceReportListQueryOptions } from "./api/queries";
import { generateContractPriceReport } from "./api/service";
import { createMobileCard } from "./components/mobile-card";
import { createContractPriceReportColumns } from "./components/table-columns";
import {
  createContractReportFilterFields,
  createContractReportFilterLabels,
  emptyContractReportFilters,
  type ContractReportFilters,
} from "./config/filters";
import type { ContractPriceReportListParams } from "./types";
import {
  getActiveFilters,
  getFilterUpdates,
  useReportPolling,
} from "../shared/page-utils";
import { hasPendingReportJobs } from "../shared/utils";
export { contractPriceReportFilterFields } from "./config/filters";
export { createContractPriceReportColumns } from "./components/table-columns";
export function ContractPriceReportPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [pollUntil, setPollUntil] = useState<number | null>(null);
  const page = getPageFromSearchParams(searchParams);
  const pageSize = getPageSizeFromSearchParams(searchParams);
  const filters = getFiltersFromSearchParams(
    searchParams,
    emptyContractReportFilters
  ) as ContractReportFilters;
  const params = useMemo<ContractPriceReportListParams>(
    () => ({
      reportNo: filters.reportNo || undefined,
      reportCreatedDate: filters.reportCreatedDate || undefined,
      priceStartDate: filters.priceStartDate || undefined,
      priceEndDate: filters.priceEndDate || undefined,
      page,
      pageSize,
    }),
    [filters, page, pageSize]
  );
  const query = useQuery(contractPriceReportListQueryOptions(params));
  const data = query.data?.items ?? [];
  const pagination = query.data?.pagination;
  const mutation = useMutation({
    mutationFn: generateContractPriceReport,
    onSuccess: async () => {
      setPollUntil(Date.now() + POLL_TIMEOUT_MS);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reports.contractPrice.all,
      });
    },
    onError: (error) =>
      toast.error(t("reports.contractPrice.generationFailed"), {
        description: error instanceof Error ? error.message : undefined,
      }),
  });
  useReportPolling({
    hasPending: data.some((row) => hasPendingReportJobs([row.report])),
    pollUntil,
    setPollUntil,
    refetch: () => void query.refetch(),
  });
  const columns = useMemo(() => createContractPriceReportColumns(t), [t]);
  const filterFields = useMemo(() => createContractReportFilterFields(t), [t]);
  const filterLabels = useMemo(() => createContractReportFilterLabels(t), [t]);
  const setFilter = (name: keyof ContractReportFilters, value: string) =>
    updateUrlParams<ContractReportFilters>(router, pathname, searchParams, {
      [name]: value,
      page: null,
    });
  const applyFilters = (next: ContractReportFilters) =>
    updateUrlParams<ContractReportFilters>(router, pathname, searchParams, {
      ...getFilterUpdates(emptyContractReportFilters, next),
      page: null,
    });
  const setPage = (nextPage: number) =>
    updateUrlParams<ContractReportFilters>(router, pathname, searchParams, {
      page: nextPage > 1 ? String(nextPage) : null,
    });
  const setPageSize = (nextPageSize: number) =>
    updateUrlParams<ContractReportFilters>(router, pathname, searchParams, {
      page: null,
      pageSize: nextPageSize === TABLE_PAGE_SIZE ? null : nextPageSize,
    });
  return (
    <section className="flex min-h-0 flex-col gap-4 md:h-full">
      <PageHeader
        title={t("reports.contractPrice.title")}
        subtitle={t("reports.contractPrice.subtitle")}
        actions={
          <Button
            className="hidden h-9 rounded-lg px-3 text-xs font-semibold sm:px-4 md:inline-flex"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate({ variant: "contractPrice" })}
            type="button"
          >
            <PlayCircle className="h-4 w-4" />
            {t("reports.contractPrice.report")}
          </Button>
        }
      />
      <ConfigurableListFilters
        activeFilters={getActiveFilters(filters, filterLabels)}
        emptyFilters={emptyContractReportFilters}
        fields={filterFields}
        filters={filters}
        onApplyFilters={applyFilters}
        onChange={setFilter}
        onReset={() => router.replace(pathname, { scroll: false })}
        primaryGridClassName="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
        showMoreToggle={false}
      />
      {query.isError ? (
        <AppErrorState
          className="min-h-0 flex-1 items-center justify-center p-8 text-center"
          onRetry={() => void query.refetch()}
          title={t("reports.contractPrice.loadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 md:flex-1"
          columns={columns}
          data={data}
          emptyMessage={t("reports.contractPrice.empty")}
          initialPageSize={TABLE_PAGE_SIZE}
          isLoading={query.isLoading}
          minWidth={970}
          mobileCard={createMobileCard(t)}
          pagination={
            pagination
              ? {
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                  totalItems: pagination.totalItems,
                  onPageChange: setPage,
                  onPageSizeChange: setPageSize,
                }
              : undefined
          }
        />
      )}
    </section>
  );
}
