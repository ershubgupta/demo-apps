"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { Filter, X } from "lucide-react";

import { useMobilePageChromeSlot } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";

/** Active filter summary displayed in the responsive filter shell. */
export type ActiveFilter = {
  /** Reader-facing chip label, usually "Field: Value". */
  label: string;
  /** Filter state key removed when this chip is dismissed. */
  name: string;
};

type ResponsiveFilterShellProps = {
  /** Active filter chips shown in mobile sticky chrome. */
  activeFilters: ActiveFilter[];
  /** Mobile drawer primary action label. */
  applyLabel?: string;
  /** Mobile drawer secondary action label. */
  cancelLabel?: string;
  /** Desktop filter content, rendered inline on md+. */
  children: ReactNode;
  /** Disables clear-all controls. Defaults to activeFilters.length === 0. */
  clearDisabled?: boolean;
  /** Optional desktop shell layout class. */
  desktopClassName?: string;
  /** Mobile drawer content, usually the same controls in a compact grid. */
  mobileContent: ReactNode;
  /** Applies staged mobile filter values. */
  onApply: () => void;
  /** Clears every filter. */
  onClearAll: () => void;
  /** Controlled mobile drawer open-state callback. */
  onOpenChange: (open: boolean) => void;
  /** Optional hook called before opening filters, commonly to sync draft state. */
  onOpenFilters?: () => void;
  /** Removes one active filter by state key. */
  onRemoveFilter: (name: string) => void;
  /** Controlled mobile drawer open state. */
  open: boolean;
  /** Mobile drawer title. */
  title?: string;
};

/**
 * A shared responsive filter container.
 *
 * @component
 * @param {object} props - The props for the responsive filter shell.
 * @param {ActiveFilter[]} props.activeFilters - Active filter chips shown in mobile sticky chrome.
 * @param {string} [props.applyLabel="Apply"] - Mobile drawer primary action label.
 * @param {string} [props.cancelLabel="Cancel"] - Mobile drawer secondary action label.
 * @param {ReactNode} props.children - Desktop filter content, rendered inline on md+.
 * @param {boolean} [props.clearDisabled] - Disables clear-all controls. Defaults to activeFilters.length === 0.
 * @param {string} [props.desktopClassName] - Optional desktop shell layout class.
 * @param {ReactNode} props.mobileContent - Mobile drawer content, usually the same controls in a compact grid.
 * @param {() => void} props.onApply - Applies staged mobile filter values.
 * @param {() => void} props.onClearAll - Clears every filter.
 * @param {(open: boolean) => void} props.onOpenChange - Controlled mobile drawer open-state callback.
 * @param {() => void} [props.onOpenFilters] - Optional hook called before opening filters, commonly to sync draft state.
 * @param {(name: string) => void} props.onRemoveFilter - Removes one active filter by state key.
 * @param {boolean} props.open - Controlled mobile drawer open state.
 * @param {string} [props.title="Filters"] - Mobile drawer title.
 * @returns {JSX.Element} The rendered responsive filter shell component.
 */
export function ResponsiveFilterShell({
  activeFilters,
  applyLabel,
  cancelLabel,
  children,
  clearDisabled,
  desktopClassName,
  mobileContent,
  onApply,
  onClearAll,
  onOpenChange,
  onOpenFilters,
  onRemoveFilter,
  open,
  title,
}: ResponsiveFilterShellProps) {
  const t = useTranslations();
  const resolvedApplyLabel = applyLabel ?? t("common.actions.apply");
  const resolvedCancelLabel = cancelLabel ?? t("common.actions.cancel");
  const resolvedTitle = title ?? t("common.filters.title");
  const activeCount = activeFilters.length;

  const headerActions = useMemo(
    () => (
      <Drawer
        direction="bottom"
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) onOpenFilters?.();
          onOpenChange(nextOpen);
        }}
      >
        <DrawerTrigger asChild>
          <Button
            aria-label={t("common.actions.openFilters")}
            className={cn("relative", activeCount > 0 && "border-primary")}
            size="icon"
            type="button"
            variant="secondary"
          >
            <Filter className="h-4 w-4" />
            {activeCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none text-primary-foreground">
                {activeCount}
              </span>
            ) : null}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:!mt-0 data-[vaul-drawer-direction=bottom]:max-h-[88vh] [&>div:first-child]:mt-2 [&>div:first-child]:w-20">
          <DrawerHeader className="border-b border-border px-5 pb-4 pt-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle className="text-xl font-bold">
                {resolvedTitle}
              </DrawerTitle>
              <Button
                disabled={clearDisabled ?? activeCount === 0}
                size="sm"
                onClick={onClearAll}
                type="button"
                variant="ghost"
              >
                {t("common.actions.clearAll")}
              </Button>
            </div>
          </DrawerHeader>
          <div className="grid max-h-[62vh] grid-cols-2 gap-4 overflow-y-auto px-5 py-4">
            {mobileContent}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border bg-background p-5">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                {resolvedCancelLabel}
              </Button>
            </DrawerClose>
            <Button onClick={onApply} type="button">
              {resolvedApplyLabel}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    ),
    [
      activeCount,
      resolvedApplyLabel,
      resolvedCancelLabel,
      clearDisabled,
      mobileContent,
      onApply,
      onClearAll,
      onOpenChange,
      onOpenFilters,
      open,
      resolvedTitle,
      t,
    ]
  );

  const stickyContent = useMemo(() => {
    if (activeFilters.length === 0) return null;

    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          className="shrink-0"
          onClick={onClearAll}
          size="sm"
          type="button"
          variant="outline"
        >
          {t("common.actions.clearAll")}
        </Button>
        {activeFilters.map((filter) => (
          <span
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-medium text-primary"
            key={filter.name}
          >
            {filter.label}
            <Button
              aria-label={t("common.filters.removeNamed", {
                label: filter.label,
              })}
              onClick={() => onRemoveFilter(filter.name)}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </span>
        ))}
      </div>
    );
  }, [activeFilters, onClearAll, onRemoveFilter, t]);

  useMobilePageChromeSlot({ headerActions, stickyContent });

  return (
    <div
      className={cn(
        "hidden rounded-xl border border-border bg-card p-4 shadow-sm md:block",
        desktopClassName
      )}
    >
      {children}
    </div>
  );
}
