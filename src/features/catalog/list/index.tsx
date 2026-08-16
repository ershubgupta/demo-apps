"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
import { TABLE_PAGE_SIZE } from "@/constant";
import { useTranslations } from "next-intl";
import { catalogListQueryOptions } from "@/features/catalog-ho/api/queries";
import { AddNewCatalogDrawer } from "@/features/catalog/list/components/create-catalog";
import { getDestructiveActionConfirmation } from "@/features/catalog/list/components/confirmations";
import {
  type CatalogFiltersState,
  catalogStatusOptions,
  emptyCatalogFilters,
  toCatalogSearchParams,
} from "@/features/catalog/list/config/filter-types";
import { CatalogFilters } from "@/features/catalog/list/components/filters";
import { mobileCard } from "@/features/catalog/list/components/mobile-card";
import type { RowAction } from "@/features/catalog/list/components/row-actions";
import { createCatalogColumns } from "@/features/catalog/list/components/table-columns";
import { catalogStatusAccentClassName } from "@/features/catalog-ho/config/status-config";
import type { Catalog, CatalogListParams } from "@/features/catalog-ho/types";
import {
  getFiltersFromSearchParams,
  getPageFromSearchParams,
  getPageSizeFromSearchParams,
  updateUrlParams,
} from "@/lib/utils/urlParams";
import { CloneCatalogDrawer } from "@/features/catalog/list/components/clone-catalog";
import {
  catalogListPageConfigs,
  type CatalogListPageConfig,
} from "./config/page-config";

type PendingDestructiveAction = {
  action: Exclude<RowAction, "Clone">;
  catalog: Catalog;
};

export function CatalogListPage({
  config = catalogListPageConfigs.catalogHo,
}: {
  config?: CatalogListPageConfig;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [openActionRowId, setOpenActionRowId] = useState<string | null>(null);
  const [cloneCatalog, setCloneCatalog] = useState<Catalog | null>(null);
  const [pendingDestructiveAction, setPendingDestructiveAction] =
    useState<PendingDestructiveAction | null>(null);
  const page = getPageFromSearchParams(searchParams);
  const pageSize = getPageSizeFromSearchParams(searchParams);
  const filters = getFiltersFromSearchParams(
    searchParams,
    emptyCatalogFilters,
    {
      catalogType: (value) =>
        config.showCatalogTypeFilter &&
        config.fixedCatalogTypes.includes(
          value as (typeof config.fixedCatalogTypes)[number]
        ),
      status: (value) =>
        catalogStatusOptions.some((option) => option.value === value),
    }
  );

  const queryParams = useMemo<CatalogListParams>(
    () => ({
      ...toCatalogSearchParams(filters, config.fixedCatalogTypes),
      page,
      pageSize,
    }),
    [config.fixedCatalogTypes, filters, page, pageSize]
  );
  const query = useQuery(catalogListQueryOptions(queryParams));
  const data = query.data?.items ?? [];
  const pagination = query.data?.pagination;
  const destructiveConfirmation = pendingDestructiveAction
    ? getDestructiveActionConfirmation(
        pendingDestructiveAction.action,
        pendingDestructiveAction.catalog
      )
    : null;

  const setFilter = (name: keyof CatalogFiltersState, value: string) => {
    updateUrlParams<CatalogFiltersState>(router, pathname, searchParams, {
      [name]: value,
      page: null,
    });
  };

  const applyFilters = (nextFilters: CatalogFiltersState) => {
    const updates = Object.fromEntries(
      (Object.keys(emptyCatalogFilters) as (keyof CatalogFiltersState)[]).map(
        (key) => [key, nextFilters[key] || null]
      )
    ) as Partial<Record<keyof CatalogFiltersState, string | null>>;

    updateUrlParams<CatalogFiltersState>(router, pathname, searchParams, {
      ...updates,
      page: null,
    });
  };

  const resetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const setPage = (nextPage: number) => {
    updateUrlParams<CatalogFiltersState>(router, pathname, searchParams, {
      page: nextPage > 1 ? String(nextPage) : null,
    });
  };

  const setPageSize = (nextPageSize: number) => {
    updateUrlParams<CatalogFiltersState>(router, pathname, searchParams, {
      page: null,
      pageSize: nextPageSize === TABLE_PAGE_SIZE ? null : nextPageSize,
    });
  };

  const confirmDestructiveAction = () => {
    if (!destructiveConfirmation) return;
    toast.success(destructiveConfirmation.successTitle, {
      description: destructiveConfirmation.successDescription,
    });
    setPendingDestructiveAction(null);
  };

  const handleAction = (catalog: Catalog, action: RowAction) => {
    switch (action) {
      case "Clone":
        setCloneCatalog(catalog);
        break;

      case "Delete":
      case "Inactive EOD":
      case "Inactive immediate":
        setPendingDestructiveAction({ action, catalog });
        break;
    }
  };

  const columns = useMemo(
    () =>
      createCatalogColumns({
        config,
        openActionRowId,
        onActionOpenChange: (rowId, open) =>
          setOpenActionRowId((current) =>
            open ? rowId : current === rowId ? null : current
          ),
        onAction: handleAction,
        t,
      }),
    [config, openActionRowId, t]
  );

  return (
    <section className="flex min-h-0 flex-col gap-4 md:h-full">
      <PageHeader
        actions={
          <div className="hidden items-center justify-end gap-2 md:flex">
            <AddNewCatalogDrawer>
              <Button className="h-9 rounded-lg px-3 text-xs font-semibold sm:px-4">
                <Plus className="h-4 w-4" />
                {t("common.actions.createCatalog")}
              </Button>
            </AddNewCatalogDrawer>
            <CloneCatalogDrawer
              open={cloneCatalog !== null}
              catalog={cloneCatalog}
              onOpenChange={(open) => {
                if (!open) setCloneCatalog(null);
              }}
            >
              <span />
            </CloneCatalogDrawer>
          </div>
        }
        subtitle={t(config.subtitleKey)}
        title={t(config.titleKey)}
      />

      <CatalogFilters
        config={config}
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
          title={t(config.loadFailedKey)}
        />
      ) : (
        <DataTable
          className="min-h-0 md:flex-1"
          columns={columns}
          data={data}
          emptyMessage={t(config.emptyKey)}
          getRowAccentClassName={(row) =>
            catalogStatusAccentClassName(row.status)
          }
          initialPageSize={TABLE_PAGE_SIZE}
          isLoading={query.isLoading}
          minWidth={config.showCatalogTypeColumn ? 1280 : 1180}
          mobileCard={mobileCard({
            config,
            onAction: handleAction,
            t,
          })}
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
        <AddNewCatalogDrawer>
          <Button
            aria-label={t(config.createAriaKey)}
            className="h-12 w-12 rounded-full shadow-lg"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </AddNewCatalogDrawer>
      </div>

      <ConfirmationAlert
        confirmLabel={
          destructiveConfirmation?.confirmLabel ?? t("common.actions.confirm")
        }
        description={destructiveConfirmation?.description}
        onConfirm={confirmDestructiveAction}
        open={destructiveConfirmation !== null}
        title={destructiveConfirmation?.title}
        variant={destructiveConfirmation?.variant ?? "destructive"}
        onOpenChange={(open) => {
          if (!open) setPendingDestructiveAction(null);
        }}
      />
    </section>
  );
}
