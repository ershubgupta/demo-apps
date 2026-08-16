"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleSlash, Copy, Edit } from "lucide-react";
import { toast } from "sonner";

import { ActionsMenu, type ActionMenuItem } from "@/components/actions-menu";
import { StatusEnum, type Catalog } from "@/features/catalog-ho/types";

export type RowAction =
  "Clone" | "Delete" | "Inactive EOD" | "Inactive immediate";
export type DestructiveCatalogAction = Exclude<RowAction, "Clone">;

type RowActionsProps = {
  catalog: Catalog;
  onAction: (catalog: Catalog, action: RowAction) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export function RowActions({
  catalog,
  onAction,
  onOpenChange,
  open,
}: RowActionsProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const menuOpen = open ?? internalOpen;
  const setMenuOpen = onOpenChange ?? setInternalOpen;

  if (catalog.status === StatusEnum.Expired) return null;

  const labels =
    catalog.status === StatusEnum.Draft
      ? ["Edit", "Clone"]
      : catalog.status === StatusEnum.Preview
        ? ["Edit", "Clone"]
        : ["Edit", "Clone", "Inactive EOD", "Inactive immediate"];

  const actions: ActionMenuItem[] = labels.map((action) => ({
    icon: getActionIcon(action),
    label: action,
    onSelect: () => runAction(action),
    variant: isRowAction(action) ? "destructive" : "default",
  }));

  return (
    <ActionsMenu
      actions={actions}
      ariaLabel={`${catalog.status} row actions`}
      contentClassName="min-w-52"
      onOpenChange={setMenuOpen}
      open={menuOpen}
    />
  );

  function runAction(action: string) {
    if (action === "Edit") {
      router.push(`/catalog-ho/${encodeURIComponent(catalog.id)}`);
      return;
    }
    if (action === "Clone") {
      onAction(catalog, action);
      return;
    }
    if (isRowAction(action)) {
      onAction(catalog, action);
      return;
    }
    toast.info(`${action} is not available yet`, {
      description: `Catalog ${catalog.number} cannot be ${action.toLowerCase()}d yet.`,
    });
  }
}

function getActionIcon(action: string) {
  if (action === "Clone") return <Copy className="h-4 w-4" />;
  if (action === "Edit") return <Edit className="h-4 w-4" />;
  if (action.startsWith("Inactive")) {
    return <CircleSlash className="h-4 w-4" />;
  }
  return null;
}

function isRowAction(action: string): action is DestructiveCatalogAction {
  return action === "Delete" || action.startsWith("Inactive");
}
