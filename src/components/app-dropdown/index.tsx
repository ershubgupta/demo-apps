"use client";

import type { ComponentProps, ReactNode } from "react";

import { AppField } from "@/components/app-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cnName";

/** Option shown in AppDropdown's select menu. */
export type AppDropdownOption = {
  /** Prevents the option from being selected while keeping it visible. */
  disabled?: boolean;
  /** Reader-facing label shown in the trigger and menu item. */
  label: string;
  /** Stable value passed through Select's onValueChange callback. */
  value: string;
};

type AppDropdownProps = Omit<
  ComponentProps<typeof Select>,
  "children" | "onValueChange" | "value"
> & {
  /** Optional class for the popover content, usually width/layout only. */
  contentClassName?: string;
  /** Optional helper text shown below the dropdown. */
  description?: ReactNode;
  /** Validation error shown below the dropdown with app error styling. */
  error?: ReactNode;
  /** Marks the trigger invalid and lets the shared Select skin show error state. */
  invalid?: boolean;
  /** Reader-facing label shown above the dropdown when provided. */
  label?: ReactNode;
  /** Receives the selected option value. */
  onValueChange?: (value: string) => void;
  /** Options rendered as SelectItem children. */
  options: AppDropdownOption[];
  /** Placeholder shown when value is empty. */
  placeholder?: string;
  /** Optional trigger layout class. Avoid height/color/border overrides. */
  triggerClassName?: string;
  /** Controlled selected option value. */
  value?: string;
  /** Layout class for the generated field wrapper when label/description/error is used. */
  wrapperClassName?: string;
};

/**
 * App-skinned single-select dropdown for normal form/value selection.
 *
 * Pass `label` directly for ordinary labeled dropdown fields. Use the raw Select
 * primitives only when a custom composition is genuinely needed.
 */
export function AppDropdown({
  contentClassName,
  description,
  error,
  invalid,
  label,
  onValueChange,
  options,
  placeholder = "Select option",
  triggerClassName,
  value,
  wrapperClassName,
  ...props
}: AppDropdownProps) {
  const control = (
    <Select value={value} onValueChange={onValueChange} {...props}>
      <SelectTrigger
        aria-invalid={invalid || !!error || undefined}
        className={cn("bg-card", triggerClassName)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {options.map((option) => (
          <SelectItem
            disabled={option.disabled}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!label && !description && !error) return control;

  return (
    <AppField
      className={wrapperClassName}
      description={description}
      error={error}
      label={label}
    >
      {control}
    </AppField>
  );
}
