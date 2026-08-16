import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cnName";

/**
 * Semantic app badge variants.
 * Use these instead of local color classes so catalog statuses, warnings, and
 * counts stay aligned with the shared token palette.
 */
export type AppBadgeVariant =
  "neutral" | "success" | "warning" | "danger" | "info" | "primary";

const variantClassName: Record<AppBadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-status-active/10 text-status-active",
  warning: "bg-status-draft/10 text-status-draft",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-status-approved/10 text-status-approved",
  primary: "bg-primary/10 text-primary",
};

const dotClassName: Record<AppBadgeVariant, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-status-active",
  warning: "bg-status-draft",
  danger: "bg-destructive",
  info: "bg-status-approved",
  primary: "bg-primary",
};

type AppBadgeProps = {
  /** Badge text or compact inline content. */
  children: ReactNode;
  /** Optional layout-only className; avoid replacing semantic colors here. */
  className?: string;
  /** Adds the small status dot before the badge content. */
  showDot?: boolean;
  /** Semantic color intent. Defaults to neutral. */
  variant?: AppBadgeVariant;
};

/**
 * A compact app status badge built on the shadcn Badge primitive.
 *
 * @component
 * @param {object} props - The props for the app badge.
 * @param {ReactNode} props.children - Badge text or compact inline content.
 * @param {string} [props.className] - Optional layout-only className; avoid replacing semantic colors here.
 * @param {boolean} [props.showDot=false] - Adds the small status dot before the badge content.
 * @param {"neutral" | "success" | "warning" | "danger" | "info" | "primary"} [props.variant="neutral"] - Semantic color intent.
 * @returns {JSX.Element} The rendered app badge component.
 */
export function AppBadge({
  children,
  className,
  showDot = false,
  variant = "neutral",
}: AppBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-auto min-h-5 gap-1.5 rounded-full px-2.5 py-1 font-semibold",
        variantClassName[variant],
        className
      )}
      variant="secondary"
    >
      {showDot ? (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotClassName[variant])}
        />
      ) : null}
      {children}
    </Badge>
  );
}
