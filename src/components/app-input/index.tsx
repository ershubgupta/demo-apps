import type { ComponentProps, ReactNode } from "react";

import { AppField } from "@/components/app-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cnName";

export type AppInputProps = ComponentProps<typeof Input> & {
  /** Optional helper text shown below the input. */
  description?: ReactNode;
  /** Validation error shown below the input with app error styling. */
  error?: ReactNode;
  /** Reader-facing label shown above the input when provided. */
  label?: ReactNode;
  /** Icon/content rendered inside the input on the left. */
  leadingIcon?: ReactNode;
  /** Layout class for the generated field wrapper when label/description/error is used. */
  wrapperClassName?: string;
};

/**
 * App-level text input wrapper for ordinary labeled form fields.
 *
 * AppInput composes the base shadcn Input primitive with the catalog app field
 * structure. Use this component when a text field needs an app-standard label,
 * required marker, helper text, validation error, or leading icon. Use the
 * base Input from `@/components/ui/input` only for low-level composition where
 * the surrounding field structure is owned by another component.
 *
 * @component
 * @param {AppInputProps} props - Props for the app input wrapper.
 * @param {ReactNode} [props.label] - Optional label rendered above the input.
 * @param {ReactNode} [props.description] - Optional helper text rendered below the input.
 * @param {ReactNode} [props.error] - Optional validation error rendered below the input and used to mark the input invalid.
 * @param {ReactNode} [props.leadingIcon] - Optional icon/content rendered inside the input before the value.
 * @param {string} [props.wrapperClassName] - Layout class applied to the generated field wrapper.
 * @param {boolean} [props.disabled] - Makes the input unavailable for interaction and shows disabled visuals.
 * @returns {JSX.Element} The rendered app input field or bare input when no field chrome is requested.
 */
export function AppInput({
  className,
  description,
  error,
  id,
  label,
  leadingIcon,
  required,
  wrapperClassName,
  ...props
}: AppInputProps) {
  const invalid = !!error || props["aria-invalid"] || undefined;

  const input = (
    <Input
      id={id}
      {...props}
      required={required}
      aria-invalid={invalid}
      className={cn(leadingIcon && "pl-8", className)}
    />
  );

  const control = leadingIcon ? (
    <span className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground/70 [&>svg]:h-3.5 [&>svg]:w-3.5">
        {leadingIcon}
      </span>
      {input}
    </span>
  ) : (
    input
  );

  if (!label && !description && !error) return control;

  return (
    <AppField
      className={wrapperClassName}
      description={description}
      error={error}
      htmlFor={id}
      label={label}
      required={required}
    >
      {control}
    </AppField>
  );
}
