import type { ReactNode } from "react";

import { AppField } from "@/components/app-field";
import { cn } from "@/lib/utils/cnName";

export type AppReadOnlyFieldProps = {
  /** Optional layout class applied to the field wrapper. */
  className?: string;
  /** Field label shown with the app-standard form label treatment. */
  label: ReactNode;
  /** Fallback content shown when the value is null or undefined. */
  placeholder?: ReactNode;
  /** Read-only value rendered as text, not as a focusable form control. */
  value?: ReactNode;
  /** Shows the shared required marker after the label. */
  required?: boolean;
  /** Optional class for the value text when a caller needs layout adjustment. */
  valueClassName?: string;
};

/**
 * App-standard display field for immutable values inside forms and drawers.
 *
 * AppReadOnlyField intentionally renders label + text instead of a disabled
 * input. It is for server-provided or calculated values that should be visible
 * in the same field rhythm as form controls, while remaining non-interactive:
 * the user cannot focus, select, copy, or edit it as an input control.
 *
 * Use this for catalog drawer metadata, computed prices, descriptions, and
 * other values that look like part of a form but are not editable fields. Use
 * AppInput, AppDropdown, DatePicker, or Combobox for interactive controls.
 *
 * @component
 * @param {AppReadOnlyFieldProps} props - Props for the read-only display field.
 * @param {ReactNode} props.label - Label rendered above the read-only value.
 * @param {ReactNode} [props.value] - Text or inline content displayed as the field value.
 * @param {ReactNode} [props.placeholder="-"] - Fallback content when value is null or undefined.
 * @param {string} [props.className] - Optional layout class applied to the wrapper.
 * @param {boolean} [props.required] - Shows the shared required marker after the label.
 * @param {string} [props.valueClassName] - Optional class applied to the value text.
 * @returns {JSX.Element} A labeled, non-focusable text value in app field layout.
 */
export function AppReadOnlyField({
  className,
  label,
  placeholder = "-",
  required,
  value,
  valueClassName,
}: AppReadOnlyFieldProps) {
  return (
    <AppField
      className={cn("min-w-0", className)}
      label={label}
      required={required}
    >
      <span
        className={cn(
          "block min-w-0 break-words text-sm font-medium text-foreground",
          valueClassName
        )}
      >
        {value ?? placeholder}
      </span>
    </AppField>
  );
}
