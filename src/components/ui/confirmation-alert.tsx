"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Visual intent variants for ConfirmationAlert.
 * Destructive should be used for irreversible or damaging operations.
 */
export type ConfirmationAlertVariant =
  "default" | "destructive" | "success" | "warning";

type ConfirmationAlertProps = {
  /** Optional icon rendered before the cancel label. Defaults to X. */
  cancelIcon?: ReactNode;
  /** Secondary/cancel button label. */
  cancelLabel?: string;
  /** Optional trigger element rendered through AlertDialogTrigger. */
  children?: ReactNode;
  /** Optional icon rendered before the confirm label. Defaults by variant. */
  confirmIcon?: ReactNode;
  /** Primary confirmation button label. */
  confirmLabel?: string;
  /** Body copy or rich detail explaining the consequence. */
  description?: ReactNode;
  /** Called when the user confirms the action. */
  onConfirm: () => void;
  /** Controlled open-state callback. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state. */
  open: boolean;
  /** Dialog width preset passed to AlertDialogContent. */
  size?: "sm" | "default" | "lg";
  /** Dialog title. */
  title?: ReactNode;
  /** Visual intent for icon and confirm action styling. */
  variant?: ConfirmationAlertVariant;
};

const actionVariant: Record<
  ConfirmationAlertVariant,
  "default" | "destructive"
> = {
  default: "default",
  destructive: "destructive",
  success: "default",
  warning: "default",
};

function getDefaultConfirmIcon(variant: ConfirmationAlertVariant) {
  if (variant === "destructive") return <Trash2 />;
  if (variant === "success") return <CheckCircle2 />;
  if (variant === "warning") return <TriangleAlert />;
  if (variant === "default") return <HelpCircle />;
  return <AlertCircle />;
}

/**
 * App confirmation dialog for destructive or important confirmation flows.
 * It standardizes the alert icon, title/body spacing, cancel/confirm footer, and
 * destructive styling so feature code only supplies copy and callbacks.
 */
export function ConfirmationAlert({
  cancelIcon,
  cancelLabel = "Cancel",
  children,
  confirmIcon,
  confirmLabel,
  description,
  onConfirm,
  onOpenChange,
  open,
  size = "default",
  title,
  variant = "default",
}: ConfirmationAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children ? (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <div className="space-y-2.5">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">
            {cancelIcon ?? <X />}
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            variant={actionVariant[variant]}
          >
            {confirmIcon ?? getDefaultConfirmIcon(variant)}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
