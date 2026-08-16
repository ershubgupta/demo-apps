import type { CountryCode } from "@/i18n/config";

export type CurrentUser = {
  id?: string;
  email?: string;
  name?: string;
  countryCode: CountryCode;
};
