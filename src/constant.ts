import { StatusEnum, type CatalogStatusOption } from "@/types/catalog";

export const TABLE_PAGE_SIZE = 10;
export const TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const POLL_INTERVAL_MS = 3000;
export const POLL_TIMEOUT_MS = 30000;

export const DEFAULT_LOCALE = "en" as const;
export const DEFAULT_COUNTRY_CODE = "US" as const;
export const SUPPORTED_LOCALES = ["en", "th", "fil-PH"] as const;
export const COUNTRY_LOCALE_MAP = {
  TH: "th",
  PH: "fil-PH",
} as const;

export const CATALOG_STATUS_OPTIONS: CatalogStatusOption[] = [
  { label: StatusEnum.Preview, value: StatusEnum.Preview },
  { label: StatusEnum.Approved, value: StatusEnum.Approved },
  { label: StatusEnum.Draft, value: StatusEnum.Draft },
  { label: StatusEnum.Active, value: StatusEnum.Active },
  { label: StatusEnum.Expired, value: StatusEnum.Expired },
];

export const STORE_OPTIONS = [
  { storeId: "1" },
  { storeId: "2" },
  { storeId: "3" },
  { storeId: "11" },
  { storeId: "12" },
  { storeId: "13" },
  { storeId: "111" },
  { storeId: "211" },
  { storeId: "311" },
  { storeId: "21" },
  { storeId: "22" },
  { storeId: "23" },
  { storeId: "212" },
  { storeId: "213" },
  { storeId: "2111" },
  { storeId: "2211" },
  { storeId: "2311" },
];
