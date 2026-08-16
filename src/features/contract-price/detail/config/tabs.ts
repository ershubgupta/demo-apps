import type { Tab } from "@/components/tabs/tabs";
import type { Translate } from "@/features/i18n";

/** Supported tabs on the contract price detail page. */
export type DetailTab = "contractPrice" | "contractItem";

/** Default tab when the URL has no valid tab parameter. */
export const DEFAULT_TAB: DetailTab = "contractPrice";

/** Ordered tab keys accepted by the detail page URL. */
export const TABS = [
  "contractPrice",
  "contractItem",
] as const satisfies readonly DetailTab[];

const TAB_META: Record<DetailTab, { labelKey: string; panelId: string }> = {
  contractPrice: {
    labelKey: "details.tabs.contractPrice",
    panelId: "contract-price-tab-panel-periods",
  },
  contractItem: {
    labelKey: "details.tabs.contractItem",
    panelId: "contract-price-tab-panel-items",
  },
};

/**
 * Builds the DOM id for a tab trigger.
 *
 * @param tab - Detail tab key.
 * @returns Stable tab trigger id.
 */
export function tabId(tab: DetailTab) {
  return `contract-price-tab-${tab}`;
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
 * @param counts - Current period and item counts for tab badges.
 * @returns Ordered tab descriptors.
 */
export function getTabs({
  periodCount,
  itemCount,
  t,
}: {
  periodCount: number;
  itemCount: number;
  t: Translate;
}): Tab<DetailTab>[] {
  return [
    {
      key: "contractPrice",
      label: t(TAB_META.contractPrice.labelKey),
      count: periodCount,
      panelId: tabPanelId("contractPrice"),
    },
    {
      key: "contractItem",
      label: t(TAB_META.contractItem.labelKey),
      count: itemCount,
      panelId: tabPanelId("contractItem"),
    },
  ];
}
