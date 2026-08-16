"use client";

import type { ReactNode } from "react";

import { AppBadge } from "@/components/app-badge";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/app-tooltip";
import { cn } from "@/lib/utils/cnName";

/** Describes one tab rendered by the app Tabs primitive. */
export type Tab<TKey extends string> = {
  /** Optional count badge shown next to the label. */
  count?: number;
  /** Stable tab key used for active state and onChange. */
  key: TKey;
  /** Visible tab label. */
  label: string;
  /** Id of the panel controlled by this tab for aria-controls. */
  panelId: string;
};

type TabsProps<TKey extends string> = {
  /** Optional trailing controls, usually TabActions. */
  actions?: ReactNode;
  /** Currently active tab key. */
  active: TKey;
  /** Returns a stable DOM id for each tab trigger. */
  getTabId: (tab: TKey) => string;
  /** Called when the user selects a different tab. */
  onChange: (tab: TKey) => void;
  /** Ordered tab descriptors to render. */
  tabs: Tab<TKey>[];
};

/**
 * Accessible app tabs with an optional action area on the trailing edge.
 *
 * @component
 * @template TKey - The type of the tab keys.
 * @param {object} props - The props for the tabs component.
 * @param {ReactNode} [props.actions] - Optional trailing controls, usually TabActions.
 * @param {TKey} props.active - Currently active tab key.
 * @param {(tab: TKey) => string} props.getTabId - Returns a stable DOM id for each tab trigger.
 * @param {(tab: TKey) => void} props.onChange - Called when the user selects a different tab.
 * @param {Tab<TKey>[]} props.tabs - Ordered tab descriptors to render.
 * @returns {JSX.Element} The rendered tabs component.
 */
export function Tabs<TKey extends string>({
  actions,
  active,
  getTabId,
  onChange,
  tabs,
}: TabsProps<TKey>) {
  return (
    <div className="flex min-w-0 items-center gap-1 border-b border-border bg-card sm:gap-2 p-2 sm:rounded-xl">
      <div
        aria-orientation="horizontal"
        className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Button
              aria-controls={tab.panelId}
              aria-selected={isActive}
              className={cn(
                "shrink-0 border border-transparent shadow-none",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              id={getTabId(tab.key)}
              key={tab.key}
              onClick={() => onChange(tab.key)}
              role="tab"
              size="sm"
              tabIndex={isActive ? 0 : -1}
              type="button"
              variant="ghost"
            >
              {tab.label}
              {typeof tab.count === "number" ? (
                <TabCountBadge active={isActive} count={tab.count} />
              ) : null}
            </Button>
          );
        })}
      </div>
      {actions ? <div className="shrink-0 pl-1">{actions}</div> : null}
    </div>
  );
}

function TabCountBadge({ count, active }: { count: number; active: boolean }) {
  const abbreviated = count > 999;
  const display = abbreviated ? `${Math.floor(count / 100) / 10}k` : count;

  const badge = (
    <AppBadge
      className="min-w-6 justify-center px-1.5 py-0.5 text-[11px] font-bold"
      variant={active ? "primary" : "neutral"}
    >
      {display}
    </AppBadge>
  );

  if (!abbreviated) return badge;

  return (
    <AppTooltip content={count.toLocaleString() + " total"} variant="icon">
      <span className="cursor-help">{badge}</span>
    </AppTooltip>
  );
}
