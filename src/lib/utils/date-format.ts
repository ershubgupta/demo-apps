import { format, isValid, parse, parseISO } from "date-fns";

export const APP_DATE_QUERY_FORMAT = "yyyy-MM-dd";
export const APP_DATE_PLACEHOLDER = "dd/mm/yyyy";

const CATALOG_API_DATE_FORMAT = "dd-MMM-yyyy";
const FILTER_DISPLAY_DATE_FORMAT = "dd MMM yyyy";

/**
 * Parses a date value received from the API or local draft state.
 *
 * @param value - Date string, either ISO or `dd-MMM-yyyy`.
 * @returns A valid Date when parsing succeeds; otherwise undefined.
 */
export function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;

  const isoDate = parseISO(value);
  if (isValid(isoDate)) return isoDate;

  const displayDate = parse(value, CATALOG_API_DATE_FORMAT, new Date());
  return isValid(displayDate) ? displayDate : undefined;
}

/**
 * Converts an API/display date string to a timestamp for comparisons.
 *
 * @param value - Date string in ISO or `dd-MMM-yyyy` format.
 * @returns The date timestamp when parsing succeeds; otherwise undefined.
 */
export function parseDateToTime(value: string): number | undefined {
  return parseDate(value)?.getTime();
}

/**
 * Converts an input/query date string to a timestamp for API filters.
 *
 * @param value - Date string in `yyyy-MM-dd` query/input format.
 * @returns The timestamp for the local date.
 */
export function parseInputDate(value: string): number {
  return new Date(`${value}T00:00:00`).getTime();
}

/**
 * Formats an input/query date for filter chip display.
 *
 * @param value - Date string in `yyyy-MM-dd` query/input format.
 * @returns A user-facing date string such as `21 Jul 2026`.
 */
export function formatDateForDisplay(value: string): string {
  return format(new Date(`${value}T00:00:00`), FILTER_DISPLAY_DATE_FORMAT);
}

/**
 * Gets today at local midnight.
 *
 * @returns A Date set to the start of the current local day.
 */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Checks whether a date is before today.
 *
 * @param date - Date to compare against local midnight today.
 * @returns True when the date is before today; otherwise false.
 */
export function isBeforeToday(date: Date): boolean {
  return date < startOfToday();
}
