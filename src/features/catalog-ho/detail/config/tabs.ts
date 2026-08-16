import type { Tab } from "@/components/tabs/tabs";
import type { Translate } from "@/i18n/types";

/** Supported tabs on the catalog HO detail page. */
export type DetailTab = "items" | "customers";

/** Default tab when the URL has no valid tab parameter. */
export const DEFAULT_TAB: DetailTab = "items";

/** Ordered tab keys accepted by the detail page URL. */
export const TABS = [
  "items",
  "customers",
] as const satisfies readonly DetailTab[];

const TAB_META: Record<DetailTab, { labelKey: string; panelId: string }> = {
  items: {
    labelKey: "details.tabs.catalogItem",
    panelId: "catalog-tab-panel-items",
  },
  customers: {
    labelKey: "details.tabs.catalogCustomer",
    panelId: "catalog-tab-panel-customers",
  },
};

/**
 * Builds the DOM id for a tab trigger.
 *
 * @param tab - Detail tab key.
 * @returns Stable tab trigger id.
 */
export function tabId(tab: DetailTab) {
  return `catalog-tab-${tab}`;
}

/**
 * Gets the DOM id for a tab panel.
 *
 * @param tab - Detail tab key.
 * @returns Stable tab panel id.
 */
export function tabPanelId(tab: DetailTab) {
  return TAB_META[tab].panelId;
}

/**
 * Builds tab descriptors for the shared Tabs component.
 *
 * @param counts - Current item and customer counts for tab badges.
 * @returns Ordered tab descriptors.
 */
export function getTabs({
  itemCount,
  customerCount,
  t,
}: {
  itemCount: number;
  customerCount: number;
  t: Translate;
}): Tab<DetailTab>[] {
  return [
    {
      key: "items",
      label: t(TAB_META.items.labelKey),
      count: itemCount,
      panelId: tabPanelId("items"),
    },
    {
      key: "customers",
      label: t(TAB_META.customers.labelKey),
      count: customerCount,
      panelId: tabPanelId("customers"),
    },
  ];
}
