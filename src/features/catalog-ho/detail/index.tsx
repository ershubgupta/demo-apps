"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppErrorState } from "@/components/error-state";
import { DetailPageLayout } from "@/components/layout/detail-page-layout";
import { MobileHeader } from "@/components/mobile-header";
import { Tabs } from "@/components/tabs/tabs";
import { catalogDetailQueryOptions } from "@/features/catalog-ho/api/queries";
import { useTranslations } from "next-intl";
import { DetailTabActions } from "./components/tab-actions";
import {
  DEFAULT_TAB,
  TABS,
  getTabs,
  type DetailTab,
  tabId,
  tabPanelId,
} from "./config/tabs";
import { DeleteAllConfirmation } from "./components/dialogs/delete-all-confirmation";
import { CustomerDrawer } from "./components/drawers/customer-drawer";
import { ExportItemPriceMasterDrawer } from "./components/drawers/export-item-price-master-drawer";
import { ItemDrawer } from "./components/drawers/item-drawer";
import { CustomersPanel } from "./components/panels/customers-panel";
import { ItemsPanel } from "./components/panels/items-panel";
import { SummaryPanel } from "./components/panels/summary-panel";
import { canEditCatalog } from "./utils/permissions";
import type { CatalogItem } from "@/features/catalog-ho/types";

import { getTabFromSearchParams, updateUrlParams } from "@/lib/utils/urlParams";
import { parseDate } from "@/lib/utils/date-format";

type ItemDrawerState =
  { mode: "add" } | { mode: "edit"; item: CatalogItem } | null;

