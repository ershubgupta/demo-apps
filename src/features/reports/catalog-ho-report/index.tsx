"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { ConfigurableListFilters } from "@/components/filters/configurable-list-filters";
import { PageHeader } from "@/components/layout/page-header";
import { POLL_TIMEOUT_MS, TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { QUERY_KEYS } from "@/lib/query/query-keys";
import {
  getFiltersFromSearchParams,
  getPageFromSearchParams,
  getPageSizeFromSearchParams,
  updateUrlParams,
} from "@/lib/utils/urlParams";

import { catalogHoReportListQueryOptions } from "./api/queries";
import { generateCatalogHoReport } from "./api/service";
import { createCatalogHoReportMobileCard } from "./components/mobile-card";
import { createCatalogHoReportColumns } from "./components/table-columns";
import {
  createCatalogHoReportFilterFields,
  createCatalogHoReportFilterLabels,
  emptyCatalogHoReportFilters,
  type CatalogHoReportFilters,
} from "./config/filters";
import type { CatalogHoReportListParams, CatalogHoReportRow } from "./types";
import {
  getActiveFilters,
  getFilterUpdates,
  useReportPolling,
} from "../shared/page-utils";
import { hasPendingReportJobs } from "../shared/utils";

export { catalogHoReportFilterFields } from "./config/filters";
export { createCatalogHoReportColumns } from "./components/table-columns";

export function CatalogHoReportPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pollUntil, setPollUntil] = useState<number | null>(null);
  const t = useTranslations();
  const page = getPageFromSearchParams(searchParams);
  const pageSize = getPageSizeFromSearchParams(searchParams);
  const filters = getFiltersFromSearchParams(
    searchParams,
    emptyCatalogHoReportFilters
  ) as CatalogHoReportFilters;
  const params = useMemo<CatalogHoReportListParams>(
    () => ({
      catalogNumber: filters.catalogNumber || undefined,
      catalogRevision: filters.catalogRevision
        ? Number(filters.catalogRevision)
        : undefined,
      catalogStatus: filters.catalogStatus || undefined,
      catalogType: filters.catalogType || undefined,
      priceStartDate: filters.priceStartDate || undefined,
      priceEndDate: filters.priceEndDate || undefined,
      page,
      pageSize,
    }),
    [filters, page, pageSize]
  );
  const query = useQuery(catalogHoReportListQueryOptions(params));
  const data = query.data?.items ?? [];
  const pagination = query.data?.pagination;
  const mutation = useMutation({
    mutationFn: generateCatalogHoReport,
    onSuccess: async () => {
      setPollUntil(Date.now() + POLL_TIMEOUT_MS);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reports.catalogHo.all,
      });
    },
    onError: (error) =>
      toast.error(t("reports.catalogHo.errors.generationFailed"), {
        description: error instanceof Error ? error.message : undefined,
      }),
  });
  const generate = useCallback(
    (row: CatalogHoReportRow, variant: "item" | "itemCustomer") =>
      mutation.mutate({ rowId: row.id, variant }),
    [mutation]
  );
  useReportPolling({
    hasPending: data.some((row) =>
      hasPendingReportJobs([row.itemReport, row.itemCustomerReport])
    ),
    pollUntil,
    setPollUntil,
    refetch: () => void query.refetch(),
  });
  const columns = useMemo(
    () => createCatalogHoReportColumns(generate, t),
    [generate, t]
  );
  const mobileCard = useMemo(
    () => createCatalogHoReportMobileCard(generate, t),
    [generate, t]
  );
  const filterFields = useMemo(() => createCatalogHoReportFilterFields(t), [t]);
  const filterLabels = useMemo(() => createCatalogHoReportFilterLabels(t), [t]);
  const setFilter = (name: keyof CatalogHoReportFilters, value: string) =>
    updateUrlParams<CatalogHoReportFilters>(router, pathname, searchParams, {
      [name]: value,
      page: null,
    });
  const applyFilters = (next: CatalogHoReportFilters) =>
    updateUrlParams<CatalogHoReportFilters>(router, pathname, searchParams, {
      ...getFilterUpdates(emptyCatalogHoReportFilters, next),
      page: null,
    });
  const setPage = (nextPage: number) =>
    updateUrlParams<CatalogHoReportFilters>(router, pathname, searchParams, {
      page: nextPage > 1 ? String(nextPage) : null,
    });
  const setPageSize = (nextPageSize: number) =>
    updateUrlParams<CatalogHoReportFilters>(router, pathname, searchParams, {
      page: null,
      pageSize: nextPageSize === TABLE_PAGE_SIZE ? null : nextPageSize,
    });

  return (
    <section className="flex min-h-0 flex-col gap-4 md:h-full">
      <PageHeader
        title={t("reports.catalogHo.title")}
        subtitle={t("reports.catalogHo.subtitle")}
      />
      <ConfigurableListFilters
        activeFilters={getActiveFilters(filters, filterLabels)}
        emptyFilters={emptyCatalogHoReportFilters}
        fields={filterFields}
        filters={filters}
        onApplyFilters={applyFilters}
        onChange={setFilter}
        onReset={() => router.replace(pathname, { scroll: false })}
        primaryGridClassName="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(6,minmax(0,1fr))_auto]"
        showMoreToggle={false}
      />
      {query.isError ? (
        <AppErrorState
          className="min-h-0 flex-1 items-center justify-center p-8 text-center"
          onRetry={() => void query.refetch()}
          title={t("reports.catalogHo.errors.loadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 md:flex-1"
          columns={columns}
          data={data}
          emptyMessage={t("reports.catalogHo.empty")}
          initialPageSize={TABLE_PAGE_SIZE}
          isLoading={query.isLoading}
          minWidth={1680}
          mobileCard={mobileCard}
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
