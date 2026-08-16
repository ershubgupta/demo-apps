"use client";

import { useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

import { FileUploadDialog } from "@/components/file-uploader/file-upload-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cnName";

/**
 * Describes one command in the shared overflow menu.
 * Items can run an immediate callback, open the shared upload dialog, be hidden
 * by breakpoint, or render as destructive. Use this for commands/actions, not
 * for form value selection.
 */
export type ActionMenuItem = {
  /** Disables the item and prevents selection. */
  disabled?: boolean;
  /** Optional leading icon, usually a lucide icon sized by the caller. */
  icon?: ReactNode;
  /** Visible menu item label and stable key fallback. */
  label: string;
  /** Callback for normal action items. Not needed when upload is supplied. */
  onSelect?: () => void;
  /** Inserts a separator before this item. */
  separatorBefore?: boolean;
  /** Opens FileUploadDialog for this action instead of calling onSelect directly. */
  upload?: {
    /** Upload handler passed to the dialog uploader. */
    onUpload?: (files: File[]) => Promise<void> | void;
    /** Dialog title shown when this upload action opens. */
    title: string;
  };
  /** Breakpoint visibility for actions that differ between desktop and mobile. */
  visibility?: "all" | "mobile" | "desktop";
  /** Visual command intent. Destructive uses the shared destructive menu style. */
  variant?: "default" | "destructive";
};

type ActionsMenuProps = {
  /** Commands to render in menu order. Empty arrays render nothing. */
  actions: ActionMenuItem[];
  /** Horizontal popover alignment relative to the trigger. Defaults to end. */
  align?: "start" | "center" | "end";
  /** Accessible label for the icon-only trigger button. */
  ariaLabel?: string;
  /** Optional trigger layout class. Avoid replacing the shared trigger skin. */
  className?: string;
  /** Optional menu content layout class, usually min-width only. */
  contentClassName?: string;
  /** Controlled open state for callers that coordinate row/action menu state. */
  open?: boolean;
  /** Controlled open-state callback. */
  onOpenChange?: (open: boolean) => void;
};

/**
 * A shared overflow action menu for row, header, and tab-level commands.
 *
 * @component
 * @param {object} props - The props for the actions menu.
 * @param {ActionMenuItem[]} props.actions - Commands to render in menu order. Empty arrays render nothing.
 * @param {"start" | "center" | "end"} [props.align="end"] - Horizontal popover alignment relative to the trigger.
 * @param {string} [props.ariaLabel="Open actions"] - Accessible label for the icon-only trigger button.
 * @param {string} [props.className] - Optional trigger layout class. Avoid replacing the shared trigger skin.
 * @param {string} [props.contentClassName] - Optional menu content layout class, usually min-width only.
 * @param {boolean} [props.open] - Controlled open state for callers that coordinate row/action menu state.
 * @param {(open: boolean) => void} [props.onOpenChange] - Controlled open-state callback.
 * @returns {JSX.Element | null} The rendered actions menu component, or null if no actions provided.
 */
export function ActionsMenu({
  actions,
  align = "end",
  ariaLabel = "Open actions",
  className,
  contentClassName,
  onOpenChange,
  open: openProp,
}: ActionsMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [uploadActionOpen, setUploadActionOpen] = useState<string | null>(null);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  if (actions.length === 0) return null;

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={ariaLabel}
            className={cn(
              "h-8 w-8 shrink-0 rounded-md border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground",
              className
            )}
            type="button"
            variant="ghost"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className={cn("min-w-56 w-max p-2", contentClassName)}
        >
          {actions.map((action, index) => (
            <div
              className={cn(
                action.visibility === "mobile" && "md:hidden",
                action.visibility === "desktop" && "hidden md:block"
              )}
              key={`${action.label}-${index}`}
            >
              {action.separatorBefore ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                className="cursor-pointer gap-2 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium"
                disabled={action.disabled}
                variant={action.variant ?? "default"}
                onSelect={(event) => {
                  if (action.upload) {
                    event.preventDefault();
                    setUploadActionOpen(action.label);
                    setOpen(false);
                    return;
                  }
                  setOpen(false);
                  action.onSelect?.();
                }}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {actions
        .filter((action) => action.upload)
        .map((action) => (
          <FileUploadDialog
            key={action.label}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) setUploadActionOpen(null);
            }}
            onUpload={action.upload?.onUpload}
            open={uploadActionOpen === action.label}
            title={action.upload?.title ?? action.label}
          />
        ))}
    </>
  );
}
