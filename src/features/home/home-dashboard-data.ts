import {
  Archive,
  Boxes,
  FileText,
  Grid2X2,
  LineChart,
  PackageCheck,
  ShoppingCart,
  Tag,
  Upload,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { TranslationKey } from "@/i18n/types";

export type DashboardStatTone =
  | "draft"
  | "preview"
  | "approved"
  | "active"
  | "inactive"
  | "expired"
  | "pending";

export type DashboardStat = {
  labelKey: TranslationKey;
  value: number;
  tone: DashboardStatTone;
  muted?: boolean;
};

export type DashboardSection = {
  titleKey: TranslationKey;
  icon: LucideIcon;
  href: string;
  stats: DashboardStat[];
};

export type QuickLink = {
  labelKey: TranslationKey;
  icon: LucideIcon;
  href: string;
};

export const dashboardSections: DashboardSection[] = [
  {
    titleKey: "navigation.catalogHo",
    icon: Tag,
    href: "/catalog-ho",
    stats: [
      { labelKey: "home.stats.draft", value: 12, tone: "draft" },
      { labelKey: "home.stats.preview", value: 4, tone: "preview" },
      { labelKey: "home.stats.approved", value: 127, tone: "approved" },
      { labelKey: "home.stats.active", value: 15, tone: "active" },
      {
        labelKey: "home.stats.inactiveEod",
        value: 0,
        tone: "inactive",
        muted: true,
      },
      {
        labelKey: "home.stats.inactiveNow",
        value: 0,
        tone: "inactive",
        muted: true,
      },
      { labelKey: "home.stats.expired", value: 195, tone: "expired" },
    ],
  },
  {
    titleKey: "navigation.catalogStore",
    icon: ShoppingCart,
    href: "/catalog-store",
    stats: [
      {
        labelKey: "home.stats.approved",
        value: 0,
        tone: "approved",
        muted: true,
      },
      { labelKey: "home.stats.active", value: 24, tone: "active" },
      { labelKey: "home.stats.expired", value: 25, tone: "expired" },
    ],
  },
  {
    titleKey: "navigation.contractPrice",
    icon: Archive,
    href: "/contract-price",
    stats: [
      { labelKey: "home.stats.draft", value: 21, tone: "draft" },
      { labelKey: "home.stats.pending", value: 7, tone: "pending" },
      { labelKey: "home.stats.approved", value: 8, tone: "approved" },
      { labelKey: "home.stats.active", value: 1, tone: "active" },
      { labelKey: "home.stats.inactiveNow", value: 3, tone: "inactive" },
      { labelKey: "home.stats.expired", value: 96, tone: "expired" },
    ],
  },
];

export const overviewLinks: QuickLink[] = [
  { labelKey: "navigation.catalog", icon: Tag, href: "/catalog" },
  { labelKey: "navigation.catalogHo", icon: Tag, href: "/catalog-ho" },
  {
    labelKey: "navigation.reportCatalogHo",
    icon: FileText,
    href: "/reports/catalog-ho",
  },
  {
    labelKey: "navigation.catalogStore",
    icon: ShoppingCart,
    href: "/catalog-store",
  },
  {
    labelKey: "navigation.reportCatalogStore",
    icon: FileText,
    href: "/reports/catalog-store",
  },
  {
    labelKey: "navigation.contractPrice",
    icon: Archive,
    href: "/contract-price",
  },
  {
    labelKey: "navigation.reportContractPrice",
    icon: FileText,
    href: "/reports/contract-price",
  },
  {
    labelKey: "reports.contractPriceDaily.title",
    icon: FileText,
    href: "/reports/contract-price-daily",
  },
];

export const masterDataLinks: QuickLink[] = [
  { labelKey: "home.links.baseline", icon: LineChart, href: "#" },
  { labelKey: "home.links.batch", icon: PackageCheck, href: "#" },
  { labelKey: "home.links.approvalLine", icon: Grid2X2, href: "#" },
  { labelKey: "home.links.seManagement", icon: Boxes, href: "#" },
  { labelKey: "home.links.seStore", icon: User, href: "#" },
  { labelKey: "home.links.lpAccount", icon: Users, href: "#" },
  { labelKey: "home.links.approverAccount", icon: User, href: "#" },
  { labelKey: "home.links.documentUploadTemplate", icon: Upload, href: "#" },
];
