import { useEffect, useMemo } from "react";
import type { RowSelectionState } from "@tanstack/react-table";

/** Callback used by tab panels to publish selected-row delete state upward. */
export type SelectedDeleteActionChange = (
  selectedCount: number,
  onDeleteSelected: (() => void) | null
) => void;

/**
 * Publishes selected-row count and delete handler state from a table panel.
 *
 * @param params - Row selection state and callbacks for selected delete.
 * @returns Number of selected rows.
 */
export function useSelectedDeleteAction({
  onDeleteSelected,
  onSelectedDeleteActionChange,
  rowSelection,
}: {
  onDeleteSelected: () => void;
  onSelectedDeleteActionChange: SelectedDeleteActionChange;
  rowSelection: RowSelectionState;
}) {
  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection]
  );

  useEffect(() => {
    onSelectedDeleteActionChange(
      selectedCount,
      selectedCount > 0 ? onDeleteSelected : null
    );
  }, [onDeleteSelected, onSelectedDeleteActionChange, selectedCount]);

  return selectedCount;
}
