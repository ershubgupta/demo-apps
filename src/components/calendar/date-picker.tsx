"use client";

import { useState } from "react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { AppField } from "@/components/app-field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";

type PopoverContentProps = ComponentProps<typeof PopoverContent>;
type CalendarProps = ComponentProps<typeof Calendar>;

type CommonProps = {
  placeholder?: string;
  closeOnSelect?: boolean;
  className?: string;
  buttonClassName?: string;
  calendarProps?: Omit<CalendarProps, "mode" | "selected" | "onSelect">;
  popoverContentProps?: PopoverContentProps;
  description?: ReactNode;
  error?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  wrapperClassName?: string;
};

export type SingleDatePickerProps = CommonProps & {
  mode: "single";
  value?: Date;
  onChange: (date?: Date) => void;
  formatter?: (date: Date) => string;
};

export type RangeDatePickerProps = CommonProps & {
  mode: "range";
  value?: DateRange;
  onChange: (range?: DateRange) => void;
  formatter?: (range?: DateRange) => string;
};

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

/**
 * App-skinned date picker supporting single-date and date-range selection.
 *
 * Pass `label` directly for ordinary labeled date fields. Use AppField only
 * when composing a custom date control layout.
 */
export function DatePicker(props: DatePickerProps) {
  const {
    placeholder = "dd/MMM/yyyy",
    closeOnSelect = true,
    className,
    buttonClassName,
    calendarProps,
    popoverContentProps,
    description,
    error,
    label,
    required,
    wrapperClassName,
  } = props;

  const t = useTranslations();
  const [open, setOpen] = useState(false);

  let displayValue = "";

  if (props.mode === "single") {
    displayValue = props.value
      ? (props.formatter ?? ((date: Date) => format(date, "dd/MMM/yyyy")))(
          props.value
        )
      : "";
  } else {
    displayValue = (
      props.formatter ??
      ((range?: DateRange) => {
        if (!range?.from) return "";
        if (!range.to) return format(range.from, "dd/MMM/yyyy");
        return (
          format(range.from, "dd/MMM/yyyy") +
          " - " +
          format(range.to, "dd/MMM/yyyy")
        );
      })
    )(props.value);
  }

  const hasValue =
    props.mode === "single" ? !!props.value : !!props.value?.from;

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    props.onChange(undefined);
    setOpen(false);
  };

  const control = (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              className={cn(
                "h-9 w-full justify-start rounded-lg border border-input bg-card px-3 pr-8 text-left text-sm font-normal text-foreground shadow-xs hover:bg-card hover:border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                buttonClassName
              )}
            >
              <CalendarIcon className="mr-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span
                className={cn(
                  "flex-1 truncate",
                  displayValue ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {displayValue || placeholder}
              </span>
            </Button>
          </PopoverTrigger>

          {hasValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("common.actions.clearDate")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        <PopoverContent
          align="start"
          className="w-auto p-0"
          {...popoverContentProps}
        >
          {props.mode === "single" ? (
            <Calendar
              mode="single"
              selected={props.value}
              onSelect={(date) => {
                props.onChange(date);
                if (date && closeOnSelect) setOpen(false);
              }}
              modifiersClassNames={{
                today:
                  "bg-primary/10 text-primary font-semibold rounded-md hover:bg-primary/20",
                ...calendarProps?.modifiersClassNames,
              }}
              {...calendarProps}
            />
          ) : (
            <Calendar
              mode="range"
              selected={props.value}
              onSelect={(range) => {
                props.onChange(range);
                const isRangeComplete =
                  !!range?.from &&
                  !!range?.to &&
                  range.from.getTime() !== range.to.getTime();
                if (isRangeComplete && closeOnSelect) setOpen(false);
              }}
              modifiersClassNames={{
                today:
                  "bg-primary/10 text-primary font-semibold rounded-md hover:bg-primary/20",
                ...calendarProps?.modifiersClassNames,
              }}
              {...calendarProps}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );

  if (!label && !description && !error) return control;

  return (
    <AppField
      className={wrapperClassName}
      description={description}
      error={error}
      label={label}
      required={required}
    >
      {control}
    </AppField>
  );
}
