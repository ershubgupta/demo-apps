import type { AppBadgeVariant } from "@/components/app-badge";
import { StatusEnum } from "@/types/catalog";
import type {
  ContractPriceItemStatus,
  ContractPricePeriodStatus,
} from "../types";

export const contractPriceStatusVariant: Record<
  ContractPricePeriodStatus,
  AppBadgeVariant
> = {
  [StatusEnum.Draft]: "warning",
  [StatusEnum.Pending]: "warning",
  [StatusEnum.Preview]: "warning",
  [StatusEnum.Approved]: "info",
  [StatusEnum.Active]: "success",
  [StatusEnum.Expired]: "danger",
};

export const contractPriceItemStatusVariant: Record<
  ContractPriceItemStatus,
  AppBadgeVariant
> = {
  ACTIVE: "success",
  DISCONTINUED: "warning",
  INACTIVE: "neutral",
};

export const contractPriceItemStatusLabel: Record<
  ContractPriceItemStatus,
  string
> = {
  ACTIVE: "Active",
  DISCONTINUED: "Discontinued",
  INACTIVE: "Inactive",
};

export const CONTRACT_PRICE_STATUS_OPTIONS: ContractPricePeriodStatus[] = [
  StatusEnum.Draft,
  StatusEnum.Pending,
  StatusEnum.Approved,
  StatusEnum.Active,
];

export const contractPriceStatusLabelKey: Record<
  ContractPricePeriodStatus,
  string
> = {
  [StatusEnum.Draft]: "common.statuses.draft",
  [StatusEnum.Pending]: "common.statuses.pending",
  [StatusEnum.Preview]: "common.statuses.preview",
  [StatusEnum.Approved]: "common.statuses.approved",
  [StatusEnum.Active]: "common.statuses.active",
  [StatusEnum.Expired]: "common.statuses.expired",
};
