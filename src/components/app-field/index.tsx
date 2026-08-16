import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cnName";

export const appFieldLabelClassName =
  "block text-[11px] font-bold uppercase tracking-[0.03em] text-muted-foreground";

type AppFieldLabelProps = {
  /** Reader-facing label text or composed label content shown above the control. */
  children: ReactNode;
  /** Optional class for rare layout-only adjustments to the label. */
  className?: string;
  /** Connects the visible label with a form control id. */
  htmlFor?: string;
  /** Shows the shared required marker after the label. */
  required?: boolean;
};

/**
 * Standard app field label.
 *
 * AppFieldLabel owns the typography used by form labels across filters,
 * drawers, and reusable component examples. Use it when a field needs only the
 * label text, or use AppField when you also need the wrapper, help text, and
 * error text structure.
 */
export function AppFieldLabel({
  children,
  className,
  htmlFor,
  required,
}: AppFieldLabelProps) {
  const content = (
    <>
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </>
  );

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className={cn(appFieldLabelClassName, className)}
      >
        {content}
      </label>
    );
  }

  return (
    <span className={cn(appFieldLabelClassName, className)}>{content}</span>
  );
}

type AppFieldProps = {
  /** The form control or composed control block rendered below the label. */
  children: ReactNode;
  /** Layout class for the field wrapper. Keep this to spacing/grid concerns. */
  className?: string;
  /** Optional helper text shown between the control and error message. */
  description?: ReactNode;
  /** Validation error shown with shared error typography. */
  error?: ReactNode;
  /** Connects the label with a concrete input/select trigger id when available. */
  htmlFor?: string;
  /** Reader-facing label text or composed label content. Omit to hide the label row. */
  label?: ReactNode;
  /** Shows the shared required marker after the label. */
  required?: boolean;
};

/**
 * Standard vertical app form field wrapper.
 *
 * AppField is intentionally small: it standardizes the label, required marker,
 * control spacing, helper text, and validation error while allowing the caller
 * to pass any app-skinned control as children. Use it for text inputs,
 * dropdowns, comboboxes, date pickers, and read-only values so labels stay
 * consistent across filters, drawers, and storybook examples.
 */
export function AppField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  required,
}: AppFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <AppFieldLabel htmlFor={htmlFor} required={required}>
          {label}
        </AppFieldLabel>
      ) : null}
      {children}
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {error ? <p className="text-[10px] text-destructive">{error}</p> : null}
    </div>
  );
}
