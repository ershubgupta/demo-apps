"use client";

import type { ReactNode } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";

import { AppBadge } from "@/components/app-badge";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type TabActionsProps = {
  /** Optional overflow menu, normally ActionsMenu. */
  actionsMenu?: ReactNode;
  /** Label for the selected-row delete action. */
  deleteLabel?: string;
  /** Label for the export action. */
  exportLabel?: string;
  /** Shows export loading state and disables the export button. */
  isExporting?: boolean;
  /** Optional controls rendered before export/delete (e.g. more-filters). */
  leadingActions?: ReactNode;
  /** Called when deleting selected rows. Null disables the delete button. */
  onDeleteSelected?: (() => void) | null;
  /** Called for the desktop export action. Omit to hide export. */
  onExport?: () => void;
  /** Number of selected rows. Delete action appears only when greater than zero. */
  selectedCount?: number;
};

/**
 * A standard tab toolbar for bulk delete, export, and overflow actions.
 *
 * @component
 * @param {object} props - The props for the tab actions.
 * @param {ReactNode} [props.actionsMenu] - Optional overflow menu, normally ActionsMenu.
 * @param {string} [props.deleteLabel="Delete"] - Label for the selected-row delete action.
 * @param {string} [props.exportLabel="Export"] - Label for the export action.
 * @param {boolean} [props.isExporting=false] - Shows export loading state and disables the export button.
 * @param {ReactNode} [props.leadingActions] - Optional controls rendered before export/delete (e.g. more-filters).
 * @param {(() => void) | null} [props.onDeleteSelected] - Called when deleting selected rows. Null disables the delete button.
 * @param {() => void} [props.onExport] - Called for the desktop export action. Omit to hide export.
 * @param {number} [props.selectedCount=0] - Number of selected rows. Delete action appears only when greater than zero.
 * @returns {JSX.Element} The rendered tab actions component.
 */
export function TabActions({
  actionsMenu,
  deleteLabel,
  exportLabel,
  isExporting = false,
  leadingActions,
  onDeleteSelected,
  onExport,
  selectedCount = 0,
}: TabActionsProps) {
  const t = useTranslations();
  const resolvedDeleteLabel = deleteLabel ?? t("common.actions.delete");
  const resolvedExportLabel = exportLabel ?? t("common.actions.export");

  return (
    <div className="flex items-center gap-2">
      {leadingActions}
      {selectedCount > 0 ? (
        <Button
          aria-label={resolvedDeleteLabel}
          className="h-8 rounded-md px-2.5 text-xs font-semibold disabled:opacity-50 sm:px-3"
          disabled={!onDeleteSelected}
          onClick={onDeleteSelected ?? undefined}
          type="button"
          variant="destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{resolvedDeleteLabel}</span>
          <AppBadge className="ml-1 px-1.5 py-0.5 text-[10px]" variant="danger">
            {selectedCount}
          </AppBadge>
        </Button>
      ) : null}
      {onExport ? (
        <Button
          aria-label={resolvedExportLabel}
          className="hidden h-8 rounded-md px-2.5 text-xs font-semibold disabled:opacity-70 md:inline-flex md:px-3"
          disabled={isExporting}
          onClick={onExport}
          type="button"
          variant="default"
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            {isExporting ? t("common.actions.exporting") : resolvedExportLabel}
          </span>
        </Button>
      ) : null}
      {actionsMenu}
    </div>
  );
}
