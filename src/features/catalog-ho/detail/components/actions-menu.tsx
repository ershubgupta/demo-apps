"use client";

import { useRouter } from "next/navigation";
import {
  CircleSlash,
  Copy,
  Download,
  Edit,
  FileUp,
  Plus,
  Trash2,
} from "lucide-react";

import { ActionsMenu, type ActionMenuItem } from "@/components/actions-menu";
import { StatusEnum, type CatalogStatus } from "@/features/catalog-ho/types";
import { useTranslations } from "next-intl";
import type { Translate } from "@/i18n/types";

type DetailActionsMenuProps = {
  catalogId: string;
  status: CatalogStatus;
  ariaLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  additionalActions?: string[];
  excludeActions?: string[];
  onAdditionalActionSelect?: (action: string) => void;
  uploadActions?: Record<
    string,
    {
      title: string;
      onUpload?: (files: File[]) => Promise<void> | void;
    }
  >;
};

const ACTION_LABEL_KEYS: Record<string, string> = {
  "Add new customer": "details.actions.addNewCustomer",
  "Add new item": "details.actions.addNewItem",
  Clone: "details.actions.clone",
  Delete: "details.actions.delete",
  "Delete all": "details.actions.deleteAll",
  Edit: "details.actions.edit",
  "Export all": "details.actions.exportAll",
  "Export Item Price Master": "details.actions.exportItemPriceMaster",
  "Import Customer": "details.actions.importCustomer",
  "Import Customer with Update": "details.actions.importCustomerWithUpdate",
  "Import Item Price with Update": "details.actions.importItemPriceWithUpdate",
  "Inactive EOD": "details.actions.inactiveEod",
  "Inactive immediate": "details.actions.inactiveImmediate",
};

export function DetailActionsMenu({
  catalogId,
  status,
  ariaLabel,
  open,
  onOpenChange,
  additionalActions = [],
  excludeActions = [],
  onAdditionalActionSelect,
  uploadActions = {},
}: DetailActionsMenuProps) {
  const router = useRouter();
  const t = useTranslations();

  const baseActions = (
    status === StatusEnum.Draft
      ? ["Edit", "Clone"]
      : status === StatusEnum.Preview
        ? ["Edit", "Clone"]
        : status === StatusEnum.Expired
          ? []
          : ["Edit", "Clone", "Inactive EOD", "Inactive immediate"]
  ).filter((action) => !excludeActions.includes(action));

  const runAction = (action: string, isAdditional = false) => {
    if (isAdditional && onAdditionalActionSelect) {
      onAdditionalActionSelect(action);
      return;
    }
    if (action === "Edit") {
      router.push(`/catalog-ho/${encodeURIComponent(catalogId)}`);
      return;
    }
    if (action === "Delete all") {
      console.info("Delete all catalog items", { catalogId });
    }
  };

  const menuActions: ActionMenuItem[] = [
    ...baseActions.map((action) =>
      createMenuItem(action, () => runAction(action), t)
    ),
    ...additionalActions.map((action, index) =>
      createMenuItem(action, () => runAction(action, true), t, {
        separatorBefore: index === 0 && baseActions.length > 0,
        upload: uploadActions[action]
          ? {
              ...uploadActions[action],
              title: getActionLabel(uploadActions[action].title, t),
            }
          : undefined,
        visibility: action === "Export all" ? "mobile" : "all",
      })
    ),
  ];

  return (
    <ActionsMenu
      actions={menuActions}
      ariaLabel={
        ariaLabel ?? t("details.actions.statusCatalogActions", { status })
      }
      contentClassName="min-w-56"
      onOpenChange={onOpenChange}
      open={open}
    />
  );
}

function createMenuItem(
  action: string,
  onSelect: () => void,
  t: Translate,
  options: Pick<
    ActionMenuItem,
    "disabled" | "separatorBefore" | "upload" | "visibility"
  > = {}
): ActionMenuItem {
  return {
    ...options,
    icon: getActionIcon(action),
    label: getActionLabel(action, t),
    onSelect,
    variant: isDestructiveAction(action) ? "destructive" : "default",
  };
}

function getActionLabel(action: string, t: Translate) {
  const key = ACTION_LABEL_KEYS[action];
  return key ? t(key) : action;
}

function getActionIcon(action: string) {
  if (action === "Clone") return <Copy className="h-4 w-4" />;
  if (action === "Edit") return <Edit className="h-4 w-4" />;
  if (action === "Add new item" || action === "Add new customer") {
    return <Plus className="h-4 w-4" />;
  }
  if (
    action === "Import Item Price with Update" ||
    action === "Import Customer" ||
    action === "Import Customer with Update"
  ) {
    return <FileUp className="h-4 w-4" />;
  }
  if (action === "Export Item Price Master" || action === "Export all") {
    return <Download className="h-4 w-4" />;
  }
  if (action === "Delete" || action === "Delete all") {
    return <Trash2 className="h-4 w-4" />;
  }
  if (action.startsWith("Inactive")) {
    return <CircleSlash className="h-4 w-4" />;
  }
  return null;
}

function isDestructiveAction(action: string) {
  return (
    action === "Delete" ||
    action === "Delete all" ||
    action.startsWith("Inactive")
  );
}
