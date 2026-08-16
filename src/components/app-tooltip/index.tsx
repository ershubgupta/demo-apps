"use client";

import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cnName";

type TooltipContentProps = ComponentProps<typeof TooltipContent>;
type PopoverContentProps = ComponentProps<typeof PopoverContent>;

export type AppTooltipVariant = "default" | "icon" | "sidebar";

type AppTooltipProps = {
  /** Trigger element that receives hover/focus tooltip behavior on pointer devices and tap popover behavior on touch devices. */
  children: ReactElement;
  /** Tooltip body. When omitted, the tooltip is not rendered. */
  content?: ReactNode;
  /** Optional content class for width/layout only. */
  contentClassName?: string;
  /** Delay before opening the tooltip. Defaults to the selected variant preset. */
  delayDuration?: number;
  /** Disables tooltip behavior and returns children unchanged. */
  disabled?: boolean;
  /** Aligns content relative to the trigger. */
  align?: TooltipContentProps["align"];
  /** Preferred side for content placement. */
  side?: TooltipContentProps["side"];
  /** Distance between trigger and content. */
  sideOffset?: TooltipContentProps["sideOffset"];
  /** Preset for common app usage: default, icon buttons, or collapsed sidebar. */
  variant?: AppTooltipVariant;
};

const variantDefaults: Record<
  AppTooltipVariant,
  {
    delayDuration: number;
    side?: TooltipContentProps["side"];
    sideOffset: number;
  }
> = {
  default: { delayDuration: 150, sideOffset: 4 },
  icon: { delayDuration: 150, sideOffset: 6 },
  sidebar: { delayDuration: 150, side: "right", sideOffset: 8 },
};

const TOUCH_TOOLTIP_MEDIA_QUERY = "(hover: none), (pointer: coarse)";

/**
 * An app-level tooltip wrapper around the shadcn/Radix tooltip primitives.
 *
 * On pointer devices it renders a normal hover/focus tooltip. On touch-first
 * devices it switches to a tap-triggered popover so the same shared component
 * stays usable without hover.
 *
 * @component
 * @param {object} props - The props for the app tooltip.
 * @param {ReactElement} props.children - Trigger element that receives hover/focus tooltip behavior via asChild.
 * @param {ReactNode} [props.content] - Tooltip body. When omitted, the tooltip is not rendered.
 * @param {string} [props.contentClassName] - Optional content class for width/layout only.
 * @param {number} [props.delayDuration] - Delay before opening the tooltip. Defaults to the selected variant preset.
 * @param {boolean} [props.disabled=false] - Disables tooltip behavior and returns children unchanged.
 * @param {"start" | "center" | "end"} [props.align] - Aligns content relative to the trigger.
 * @param {"top" | "bottom" | "left" | "right"} [props.side] - Preferred side for content placement.
 * @param {number} [props.sideOffset] - Distance between trigger and content.
 * @param {"default" | "icon" | "sidebar"} [props.variant="default"] - Preset for common app usage: default, icon buttons, or collapsed sidebar.
 * @returns {JSX.Element} The rendered app tooltip component.
 */
export function AppTooltip({
  align,
  children,
  content,
  contentClassName,
  delayDuration,
  disabled = false,
  side,
  sideOffset,
  variant = "default",
}: AppTooltipProps) {
  const isTouchTooltip = useTouchTooltipMode();

  if (disabled || !content) return children;

  const defaults = variantDefaults[variant];
  const resolvedSide = side ?? defaults.side;
  const resolvedSideOffset = sideOffset ?? defaults.sideOffset;

  if (isTouchTooltip) {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          align={align as PopoverContentProps["align"]}
          className={cn(
            "max-w-[min(20rem,calc(100vw-2rem))]",
            contentClassName
          )}
          side={resolvedSide as PopoverContentProps["side"]}
          sideOffset={resolvedSideOffset}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={delayDuration ?? defaults.delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align={align}
          className={cn(contentClassName)}
          side={resolvedSide}
          sideOffset={resolvedSideOffset}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function useTouchTooltipMode() {
  const [isTouchTooltip, setIsTouchTooltip] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia(TOUCH_TOOLTIP_MEDIA_QUERY);
    const syncTooltipMode = () => setIsTouchTooltip(mediaQuery.matches);

    syncTooltipMode();
    mediaQuery.addEventListener("change", syncTooltipMode);

    return () => {
      mediaQuery.removeEventListener("change", syncTooltipMode);
    };
  }, []);

  return isTouchTooltip;
}
