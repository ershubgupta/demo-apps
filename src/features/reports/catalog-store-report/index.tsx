"use client";

import { useCallback, useMemo, useState } from "react";
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
import { catalogStoreReportListQueryOptions } from "./api/queries";
import { generateCatalogStoreReport } from "./api/service";
import { createCatalogStoreReportMobileCard } from "./components/mobile-card";
import { createCatalogStoreReportColumns } from "./components/table-columns";
import {
  createCatalogStoreReportFilterFields,
  createCatalogStoreReportFilterLabels,
  emptyCatalogStoreReportFilters,
  type CatalogStoreReportFilters,
} from "./config/filters";
import type {
  CatalogStoreReportListParams,
  CatalogStoreReportRow,
} from "./types";
import {
  getActiveFilters,
  getFilterUpdates,
  useReportPolling,
} from "../shared/page-utils";
import { hasPendingReportJobs } from "../shared/utils";
export { catalogStoreReportFilterFields } from "./config/filters";
export { createCatalogStoreReportColumns } from "./components/table-columns";
export function CatalogStoreReportPage() {
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
    emptyCatalogStoreReportFilters
  ) as CatalogStoreReportFilters;
  const params = useMemo<CatalogStoreReportListParams>(
    () => ({
      reportNo: filters.reportNo || undefined,
      reportCreatedDate: filters.reportCreatedDate || undefined,
      catalogNumber: filters.catalogNumber || undefined,
      catalogType: filters.catalogType || undefined,
      priceStartDate: filters.priceStartDate || undefined,
      priceEndDate: filters.priceEndDate || undefined,
      page,
      pageSize,
    }),
    [filters, page, pageSize]
  );
  const query = useQuery(catalogStoreReportListQueryOptions(params));
  const data = query.data?.items ?? [];
  const pagination = query.data?.pagination;
  const mutation = useMutation({
    mutationFn: generateCatalogStoreReport,
    onSuccess: async () => {
      setPollUntil(Date.now() + POLL_TIMEOUT_MS);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reports.catalogStore.all,
      });
    },
    onError: (error) =>
      toast.error(t("reports.catalogStore.generationFailed"), {
        description: error instanceof Error ? error.message : undefined,
      }),
  });
  const generateItem = useCallback(
    (row: CatalogStoreReportRow) =>
      mutation.mutate({ rowId: row.id, variant: "storeItem" }),
    [mutation]
  );
  const generateFull = () => mutation.mutate({ variant: "fullStore" });
  useReportPolling({
    hasPending: data.some((row) =>
      hasPendingReportJobs([row.itemReport, row.fullReport])
    ),
    pollUntil,
    setPollUntil,
    refetch: () => void query.refetch(),
  });
  const columns = useMemo(
    () => createCatalogStoreReportColumns(generateItem, t),
    [generateItem, t]
  );
  const mobileCard = useMemo(
    () => createCatalogStoreReportMobileCard(generateItem, t),
    [generateItem, t]
  );
  const filterFields = useMemo(
    () => createCatalogStoreReportFilterFields(t),
    [t]
  );
  const filterLabels = useMemo(
    () => createCatalogStoreReportFilterLabels(t),
    [t]
  );
  const setFilter = (name: keyof CatalogStoreReportFilters, value: string) =>
    updateUrlParams<CatalogStoreReportFilters>(router, pathname, searchParams, {
      [name]: value,
      page: null,
    });
  const applyFilters = (next: CatalogStoreReportFilters) =>
    updateUrlParams<CatalogStoreReportFilters>(router, pathname, searchParams, {
      ...getFilterUpdates(emptyCatalogStoreReportFilters, next),
      page: null,
    });
  const setPage = (nextPage: number) =>
    updateUrlParams<CatalogStoreReportFilters>(router, pathname, searchParams, {
      page: nextPage > 1 ? String(nextPage) : null,
    });
  const setPageSize = (nextPageSize: number) =>
    updateUrlParams<CatalogStoreReportFilters>(router, pathname, searchParams, {
      page: null,
      pageSize: nextPageSize === TABLE_PAGE_SIZE ? null : nextPageSize,
    });
  return (
    <section className="flex min-h-0 flex-col gap-4 md:h-full">
      <PageHeader
        title={t("reports.catalogStore.title")}
        subtitle={t("reports.catalogStore.subtitle")}
        actions={
          <Button
            className="hidden h-9 rounded-lg px-3 text-xs font-semibold sm:px-4 md:inline-flex"
            disabled={mutation.isPending}
            onClick={generateFull}
            type="button"
          >
            <PlayCircle className="h-4 w-4" />
            {t("reports.catalogStore.fullReport")}
          </Button>
        }
      />
      <ConfigurableListFilters
        activeFilters={getActiveFilters(filters, filterLabels)}
        emptyFilters={emptyCatalogStoreReportFilters}
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
          title={t("reports.catalogStore.loadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 md:flex-1"
          columns={columns}
          data={data}
          emptyMessage={t("reports.catalogStore.empty")}
          initialPageSize={TABLE_PAGE_SIZE}
          isLoading={query.isLoading}
          minWidth={1320}
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
