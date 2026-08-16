"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cnName";

type AppErrorStateProps = {
  /** Optional wrapper layout class for placement in cards, panels, or pages. */
  className?: string;
  /** Supporting message under the title. */
  description?: ReactNode;
  /** Retry callback. When omitted, the retry button is hidden. */
  onRetry?: () => void;
  /** Retry button label. Defaults to Retry. */
  retryLabel?: string;
  /** Primary error message. */
  title: ReactNode;
};

/**
 * A consistent inline error state for failed queries or recoverable page sections.
 *
 * @component
 * @param {object} props - The props for the error state.
 * @param {string} [props.className] - Optional wrapper layout class for placement in cards, panels, or pages.
 * @param {ReactNode} [props.description] - Supporting message under the title.
 * @param {() => void} [props.onRetry] - Retry callback. When omitted, the retry button is hidden.
 * @param {string} [props.retryLabel="Retry"] - Retry button label.
 * @param {ReactNode} props.title - Primary error message.
 * @returns {JSX.Element} The rendered error state component.
 */
export function AppErrorState({
  className,
  description,
  onRetry,
  retryLabel,
  title,
}: AppErrorStateProps) {
  const t = useTranslations();
  const resolvedRetryLabel = retryLabel ?? t("common.actions.retry");

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-6 shadow-sm",
        className
      )}
      role="alert"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-destructive">{title}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button
          className="h-8 rounded-md px-3 text-xs font-semibold"
          onClick={onRetry}
          type="button"
          variant="destructive"
        >
          {resolvedRetryLabel}
        </Button>
      ) : null}
    </div>
  );
}
