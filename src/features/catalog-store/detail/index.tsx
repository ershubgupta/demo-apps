"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppErrorState } from "@/components/error-state";
import { useTranslations } from "next-intl";
import { DetailPageLayout } from "@/components/layout/detail-page-layout";
import { MobileHeader } from "@/components/mobile-header";
import { TabActions } from "@/components/tabs/tab-actions";
import { Tabs } from "@/components/tabs/tabs";
import { catalogStoreDetailQueryOptions } from "@/features/catalog-store/api/queries";
import { useDetailMoreFilters } from "./components/detail-more-filters";
import { CustomersPanel } from "./components/panels/customers-panel";
import { ItemsPanel } from "./components/panels/items-panel";
import { SummaryPanel } from "./components/panels/summary-panel";
import {
  DEFAULT_TAB,
  TABS,
  getTabs,
  type DetailTab,
  tabId,
  tabPanelId,
} from "./config/tabs";
import {
  emptyCatalogStoreDetailFilters,
  getActiveCatalogStoreDetailFilters,
  type CatalogStoreDetailFiltersState,
} from "./config/filter-types";
import {
  getFiltersFromSearchParams,
  getTabFromSearchParams,
  updateUrlParams,
} from "@/lib/utils/urlParams";

export function DetailPage({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getTabFromSearchParams(searchParams, TABS, DEFAULT_TAB);
  const filters = getFiltersFromSearchParams(
    searchParams,
    emptyCatalogStoreDetailFilters
  );
  const [exporting, setExporting] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const detailQuery = useQuery(catalogStoreDetailQueryOptions(id));
  const catalog = detailQuery.data ?? null;
  const activeFilters = getActiveCatalogStoreDetailFilters(
    filters,
    activeTab,
    t
  );

  const setTab = (tab: DetailTab) => {
    updateUrlParams<{ tab: string }>(router, pathname, searchParams, {
      tab: tab === "items" ? null : tab,
    });
  };

  const setFilter = useCallback(
    (name: keyof CatalogStoreDetailFiltersState, value: string) => {
      updateUrlParams<CatalogStoreDetailFiltersState>(
        router,
        pathname,
        searchParams,
        {
          [name]: value || null,
        }
      );
    },
    [pathname, router, searchParams]
  );

  const applyFilters = useCallback(
    (nextFilters: CatalogStoreDetailFiltersState) => {
      if (activeTab === "customers") {
        updateUrlParams<CatalogStoreDetailFiltersState>(
          router,
          pathname,
          searchParams,
          {
            tier: nextFilters.tier || null,
            cvCode: nextFilters.cvCode || null,
            mmid: nextFilters.mmid || null,
            customerName: nextFilters.customerName || null,
          }
        );
        return;
      }

      updateUrlParams<CatalogStoreDetailFiltersState>(
        router,
        pathname,
        searchParams,
        {
          tier: nextFilters.tier || null,
          itemNo: nextFilters.itemNo || null,
          itemDescription: nextFilters.itemDescription || null,
        }
      );
    },
    [activeTab, pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    if (activeTab === "customers") {
      updateUrlParams<CatalogStoreDetailFiltersState>(
        router,
        pathname,
        searchParams,
        {
          tier: null,
          cvCode: null,
          mmid: null,
          customerName: null,
        }
      );
      return;
    }

    updateUrlParams<CatalogStoreDetailFiltersState>(
      router,
      pathname,
      searchParams,
      {
        tier: null,
        itemNo: null,
        itemDescription: null,
      }
    );
  }, [activeTab, pathname, router, searchParams]);

  const { toolbarTrigger, desktopPanel, mobileShell } = useDetailMoreFilters({
    activeFilters,
    activeTab,
    filters,
    onApplyFilters: applyFilters,
    onChange: setFilter,
    onReset: resetFilters,
    showMoreFilters,
    onShowMoreFiltersChange: setShowMoreFilters,
  });

  const handleExport = async () => {
    if (!catalog || exporting) return;
    setExporting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setExporting(false);
    toast.success(t("details.export.complete"), {
      description: t("details.export.catalogExported", {
        catalog: catalog.number,
      }),
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      {mobileShell}
      {detailQuery.isError ? (
        <AppErrorState
          onRetry={() => {
            void detailQuery.refetch();
          }}
          title={t("details.catalog.loadFailed")}
        />
      ) : detailQuery.isLoading || !catalog ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t("details.catalog.loading")}
        </div>
      ) : (
        <DetailPageLayout
          header={
            <MobileHeader
              backAriaLabel={t("details.catalog.backToCatalogStoreAria")}
              backHref="/catalog-store"
              pageTitle={catalog.number}
            />
          }
          summary={<SummaryPanel catalog={catalog} />}
          toolbar={
            <Tabs
              active={activeTab}
              actions={
                <TabActions
                  exportLabel={t("common.actions.export")}
                  isExporting={exporting}
                  leadingActions={toolbarTrigger}
                  onExport={handleExport}
                />
              }
              getTabId={tabId}
              onChange={setTab}
              tabs={getTabs({
                itemCount: catalog.totalItems,
                customerCount: catalog.customers.length,
                t,
              })}
            />
          }
        >
          {desktopPanel}
          <section
            className="flex min-h-0 flex-1 flex-col"
            role="tabpanel"
            id={tabPanelId(activeTab)}
            aria-labelledby={tabId(activeTab)}
          >
            {activeTab === "items" ? (
              <ItemsPanel
                catalogId={catalog.id}
                itemDescription={filters.itemDescription}
                itemNo={filters.itemNo}
                tier={filters.tier}
              />
            ) : (
              <CustomersPanel
                customers={catalog.customers}
                cvCode={filters.cvCode}
                customerName={filters.customerName}
                isLoading={detailQuery.isLoading}
                mmid={filters.mmid}
                tier={filters.tier}
              />
            )}
          </section>
        </DetailPageLayout>
      )}
    </section>
  );
}
