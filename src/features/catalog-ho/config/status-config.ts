import type { AppBadgeVariant } from "@/components/app-badge";
import {
  StatusEnum,
  type CatalogItemStatus,
  type CatalogStatus,
} from "@/features/catalog-ho/types";
import type { Translate } from "@/i18n/types";

export const catalogStatusVariant: Record<CatalogStatus, AppBadgeVariant> = {
  [StatusEnum.Preview]: "warning",
  [StatusEnum.Active]: "success",
  [StatusEnum.Approved]: "success",
  [StatusEnum.Draft]: "info",
  [StatusEnum.Expired]: "danger",
};

const catalogStatusAccentClassNames: Record<CatalogStatus, string> = {
  [StatusEnum.Preview]:
    "border-status-warning/30 bg-status-warning/10 text-status-warning",
  [StatusEnum.Active]:
    "border-status-active/30 bg-status-active/10 text-status-active",
  [StatusEnum.Approved]:
    "border-status-active/30 bg-status-active/10 text-status-active",
  [StatusEnum.Draft]:
    "border-status-info/30 bg-status-info/10 text-status-info",
  [StatusEnum.Expired]:
    "border-destructive/30 bg-destructive/10 text-destructive",
};

const catalogStatusLabelKeys: Record<CatalogStatus, string> = {
  [StatusEnum.Active]: "common.statuses.active",
  [StatusEnum.Approved]: "common.statuses.approved",
  [StatusEnum.Draft]: "common.statuses.draft",
  [StatusEnum.Expired]: "common.statuses.expired",
  [StatusEnum.Preview]: "common.statuses.preview",
};

export function catalogStatusAccentClassName(status: CatalogStatus) {
  return catalogStatusAccentClassNames[status];
}

export function getCatalogStatusLabel(status: CatalogStatus, t: Translate) {
  return t(catalogStatusLabelKeys[status]);
}

export const catalogItemStatusVariant: Record<
  CatalogItemStatus,
  AppBadgeVariant
> = {
  ACTIVE: "success",
  DISCONTINUED: "warning",
  INACTIVE: "neutral",
};

export const catalogItemStatusLabel: Record<CatalogItemStatus, string> = {
  ACTIVE: "Active",
  DISCONTINUED: "Discontinued",
  INACTIVE: "Inactive",
};
