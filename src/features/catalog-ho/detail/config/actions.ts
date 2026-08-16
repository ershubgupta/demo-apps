import { StatusEnum, type CatalogStatus } from "@/features/catalog-ho/types";

import type { DetailTab } from "./tabs";

/** Menu actions available for each detail tab and catalog status. */
export const ACTIONS_BY_TAB_AND_STATUS: Record<
  DetailTab,
  Record<CatalogStatus, string[]>
> = {
  items: {
    [StatusEnum.Preview]: [
      "Add new item",
      "Import Item Price with Update",
      "Export Item Price Master",
      "Delete all",
    ],
    [StatusEnum.Active]: [
      "Add new item",
      "Import Item Price with Update",
      "Delete all",
    ],
    [StatusEnum.Approved]: [
      "Add new item",
      "Import Item Price with Update",
      "Delete all",
    ],
    [StatusEnum.Draft]: [
      "Import Item Price with Update",
      "Export Item Price Master",
      "Delete all",
    ],
    [StatusEnum.Expired]: [],
  },
  customers: {
    [StatusEnum.Preview]: [
      "Add new customer",
      "Import Customer",
      "Import Customer with Update",
    ],
    [StatusEnum.Active]: [
      "Add new customer",
      "Import Customer",
      "Import Customer with Update",
    ],
    [StatusEnum.Approved]: [
      "Add new customer",
      "Import Customer",
      "Import Customer with Update",
    ],
    [StatusEnum.Draft]: ["Import Customer", "Import Customer with Update"],
    [StatusEnum.Expired]: [],
  },
};
