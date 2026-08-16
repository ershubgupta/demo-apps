"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ComponentProps, MouseEvent } from "react";

import { AppDropdown } from "@/components/app-dropdown";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";

type PopoverContentProps = ComponentProps<typeof PopoverContent>;

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2024, i, 1), "MMM")
);

const CURRENT_YEAR = new Date().getFullYear();

export type MonthPickerProps = {
  value?: Date;
  onChange: (date?: Date) => void;

  placeholder?: string;
  formatter?: (date: Date) => string;

  /**
   * Disable specific months.
   * The callback receives the first day of the month.
   */
  disabled?: (date: Date) => boolean;

  /**
   * Year range shown in the dropdown.
   */
  minYear?: number;
  maxYear?: number;

  className?: string;
  buttonClassName?: string;

  popoverContentProps?: PopoverContentProps;
};

/**
 * A reusable month picker component for selecting a month and year.
 *
 * @component
 * @param {object} props - The props for the month picker.
 * @param {Date} [props.value] - Selected month/year date.
 * @param {(date?: Date) => void} props.onChange - Called when selection changes.
 * @param {string} [props.placeholder="MMM yyyy"] - Placeholder shown when value is empty.
 * @param {(date: Date) => string} [props.formatter] - Custom display formatter.
 * @param {(date: Date) => boolean} [props.disabled] - Disable specific months (receives first day of month).
 * @param {number} [props.minYear=CURRENT_YEAR] - Minimum year in dropdown range.
 * @param {number} [props.maxYear=2100] - Maximum year in dropdown range.
 * @param {string} [props.className] - Optional layout class for the wrapper.
 * @param {string} [props.buttonClassName] - Optional layout class for the trigger button.
 * @param {PopoverContentProps} [props.popoverContentProps] - Additional props passed to the PopoverContent.
 * @returns {JSX.Element} The rendered month picker component.
 */
export function MonthPicker({
  value,
  onChange,
  placeholder = "MMM yyyy",
  formatter = (date) => format(date, "MMM yyyy"),
  disabled,
  minYear = CURRENT_YEAR,
  maxYear = 2100,
  className,
  buttonClassName,
  popoverContentProps,
}: MonthPickerProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const [year, setYear] = useState(value?.getFullYear() ?? CURRENT_YEAR);

  const displayValue = value ? formatter(value) : "";
  const selectedMonth = value?.getMonth();

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear]
  );

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onChange(undefined);
    setOpen(false);
  };

  return (
    <div className={className}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);

          if (next && value) {
            setYear(value.getFullYear());
          }
        }}
      >
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

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("common.actions.clearMonth")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <PopoverContent
          align="start"
          className="w-[200px] p-2.5"
          {...popoverContentProps}
        >
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              disabled={year <= minYear}
              onClick={() => setYear((y) => Math.max(minYear, y - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <AppDropdown
              value={String(year)}
              onValueChange={(value) => setYear(Number(value))}
              triggerClassName="flex-1"
              options={years.map((year) => ({
                label: String(year),
                value: String(year),
              }))}
            />

            <Button
              size="icon"
              variant="ghost"
              disabled={year >= maxYear}
              onClick={() => setYear((y) => Math.min(maxYear, y + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((month, index) => {
              const monthDate = new Date(year, index, 1);

              const isDisabled = disabled?.(monthDate) ?? false;

              const isSelected =
                selectedMonth === index && value?.getFullYear() === year;

              return (
                <Button
                  key={month}
                  type="button"
                  variant={isSelected ? "default" : "ghost"}
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;

                    onChange(monthDate);
                    setOpen(false);
                  }}
                >
                  {month}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
