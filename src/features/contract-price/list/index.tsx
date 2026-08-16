"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { contractPriceListQueryOptions } from "@/features/contract-price/api/queries";
import {
  type ContractPriceFiltersState,
  emptyContractPriceFilters,
  toContractPriceSearchParams,
} from "./config/filter-types";
import { ContractPriceFilters } from "./components/filters";
import { createContractPriceMobileCard } from "./components/mobile-card";
import { createContractPriceColumns } from "./components/table-columns";
import type { ContractPriceListParams } from "@/features/contract-price/types";
import {
  getFiltersFromSearchParams,
  getPageFromSearchParams,
  getPageSizeFromSearchParams,
  updateUrlParams,
} from "@/lib/utils/urlParams";
import { CreateNewContractDrawer } from "../components/create-contract-price/drawer";

export function ContractPriceListPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = getPageFromSearchParams(searchParams);
  const pageSize = getPageSizeFromSearchParams(searchParams);
  const filters = getFiltersFromSearchParams(
    searchParams,
    emptyContractPriceFilters
  );

  const queryParams = useMemo<ContractPriceListParams>(
    () => ({
      ...toContractPriceSearchParams(filters),
      page,
      pageSize,
    }),
    [filters, page, pageSize]
  );
  const query = useQuery(contractPriceListQueryOptions(queryParams));
  const data = query.data?.items ?? [];
  const pagination = query.data?.pagination;

  const setFilter = (name: keyof ContractPriceFiltersState, value: string) => {
    updateUrlParams<ContractPriceFiltersState>(router, pathname, searchParams, {
      [name]: value,
      page: null,
    });
  };

  const applyFilters = (nextFilters: ContractPriceFiltersState) => {
    const updates = Object.fromEntries(
      (
        Object.keys(
          emptyContractPriceFilters
        ) as (keyof ContractPriceFiltersState)[]
      ).map((key) => [key, nextFilters[key] || null])
    ) as Partial<Record<keyof ContractPriceFiltersState, string | null>>;

    updateUrlParams<ContractPriceFiltersState>(router, pathname, searchParams, {
      ...updates,
      page: null,
    });
  };

  const resetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const setPage = (nextPage: number) => {
    updateUrlParams<ContractPriceFiltersState>(router, pathname, searchParams, {
      page: nextPage > 1 ? String(nextPage) : null,
    });
  };

  const setPageSize = (nextPageSize: number) => {
    updateUrlParams<ContractPriceFiltersState>(router, pathname, searchParams, {
      page: null,
      pageSize: nextPageSize === TABLE_PAGE_SIZE ? null : nextPageSize,
    });
  };

  const columns = useMemo(() => createContractPriceColumns(t), [t]);
  const mobileCard = useMemo(() => createContractPriceMobileCard(t), [t]);

  return (
    <section className="flex min-h-0 flex-col gap-4 md:h-full">
      <PageHeader
        actions={
          <div className="hidden items-center justify-end gap-2 md:flex">
            <CreateNewContractDrawer>
              <Button
                className="h-9 rounded-lg px-3 text-xs font-semibold sm:px-4"
                type="button"
              >
                <Plus className="h-4 w-4" />
                {t("common.actions.createContractPrice")}
              </Button>
            </CreateNewContractDrawer>
          </div>
        }
        subtitle={t("pages.contractPrice.subtitle")}
        title={t("pages.contractPrice.title")}
      />

      <ContractPriceFilters
        filters={filters}
        onApplyFilters={applyFilters}
        onChange={setFilter}
        onReset={resetFilters}
      />

      {query.isError ? (
        <AppErrorState
          className="min-h-0 flex-1 items-center justify-center p-8 text-center"
          onRetry={() => {
            void query.refetch();
          }}
          title={t("pages.contractPrice.loadFailed")}
        />
      ) : (
        <DataTable
          className="min-h-0 md:flex-1"
          columns={columns}
          data={data}
          emptyMessage={t("pages.contractPrice.empty")}
          initialPageSize={TABLE_PAGE_SIZE}
          isLoading={query.isLoading}
          minWidth={1400}
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

      <div className="fixed bottom-24 right-5 z-40 md:hidden">
        <CreateNewContractDrawer>
          <Button
            aria-label={t("pages.contractPrice.createNewAria")}
            className="h-12 w-12 rounded-full shadow-lg"
            size="icon"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </CreateNewContractDrawer>
      </div>
    </section>
  );
}