export function DetailPage({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getTabFromSearchParams(searchParams, TABS, DEFAULT_TAB);
  const [itemDrawerState, setItemDrawerState] = useState<ItemDrawerState>(null);
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
  const [exportItemPriceMasterOpen, setExportItemPriceMasterOpen] =
    useState(false);
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [customerDeleteAllConfirmOpen, setCustomerDeleteAllConfirmOpen] =
    useState(false);
  const [draftPeriodRange, setDraftPeriodRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [periodError, setPeriodError] = useState<string>();
  const [itemSelectedCount, setItemSelectedCount] = useState(0);
  const [customerSelectedCount, setCustomerSelectedCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [deleteSelectedItems, setDeleteSelectedItems] = useState<
    (() => void) | null
  >(null);
  const [deleteSelectedCustomers, setDeleteSelectedCustomers] = useState<
    (() => void) | null
  >(null);

  const queryClient = useQueryClient();
  const detailQuery = useQuery(catalogDetailQueryOptions(id));
  const catalog = detailQuery.data ?? null;
  const canEdit = catalog ? canEditCatalog(catalog.status) : false;
  const isCatalogDirty = Boolean(
    catalog &&
    draftPeriodRange &&
    (draftPeriodRange.start !== catalog.periodStart ||
      draftPeriodRange.end !== catalog.periodEnd)
  );
  const displayCatalog =
    catalog && draftPeriodRange
      ? {
          ...catalog,
          periodStart: draftPeriodRange.start,
          periodEnd: draftPeriodRange.end,
        }
      : catalog;
  const setTab = (tab: DetailTab) => {
    updateUrlParams<{ tab: string }>(router, pathname, searchParams, {
      tab: tab === "items" ? null : tab,
    });
  };

  const handleItemSelectedDeleteActionChange = useCallback(
    (count: number, onDeleteSelected: (() => void) | null) => {
      setItemSelectedCount(count);
      setDeleteSelectedItems(() => onDeleteSelected);
    },
    []
  );

  const handleCustomerSelectedDeleteActionChange = useCallback(
    (count: number, onDeleteSelected: (() => void) | null) => {
      setCustomerSelectedCount(count);
      setDeleteSelectedCustomers(() => onDeleteSelected);
    },
    []
  );

  const handlePeriodChange = (range: { start: string; end: string }) => {
    setDraftPeriodRange(range);
    setPeriodError(undefined);
  };

  const handleUpdate = () => {
    if (!catalog || !draftPeriodRange) return;

    if (!draftPeriodRange.start || !draftPeriodRange.end) {
      setPeriodError(t("details.catalog.updatePeriodRequired"));
      return;
    }

    const periodEnd = parseDate(draftPeriodRange.end);
    if (periodEnd) {
      const lastDay = new Date(
        periodEnd.getFullYear(),
        periodEnd.getMonth() + 1,
        0
      );
      if (periodEnd.getDate() !== lastDay.getDate()) {
        setPeriodError(t("details.catalog.updatePeriodMonthEnd"));
        return;
      }
    }

    setPeriodError(undefined);
    queryClient.setQueryData(
      catalogDetailQueryOptions(id).queryKey,
      (previous) =>
        previous
          ? {
              ...previous,
              periodStart: draftPeriodRange.start,
              periodEnd: draftPeriodRange.end,
            }
          : previous
    );
    setDraftPeriodRange(null);
    toast.success(t("details.catalog.updated"), {
      description: t("details.catalog.updatedDescription"),
    });
  };

  const handleExport = async () => {
    if (!catalog || exporting) return;
    setExporting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setExporting(false);
    toast.success(t("details.catalog.exportComplete"), {
      description: t("details.catalog.exportedDescription", {
        number: catalog.number,
      }),
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
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
        <>
          <DetailPageLayout
            header={
              <MobileHeader
                pageTitle={catalog.number}
                backAriaLabel={t("details.catalog.backToCatalogHoAria")}
                backHref="/catalog-ho"
              />
            }
            summary={
              <SummaryPanel
                catalog={displayCatalog ?? catalog}
                canEdit={canEdit}
                isDirty={isCatalogDirty}
                periodError={periodError}
                onPeriodChange={handlePeriodChange}
                onUpdate={handleUpdate}
              />
            }
            toolbar={
              <Tabs
                active={activeTab}
                actions={
                  activeTab === "items" ? (
                    <DetailTabActions
                      catalogId={catalog.id}
                      catalogStatus={catalog.status}
                      tab="items"
                      isExporting={exporting}
                      selectedCount={itemSelectedCount}
                      onDeleteSelected={deleteSelectedItems}
                      onExport={handleExport}
                      onAddItem={() => {
                        setItemDrawerState({ mode: "add" });
                        setItemDrawerOpen(true);
                      }}
                      onExportItemPriceMaster={() =>
                        setExportItemPriceMasterOpen(true)
                      }
                      onDeleteAll={() => setDeleteAllConfirmOpen(true)}
                    />
                  ) : (
                    <DetailTabActions
                      catalogId={catalog.id}
                      catalogStatus={catalog.status}
                      tab="customers"
                      isExporting={exporting}
                      selectedCount={customerSelectedCount}
                      onDeleteSelected={deleteSelectedCustomers}
                      onExport={handleExport}
                      ariaLabel={t("details.catalog.customerActionsAria")}
                      onActionSelect={(action) => {
                        if (action === "Add new customer") {
                          setCustomerDrawerOpen(true);
                        }
                        if (action === "Delete all") {
                          setCustomerDeleteAllConfirmOpen(true);
                        }
                      }}
                    />
                  )
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
            <section
              className="flex min-h-0 flex-1 flex-col"
              role="tabpanel"
              id={tabPanelId(activeTab)}
              aria-labelledby={tabId(activeTab)}
            >
              {activeTab === "items" ? (
                <ItemsPanel
                  catalogId={catalog.id}
                  onEditItem={(item) => {
                    setItemDrawerState({ mode: "edit", item });
                    setItemDrawerOpen(true);
                  }}
                  onSelectedDeleteActionChange={
                    handleItemSelectedDeleteActionChange
                  }
                />
              ) : (
                <CustomersPanel
                  catalogId={catalog.id}
                  customers={catalog.customers}
                  onSelectedDeleteActionChange={
                    handleCustomerSelectedDeleteActionChange
                  }
                />
              )}
            </section>
          </DetailPageLayout>

          <ItemDrawer
            mode={itemDrawerState?.mode ?? "edit"}
            item={
              itemDrawerState?.mode === "edit" ? itemDrawerState.item : null
            }
            open={itemDrawerOpen}
            onOpenChange={setItemDrawerOpen}
            canEdit={canEdit}
          />

          <ExportItemPriceMasterDrawer
            open={exportItemPriceMasterOpen}
            onOpenChange={setExportItemPriceMasterOpen}
          />

          <DeleteAllConfirmation
            catalogId={catalog.id}
            open={deleteAllConfirmOpen}
            onOpenChange={setDeleteAllConfirmOpen}
            target="items"
          />

          <CustomerDrawer
            open={customerDrawerOpen}
            onOpenChange={setCustomerDrawerOpen}
            canEdit={canEdit}
          />

          <DeleteAllConfirmation
            catalogId={catalog.id}
            open={customerDeleteAllConfirmOpen}
            onOpenChange={setCustomerDeleteAllConfirmOpen}
            target="customers"
          />
        </>
      )}
    </section>
  );
}
