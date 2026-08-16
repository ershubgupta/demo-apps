import {
  DEFAULT_COUNTRY_CODE,
  getLocaleForCountry,
  normalizeCountryCode,
  type CountryCode,
} from "@/i18n/config";

export function applyCountryLocaleHeaders(
  headers: Headers,
  countryCode: CountryCode | null | undefined
) {
  const resolvedCountryCode = normalizeCountryCode(countryCode);
  headers.set("x-country-code", resolvedCountryCode);
  headers.set("Accept-Language", getLocaleForCountry(resolvedCountryCode));
  return headers;
}

export function getDefaultCountryCode() {
  return DEFAULT_COUNTRY_CODE;
}
