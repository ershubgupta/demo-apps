"use client";

import type { ComponentProps, ReactNode } from "react";
import { Check, Download, Plus, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils/cnName";

type AppDrawerAction = Omit<ComponentProps<typeof Button>, "children"> & {
  closeOnClick?: boolean;
  icon?: AppDrawerActionIcon;
  label: ReactNode;
};

type AppDrawerActionIcon = "plus" | "cross" | "tick" | "update" | "download";

type AppDrawerSize = "2xl" | "xl" | "lg" | "md" | "sm" | "xs";

const appDrawerActionIcon: Record<AppDrawerActionIcon, typeof Plus> = {
  plus: Plus,
  cross: X,
  tick: Check,
  update: RefreshCw,
  download: Download,
};

const appDrawerSizeClassName: Record<AppDrawerSize, string> = {
  xs: "sm:!max-w-xs",
  sm: "sm:!max-w-sm",
  md: "sm:!max-w-md",
  lg: "sm:!max-w-lg",
  xl: "sm:!max-w-xl",
  "2xl": "sm:!max-w-2xl",
};

type AppDrawerProps = {
  /** Optional layout class for the drawer body (scroll area). */
  bodyClassName?: string;
  /** Drawer content (forms, lists, details). */
  children: ReactNode;
  /** Optional layout class for the DrawerContent wrapper. */
  contentClassName?: string;
  /** Optional layout class for the footer action bar. */
  footerClassName?: string;
  /** Optional extra node rendered next to the title in the header. */
  headerExtra?: ReactNode;
  /** Called when the drawer open state changes. */
  onOpenChange: (open: boolean) => void;
  /** Controlled open state. */
  open: boolean;
  /** Primary (right-most) footer action. */
  primaryAction: AppDrawerAction;
  /** Secondary (left) footer action. */
  secondaryAction: AppDrawerAction;
  /** Drawer width breakpoint. Defaults to "md". */
  size?: AppDrawerSize;
  /** Drawer title. */
  title: ReactNode;
  /** Optional trigger element. If omitted the drawer must be opened programmatically. */
  trigger?: ReactNode;
};

/**
 * A standardized right-side drawer with header, body, and two-button footer.
 *
 * @component
 * @param {object} props - The props for the app drawer.
 * @param {string} [props.bodyClassName] - Optional layout class for the drawer body (scroll area).
 * @param {ReactNode} props.children - Drawer content (forms, lists, details).
 * @param {string} [props.contentClassName] - Optional layout class for the DrawerContent wrapper.
 * @param {string} [props.footerClassName] - Optional layout class for the footer action bar.
 * @param {ReactNode} [props.headerExtra] - Optional extra node rendered next to the title in the header.
 * @param {(open: boolean) => void} props.onOpenChange - Called when the drawer open state changes.
 * @param {boolean} props.open - Controlled open state.
 * @param {AppDrawerAction} props.primaryAction - Primary (right-most) footer action.
 * @param {AppDrawerAction} props.secondaryAction - Secondary (left) footer action.
 * @param {"xs" | "sm" | "md" | "lg" | "xl" | "2xl"} [props.size="md"] - Drawer width breakpoint.
 * @param {ReactNode} props.title - Drawer title.
 * @param {ReactNode} [props.trigger] - Optional trigger element. If omitted the drawer must be opened programmatically.
 * @returns {JSX.Element} The rendered app drawer component.
 */
export function AppDrawer({
  bodyClassName,
  children,
  contentClassName,
  footerClassName,
  headerExtra,
  onOpenChange,
  open,
  primaryAction,
  secondaryAction,
  size = "md",
  title,
  trigger,
}: AppDrawerProps) {
  const renderActionButton = (action: AppDrawerAction) => {
    const {
      closeOnClick,
      icon,
      label,
      type = "button",
      ...buttonProps
    } = action;
    const Icon = icon ? appDrawerActionIcon[icon] : null;
    const button = (
      <Button type={type} {...buttonProps}>
        {Icon ? <Icon /> : null}
        {label}
      </Button>
    );

    if (!closeOnClick) return button;

    return <DrawerClose asChild>{button}</DrawerClose>;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent
        className={cn(
          "bg-card p-0",
          appDrawerSizeClassName[size],
          contentClassName
        )}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">{title}</DrawerTitle>
            {headerExtra}
          </DrawerHeader>
          <div className={cn("flex-1 overflow-y-auto px-4", bodyClassName)}>
            {children}
          </div>
          <DrawerFooter className={footerClassName}>
            <div className="flex justify-end gap-3">
              {renderActionButton(secondaryAction)}
              {renderActionButton(primaryAction)}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
