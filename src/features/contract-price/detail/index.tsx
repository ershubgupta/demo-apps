"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FileDown, Plus } from "lucide-react";
import { toast } from "sonner";

import { ActionsMenu } from "@/components/actions-menu";
import { AppErrorState } from "@/components/error-state";
import { useTranslation } from "@/features/i18n";
import { DetailPageLayout } from "@/components/layout/detail-page-layout";
import { MobileHeader } from "@/components/mobile-header";
import { TabActions } from "@/components/tabs/tab-actions";
import { Tabs } from "@/components/tabs/tabs";
import { contractPriceDetailQueryOptions } from "@/features/contract-price/api/queries";
import { useDetailMoreFilters } from "./components/detail-more-filters";
import { ContractItemPanel } from "./components/panels/contract-item";
import { ContractPricePanel } from "./components/panels/contract-price";
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
  emptyContractPriceDetailFilters,
  getActiveContractPriceDetailFilters,
  type ContractPriceDetailFiltersState,
} from "./config/filter-types";
import {
  getFiltersFromSearchParams,
  getTabFromSearchParams,
  updateUrlParams,
} from "@/lib/utils/urlParams";

export function DetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getTabFromSearchParams(searchParams, TABS, DEFAULT_TAB);
  const filters = getFiltersFromSearchParams(
    searchParams,
    emptyContractPriceDetailFilters
  );
  const [exporting, setExporting] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const detailQuery = useQuery(contractPriceDetailQueryOptions(id));
  const contract = detailQuery.data ?? null;
  const activeFilters = getActiveContractPriceDetailFilters(
    filters,
    activeTab,
    t
  );

  const setTab = (tab: DetailTab) => {
    updateUrlParams<ContractPriceDetailFiltersState & { tab: string }>(
      router,
      pathname,
      searchParams,
      {
        tab: tab === DEFAULT_TAB ? null : tab,
        ...(tab !== "contractPrice"
          ? {
              startDate: null,
              endDate: null,
              status: null,
            }
          : {}),
        ...(tab !== "contractItem"
          ? {
              itemNo: null,
              itemDescription: null,
              salesAtShelfPrice: null,
              approvedPriceInVat: null,
            }
          : {}),
      }
    );
    setShowMoreFilters(false);
  };

  const setFilter = useCallback(
    (name: keyof ContractPriceDetailFiltersState, value: string) => {
      updateUrlParams<ContractPriceDetailFiltersState>(
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

  const setFilters = useCallback(
    (updates: Partial<ContractPriceDetailFiltersState>) => {
      const next: Partial<
        Record<keyof ContractPriceDetailFiltersState, string | null>
      > = {};
      (
        Object.keys(updates) as (keyof ContractPriceDetailFiltersState)[]
      ).forEach((key) => {
        const value = updates[key];
        if (value !== undefined) {
          next[key] = value || null;
        }
      });
      updateUrlParams<ContractPriceDetailFiltersState>(
        router,
        pathname,
        searchParams,
        next
      );
    },
    [pathname, router, searchParams]
  );

  const applyFilters = useCallback(
    (nextFilters: ContractPriceDetailFiltersState) => {
      updateUrlParams<ContractPriceDetailFiltersState>(
        router,
        pathname,
        searchParams,
        {
          startDate: nextFilters.startDate || null,
          endDate: nextFilters.endDate || null,
          status: nextFilters.status || null,
          itemNo: nextFilters.itemNo || null,
          itemDescription: nextFilters.itemDescription || null,
          salesAtShelfPrice: nextFilters.salesAtShelfPrice || null,
          approvedPriceInVat: nextFilters.approvedPriceInVat || null,
        }
      );
    },
    [pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    updateUrlParams<ContractPriceDetailFiltersState>(
      router,
      pathname,
      searchParams,
      {
        startDate: null,
        endDate: null,
        status: null,
        itemNo: null,
        itemDescription: null,
        salesAtShelfPrice: null,
        approvedPriceInVat: null,
      }
    );
  }, [pathname, router, searchParams]);

  const { toolbarTrigger, desktopPanel, mobileShell } = useDetailMoreFilters({
    activeFilters,
    activeTab,
    filters,
    onApplyFilters: applyFilters,
    onChange: setFilter,
    onChangeMany: setFilters,
    onReset: resetFilters,
    showMoreFilters,
    onShowMoreFiltersChange: setShowMoreFilters,
  });

  const handleExport = async () => {
    if (!contract || exporting) return;
    setExporting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setExporting(false);
    toast.success(t("details.export.complete"), {
      description: t("details.contractPrice.exportedDescription", {
        number: contract.number,
      }),
    });
  };

  const tabOverflowActions = useMemo(() => {
    if (activeTab === "contractPrice") {
      return [
        {
          icon: <Plus className="h-4 w-4" />,
          label: "Add new contract",
          onSelect: () => {
            toast.info("Add new contract is not available yet");
          },
        },
      ];
    }

    return [
      {
        icon: <FileDown className="h-4 w-4" />,
        label: "Download Image as PDF",
        onSelect: () => {
          toast.info("Download Image as PDF is not available yet");
        },
      },
    ];
  }, [activeTab]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      {mobileShell}
      {detailQuery.isError ? (
        <AppErrorState
          onRetry={() => {
            void detailQuery.refetch();
          }}
          title={t("details.contractPrice.loadFailed")}
        />
      ) : detailQuery.isLoading || !contract ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t("details.contractPrice.loading")}
        </div>
      ) : (
        <DetailPageLayout
          header={
            <MobileHeader
              backAriaLabel={t("details.contractPrice.backToOverviewAria")}
              backHref="/contract-price"
              pageTitle={contract.number}
            />
          }
          summary={<SummaryPanel contract={contract} />}
          toolbar={
            <Tabs
              active={activeTab}
              actions={
                <TabActions
                  actionsMenu={
                    <ActionsMenu
                      actions={tabOverflowActions}
                      ariaLabel={t("common.fields.actions")}
                      contentClassName="min-w-52"
                    />
                  }
                  exportLabel={t("common.actions.export")}
                  isExporting={exporting}
                  leadingActions={toolbarTrigger}
                  onExport={handleExport}
                />
              }
              getTabId={tabId}
              onChange={setTab}
              tabs={getTabs({
                periodCount: contract.totalPeriods,
                itemCount: contract.totalItems,
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
            {activeTab === "contractPrice" ? (
              <ContractPricePanel
                contractId={contract.id}
                endDate={filters.endDate}
                startDate={filters.startDate}
                status={filters.status}
              />
            ) : (
              <ContractItemPanel
                approvedPriceInVat={filters.approvedPriceInVat}
                contractId={contract.id}
                itemDescription={filters.itemDescription}
                itemNo={filters.itemNo}
                salesAtShelfPrice={filters.salesAtShelfPrice}
              />
            )}
          </section>
        </DetailPageLayout>
      )}
    </section>
  );
}
