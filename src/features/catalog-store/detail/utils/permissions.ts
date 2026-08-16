import type { CatalogStoreStatus } from "@/features/catalog-store/types";

/**
 * Checks whether a catalog store status allows detail edits.
 *
 * @param status - Current catalog lifecycle status.
 * @returns True for editable statuses; otherwise false.
 */
export function canEditCatalogStore(status: CatalogStoreStatus): boolean {
  return status === "Preview" || status === "Draft";
}
