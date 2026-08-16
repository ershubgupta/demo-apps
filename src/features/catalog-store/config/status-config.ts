import type { AppBadgeVariant } from "@/components/app-badge";
import type { CatalogStoreItemStatus, CatalogStoreStatus } from "../types";

export const catalogStoreStatusVariant: Record<
  CatalogStoreStatus,
  AppBadgeVariant
> = {
  Draft: "warning",
  Preview: "primary",
  Pending: "warning",
  Approved: "info",
  Rejected: "danger",
  Active: "success",
  Expired: "neutral",
  "Inactive EOD": "neutral",
  "Inactive Immediate": "neutral",
};

const catalogStatusAccentClassNames: Record<CatalogStoreStatus, string> = {
  Draft: "bg-status-draft",
  Preview: "bg-status-preview",
  Pending: "bg-status-pending",
  Approved: "bg-status-approved",
  Rejected: "bg-status-rejected",
  Active: "bg-status-active",
  Expired: "bg-status-expired",
  "Inactive EOD": "bg-status-inactive-eod",
  "Inactive Immediate": "bg-status-inactive-immediate",
};

export function catalogStatusAccentClassName(status: CatalogStoreStatus) {
  return catalogStatusAccentClassNames[status];
}

export const catalogStoreItemStatusVariant: Record<
  CatalogStoreItemStatus,
  AppBadgeVariant
> = {
  ACTIVE: "success",
  DISCONTINUED: "warning",
  INACTIVE: "neutral",
};

export const catalogStoreItemStatusLabel: Record<
  CatalogStoreItemStatus,
  string
> = {
  ACTIVE: "Active",
  DISCONTINUED: "Discontinued",
  INACTIVE: "Inactive",
};
