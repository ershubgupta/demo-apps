import {
  COUNTRY_LOCALE_MAP,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from "@/constant";

export {
  COUNTRY_LOCALE_MAP,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
};

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type CountryCode = "TH" | "PH" | string;

export function normalizeCountryCode(
  countryCode: CountryCode | null | undefined
) {
  return countryCode?.trim().toUpperCase() || DEFAULT_COUNTRY_CODE;
}

export function getLocaleForCountry(
  countryCode: CountryCode | null | undefined
): Locale {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const countryLocaleMap: Record<string, Locale> = COUNTRY_LOCALE_MAP;
  return countryLocaleMap[normalizedCountryCode] ?? DEFAULT_LOCALE;
}

export function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}
