import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_COUNTRY_CODE,
  getLocaleForCountry,
  normalizeCountryCode,
} from "./config";
import en from "../../messages/en.json";
import filPH from "../../messages/fil-PH.json";
import { applyCountryLocaleHeaders } from "@/lib/api/locale-headers";

describe("i18n helpers", () => {
  it("maps country codes to supported locales", () => {
    expect(getLocaleForCountry("TH")).toBe("th");
    expect(getLocaleForCountry("ph")).toBe("fil-PH");
    expect(getLocaleForCountry("GB")).toBe("en");
    expect(getLocaleForCountry(undefined)).toBe("en");
  });

  it("normalizes missing country code to the default country", () => {
    expect(normalizeCountryCode(" th ")).toBe("TH");
    expect(normalizeCountryCode("")).toBe(DEFAULT_COUNTRY_CODE);
    expect(normalizeCountryCode(null)).toBe(DEFAULT_COUNTRY_CODE);
  });

  it("keeps localized bundles merged with the English key structure", () => {
    expect(Object.keys(filPH.forms.catalog).sort()).toEqual(
      Object.keys(en.forms.catalog).sort()
    );
  });

  it("interpolates simple named values", () => {
    const t = createTranslator({
      locale: "en",
      messages: en,
    });

    expect(t("common.pagination.range", { from: 1, to: 10, total: 25 })).toBe(
      "Showing 1-10 of 25"
    );
  });

  it("applies backend country and language headers", () => {
    const headers = applyCountryLocaleHeaders(new Headers(), "PH");
    expect(headers.get("x-country-code")).toBe("PH");
    expect(headers.get("Accept-Language")).toBe("fil-PH");
  });
});
