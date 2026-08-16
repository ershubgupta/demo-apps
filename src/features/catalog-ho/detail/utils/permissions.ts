import { StatusEnum, type CatalogStatus } from "@/features/catalog-ho/types";

/**
 * Checks whether a catalog status allows detail edits.
 *
 * @param status - Current catalog lifecycle status.
 * @returns True for editable statuses; otherwise false.
 */
export function canEditCatalog(status: CatalogStatus): boolean {
  return status === StatusEnum.Preview || status === StatusEnum.Draft;
}
