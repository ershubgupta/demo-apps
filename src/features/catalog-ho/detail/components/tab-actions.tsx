"use client";

import { TabActions } from "@/components/tabs/tab-actions";
import { DetailActionsMenu } from "./actions-menu";
import { ACTIONS_BY_TAB_AND_STATUS } from "../config/actions";
import type { DetailTab } from "../config/tabs";
import { StatusEnum, type CatalogStatus } from "@/features/catalog-ho/types";
import { useTranslations } from "next-intl";

type DetailTabActionsProps = {
  catalogId: string;
  catalogStatus: CatalogStatus;
  tab: DetailTab;
  onAddItem?: () => void;
  onExportItemPriceMaster?: () => void;
  onDeleteAll?: () => void;
  onExport?: () => void;
  isExporting?: boolean;
  selectedCount?: number;
  onDeleteSelected?: (() => void) | null;
  ariaLabel?: string;
  onActionSelect?: (action: string) => void;
};

export function DetailTabActions({
  catalogId,
  catalogStatus,
  tab,
  onAddItem,
  onExportItemPriceMaster,
  onDeleteAll,
  onExport,
  isExporting = false,
  selectedCount = 0,
  onDeleteSelected,
  ariaLabel,
  onActionSelect,
}: DetailTabActionsProps) {
  const t = useTranslations();
  const menuActions = ACTIONS_BY_TAB_AND_STATUS[tab][catalogStatus].filter(
    (action) => action !== "Export Item Price Master" || onExportItemPriceMaster
  );
  // Only add the mobile "Export all" entry when there are other actions to
  // show; otherwise the overflow menu would render with a single item that's
  // hidden on desktop, making the "..." button appear but open empty.
  if (menuActions.length > 0 && catalogStatus !== StatusEnum.Expired) {
    const deleteAllIndex = menuActions.indexOf("Delete all");
    menuActions.splice(
      deleteAllIndex >= 0 ? deleteAllIndex : menuActions.length,
      0,
      "Export all"
    );
  }

  return (
    <TabActions
      actionsMenu={
        <DetailActionsMenu
          additionalActions={menuActions}
          ariaLabel={ariaLabel ?? t("details.actions.catalogItemActionsAria")}
          catalogId={catalogId}
          excludeActions={[
            "Edit",
            "Clone",
            "Inactive EOD",
            "Inactive immediate",
          ]}
          onAdditionalActionSelect={(action) => {
            if (action === "Export all") {
              onExport?.();
              return;
            }
            if (onActionSelect) {
              onActionSelect(action);
              return;
            }
            if (action === "Add new item") onAddItem?.();
            if (action === "Export Item Price Master") {
              onExportItemPriceMaster?.();
            }
            if (action === "Delete all") onDeleteAll?.();
          }}
          status={catalogStatus}
          uploadActions={{
            "Import Item Price with Update": {
              title: t("details.actions.importCatalogItemPriceList"),
              onUpload: async () => {
                await new Promise((resolve) => window.setTimeout(resolve, 900));
              },
            },
            "Import Customer": {
              title: t("details.actions.importCustomer"),
              onUpload: async () => {
                await new Promise((resolve) => window.setTimeout(resolve, 900));
              },
            },
            "Import Customer with Update": {
              title: t("details.actions.importCustomerWithUpdate"),
              onUpload: async () => {
                await new Promise((resolve) => window.setTimeout(resolve, 900));
              },
            },
          }}
        />
      }
      isExporting={isExporting}
      onDeleteSelected={onDeleteSelected}
      onExport={onExport}
      selectedCount={selectedCount}
    />
  );
}
