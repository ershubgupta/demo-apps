import { getRequestConfig } from "next-intl/server";

import { getLocaleForCountry } from "./config";
import { getSessionCountryCode } from "@/lib/api/session-context";

export default getRequestConfig(async () => {
  const countryCode = await getSessionCountryCode().catch(() => null);
  const locale = getLocaleForCountry(countryCode);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
