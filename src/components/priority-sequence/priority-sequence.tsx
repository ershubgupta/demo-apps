"use client";

import { useMemo, useState, type MouseEvent } from "react";

import { AppTooltip } from "@/components/app-tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cnName";

/** Item displayed by PrioritySequence. */
export type PrioritySequenceItem = {
  /** Short rank or index label, for example "1". Omit for plain value-only rows. */
  label?: string;
  /** Display value associated with the rank. */
  value: string;
};

type PrioritySequenceProps = {
  /** Optional wrapper layout class. */
  className?: string;
  /** Ordered items to display when the caller already has normalized data. */
  items?: PrioritySequenceItem[];
  /** Maximum visible items before collapsing the rest into a +N indicator. */
  maxVisibleItems?: number;
  /** Tooltip text shown over the +N overflow trigger. */
  moreTriggerTooltip?: string;
  /** Raw priority text such as "1:2, 2:3" or "2,3". Parsed internally when items are not supplied. */
  value?: string;
  /** Visual style for each visible item. Badge shows rank + value; text shows value only. */
  variant?: "badge" | "text";
};

/**
 * Displays a compact ordered priority list with overflow summary.
 *
 * PrioritySequence accepts either normalized items or the raw catalog priority
 * string used by list/detail data. Raw values can be colon-delimited, such as
 * "1:2, 2:3", or comma-delimited, such as "2,3". Comma-only values are given
 * their display order as the priority label. A single non-priority value, such
 * as "All Stores", renders as plain text so it does not imply ranking.
 *
 * @component
 * @param {PrioritySequenceProps} props - The props for the priority sequence.
 * @param {string} [props.value] - Raw priority string parsed into display items when items are omitted.
 * @param {PrioritySequenceItem[]} [props.items] - Ordered items to display when already normalized.
 * @param {string} [props.className] - Optional wrapper layout class.
 * @param {number} [props.maxVisibleItems] - Maximum visible items before collapsing the rest into a +N indicator.
 * @param {string} [props.moreTriggerTooltip="Click to show more."] - Tooltip text shown over the +N overflow trigger.
 * @param {"badge" | "text"} [props.variant="badge"] - Visual style for each visible item. Badge shows rank + value; text shows value only.
 * @returns {JSX.Element | null} The rendered priority sequence component, or null if no items/value are available.
 */
export function PrioritySequence({
  items,
  value,
  className,
  maxVisibleItems,
  moreTriggerTooltip = "Click to show more.",
  variant = "badge",
}: PrioritySequenceProps) {
  const [expanded, setExpanded] = useState(false);
  const sequenceItems = useMemo(
    () => items ?? parsePrioritySequenceValue(value),
    [items, value]
  );

  if (sequenceItems.length === 0) return null;

  const shouldLimit =
    typeof maxVisibleItems === "number" &&
    sequenceItems.length > maxVisibleItems;
  const visibleItems =
    shouldLimit && !expanded
      ? sequenceItems.slice(0, maxVisibleItems)
      : sequenceItems;
  const hiddenItems = shouldLimit ? sequenceItems.slice(maxVisibleItems) : [];

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setExpanded((current) => !current);
  };

  return (
    <span
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-1.5",
        className
      )}
    >
      {visibleItems.map((item, index) => (
        <span
          className="inline-flex items-center"
          key={`${item.label ?? "value"}-${item.value}-${index}`}
        >
          <PrioritySequenceValue item={item} variant={variant} />
        </span>
      ))}

      {hiddenItems.length > 0 && !expanded ? (
        <span onClick={(event) => event.stopPropagation()}>
          <AppTooltip content={moreTriggerTooltip} variant="icon">
            <Button
              onClick={handleToggle}
              size="xs"
              type="button"
              variant="secondary"
            >
              +{hiddenItems.length}
            </Button>
          </AppTooltip>
        </span>
      ) : null}
    </span>
  );
}

function PrioritySequenceValue({
  item,
  variant,
}: {
  item: PrioritySequenceItem;
  variant: NonNullable<PrioritySequenceProps["variant"]>;
}) {
  if (variant === "badge" && item.label) {
    return (
      <span className="inline-flex items-center overflow-hidden rounded-md border border-border bg-secondary text-xs font-medium text-foreground">
        <span className="bg-primary px-1.5 py-0.5 text-[11px] font-bold leading-none text-primary-foreground">
          {item.label}
        </span>
        <span className="px-1.5 py-0.5 leading-none">{item.value}</span>
      </span>
    );
  }

  return (
    <span className="text-sm font-medium text-foreground">{item.value}</span>
  );
}

function parsePrioritySequenceValue(value?: string): PrioritySequenceItem[] {
  if (!value) return [];

  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  const hasPriorityDelimiter = parts.some((part) => part.includes(":"));

  if (hasPriorityDelimiter) {
    return parts.map((part, index) => {
      const [priority, ...storeParts] = part.split(":");
      const store = storeParts.join(":").trim();
      const label = priority.trim();

      if (!label || !store) return { label: String(index + 1), value: part };
      return { label, value: store };
    });
  }

  if (parts.length === 1) return [{ value: parts[0] }];

  return parts.map((part, index) => ({
    label: String(index + 1),
    value: part,
  }));
}
