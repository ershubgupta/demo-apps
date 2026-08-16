import type {
  ContractPrice,
  ContractPriceDetail,
  ContractPriceItem,
  ContractPriceItemListParams,
  ContractPriceItemListResponse,
  ContractPriceItemStatus,
  ContractPriceListParams,
  ContractPriceListResponse,
  CustomerOption,
  ContractPricePeriod,
  ContractPricePeriodListParams,
  ContractPricePeriodListResponse,
} from "@/features/contract-price/types";
import { StatusEnum } from "@/features/contract-price/types";
import { parseDateToTime, parseInputDate } from "@/lib/utils/date-format";

const CONTRACT_PRICE_TIERS = ["T1", "T5", "T10", "T15", "T20"] as const;
const CONTRACT_PRICE_ITEMS_TOTAL = 24;
const CONTRACT_PRICE_PERIODS_TOTAL = 5;

type ContractPriceItemSeed = {
  priceSource: number;
  department: number;
  classNo: number;
  itemNo: string;
  itemDescription: string;
  status: ContractPriceItemStatus;
  regularPriceInVat: number;
  catalogChargePercent: number;
  shelfPriceInVatPlusCharge: number;
  finalPriceInVat: number;
  finalPriceExVat: number;
  vat: number;
};

const mockItemSeeds: ContractPriceItemSeed[] = [
  {
    priceSource: 99,
    department: 16,
    classNo: 97,
    itemNo: "105300",
    itemDescription: "HPชาผงสำเร็จรูปเนสที ขวด85กรัม",
    status: "ACTIVE",
    regularPriceInVat: 160.0,
    catalogChargePercent: 6,
    shelfPriceInVatPlusCharge: 169.6,
    finalPriceInVat: 90.0,
    finalPriceExVat: 84.11,
    vat: 5.89,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "105336",
    itemDescription: "HPนอร์ตอลล์ สีดำต่อน1500บล.",
    status: "ACTIVE",
    regularPriceInVat: 150.0,
    catalogChargePercent: 6,
    shelfPriceInVatPlusCharge: 159.0,
    finalPriceInVat: 150.0,
    finalPriceExVat: 140.19,
    vat: 9.81,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "105577",
    itemDescription: "HPจูปกกนบดอร์ แอนดิที 505กรัม",
    status: "DISCONTINUED",
    regularPriceInVat: 37.0,
    catalogChargePercent: 6,
    shelfPriceInVatPlusCharge: 39.22,
    finalPriceInVat: 37.0,
    finalPriceExVat: 34.58,
    vat: 2.42,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "119918",
    itemDescription: "P-HPทองพัณคใฟถกซ์ รวด400ครัน*1",
    status: "ACTIVE",
    regularPriceInVat: 0.01,
    catalogChargePercent: 6,
    shelfPriceInVatPlusCharge: 0.01,
    finalPriceInVat: 0.01,
    finalPriceExVat: 0.01,
    vat: 0.0,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "141097",
    itemDescription: "HP แอกกรพา ไทดใ 100 กร้น",
    status: "ACTIVE",
    regularPriceInVat: 67.0,
    catalogChargePercent: 6,
    shelfPriceInVatPlusCharge: 71.02,
    finalPriceInVat: 67.0,
    finalPriceExVat: 62.62,
    vat: 4.38,
  },
];

const PERIOD_STATUSES = [
  StatusEnum.Pending,
  StatusEnum.Draft,
  StatusEnum.Approved,
  StatusEnum.Active,
  StatusEnum.Pending,
] as const;

const mockContractPrices: ContractPrice[] = [
  createContractPrice(
    1,
    "0058-SC-000013",
    "HO",
    "30-Jun-2026",
    "30-Jul-2026",
    "58",
    "SE001_01_UAT_ไทย CPAXT Procurement"
  ),
  createContractPrice(
    2,
    "0057-SC-000013",
    "B2B",
    "30-Jun-2026",
    "30-Jul-2026",
    "57",
    "qaadmin@gmail.com"
  ),
  createContractPrice(
    3,
    "0044-SC-000013",
    "SGM",
    "30-Jun-2026",
    "30-Jul-2026",
    "44",
    "catalog@nagarro.com"
  ),
  createContractPrice(
    4,
    "0043-SC-000013",
    "Other",
    "30-Jun-2026",
    "30-Jul-2026",
    "43",
    "SE001_01_UAT_ไทย CPAXT Procurement"
  ),
  createContractPrice(
    5,
    "0018-SC-000013",
    "HO",
    "30-Jun-2026",
    "30-Jul-2026",
    "38",
    "qaadmin@gmail.com"
  ),
  createContractPrice(
    6,
    "0017-SC-000013",
    "B2B",
    "30-Jun-2026",
    "30-Jul-2026",
    "37",
    "catalog@nagarro.com"
  ),
  createContractPrice(
    7,
    "0000-SC-000013",
    "SGM",
    "30-Jun-2026",
    "30-Jul-2026",
    "0",
    "SE001_01_UAT_ไทย CPAXT Procurement"
  ),
  createContractPrice(
    8,
    "0001-SC-000013",
    "Other",
    "30-Jun-2026",
    "30-Jul-2026",
    "1",
    "qaadmin@gmail.com"
  ),
  createContractPrice(
    9,
    "0500-SC-000013",
    "HO",
    "30-Jun-2026",
    "30-Jul-2026",
    "500",
    "catalog@nagarro.com"
  ),
  createContractPrice(
    10,
    "0074-SC-000013",
    "B2B",
    "30-Jun-2026",
    "30-Jul-2026",
    "74",
    "SE001_01_UAT_ไทย CPAXT Procurement"
  ),
  createContractPrice(
    11,
    "0014-SC-000012",
    "SGM",
    "15-Jul-2026",
    "15-Aug-2026",
    "14",
    "qaadmin@gmail.com"
  ),
  createContractPrice(
    12,
    "0009-SC-000011",
    "Other",
    "05-Jun-2026",
    "05-Aug-2026",
    "9",
    "catalog@nagarro.com"
  ),
  createContractPrice(
    13,
    "0022-SC-000010",
    "HO",
    "01-May-2026",
    "31-May-2026",
    "22",
    "SE001_01_UAT_ไทย CPAXT Procurement"
  ),
  createContractPrice(
    14,
    "0001-CTP26-000789",
    "SGM",
    "31-Jul-2026",
    "31-Aug-2026",
    "1",
    "SE001_01_UAT_ไทย CPAXTRA"
  ),
];

export async function listMockContractPrices(
  params: ContractPriceListParams = {}
): Promise<ContractPriceListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const search = normalize(params.search);
  const startDate = params.startDate
    ? parseInputDate(params.startDate)
    : undefined;
  const endDate = params.endDate ? parseInputDate(params.endDate) : undefined;

  const filtered = mockContractPrices.filter((contractPrice) => {
    return (
      matchesText(
        [
          contractPrice.number,
          contractPrice.type,
          contractPrice.cvCode,
          contractPrice.customerName,
          contractPrice.itemNo,
          contractPrice.itemDescription,
          contractPrice.store,
          contractPrice.requestedBy,
        ],
        search
      ) &&
      matchesField(contractPrice.itemNo, params.itemNo) &&
      matchesField(contractPrice.itemDescription, params.itemDescription) &&
      matchesField(contractPrice.cvCode, params.cvCode) &&
      matchesField(contractPrice.customerName, params.customerName) &&
      matchesField(contractPrice.number, params.number) &&
      matchesField(contractPrice.type, params.type) &&
      matchesField(contractPrice.store, params.store) &&
      matchesField(contractPrice.requestedBy, params.requestedBy) &&
      matchesDate(contractPrice.startDate, startDate) &&
      matchesDate(contractPrice.endDate, endDate)
    );
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    },
  };
}

/**
 * Resolves a contract price by id or catalog number (list links use number).
 */
export async function getMockContractPriceDetail(
  idOrNumber: string
): Promise<ContractPriceDetail | null> {
  const contract = mockContractPrices.find(
    (entry) => entry.id === idOrNumber || entry.number === idOrNumber
  );
  if (!contract) return null;

  if (contract.number === "0001-CTP26-000789") {
    return {
      id: contract.id,
      contractType: "SGM",
      charge: 0,
      number: contract.number,
      primaryStore: "1",
      storeOperation: "1, 57",
      cvCode: "0010667220",
      mmid: "00166722050101",
      customerName: "บจก. เทส",
      periodStart: "31-Jul-2026",
      periodEnd: "31-Aug-2026",
      lastModifiedBy: "SE001_01_UAT_ไทย CPAXTRA",
      lastModifiedAt: "22-Jul-2026 11:45",
      submittedBy: "SE001_01_UAT_ไทย CPAXTRA",
      submittedAt: "22-Jul-2026 11:45",
      totalPeriods: CONTRACT_PRICE_PERIODS_TOTAL,
      totalItems: CONTRACT_PRICE_ITEMS_TOTAL,
    };
  }

  return {
    id: contract.id,
    contractType: contract.type,
    charge: 0,
    number: contract.number,
    primaryStore: contract.store,
    storeOperation: contract.store,
    cvCode: contract.cvCode,
    mmid: `0016${String(672200000 + Number(contract.id.replace(/\D/g, "") || 1)).slice(-8)}`,
    customerName: contract.customerName,
    periodStart: contract.startDate,
    periodEnd: contract.endDate,
    lastModifiedBy: contract.requestedBy,
    lastModifiedAt: `${contract.startDate} 11:45`,
    submittedBy: contract.requestedBy,
    submittedAt: `${contract.startDate} 10:00`,
    totalPeriods: CONTRACT_PRICE_PERIODS_TOTAL,
    totalItems: CONTRACT_PRICE_ITEMS_TOTAL,
  };
}

export async function listMockContractPricePeriods(
  contractId: string,
  params: ContractPricePeriodListParams = {}
): Promise<ContractPricePeriodListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const startDate = params.startDate
    ? parseInputDate(params.startDate)
    : undefined;
  const endDate = params.endDate ? parseInputDate(params.endDate) : undefined;
  const statuses = params.status ?? [];

  const allPeriods = Array.from(
    { length: CONTRACT_PRICE_PERIODS_TOTAL },
    (_unused, index) => buildContractPricePeriod(contractId, index)
  );

  const filtered = allPeriods.filter((period) => {
    return (
      (statuses.length === 0 || statuses.includes(period.status)) &&
      matchesPeriodDateRange(
        period.startDate,
        period.endDate,
        startDate,
        endDate
      )
    );
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    },
  };
}

export async function listMockContractPriceItems(
  contractId: string,
  params: ContractPriceItemListParams = {}
): Promise<ContractPriceItemListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const search = normalize(params.search);
  const itemNo = params.itemNo;
  const itemDescription = params.itemDescription;
  const salesAtShelfPrice = params.salesAtShelfPrice;
  const approvedPriceInVat = params.approvedPriceInVat?.trim();

  const allItems: ContractPriceItem[] = Array.from(
    { length: CONTRACT_PRICE_ITEMS_TOTAL },
    (_unused, index) => buildContractPriceItem(contractId, index)
  );

  const filtered = allItems.filter((item) => {
    return (
      (search
        ? [item.itemNo, item.itemDescription, item.status].some((value) =>
            normalize(String(value)).includes(search)
          )
        : true) &&
      matchesField(item.itemNo, itemNo) &&
      matchesField(item.itemDescription, itemDescription) &&
      (salesAtShelfPrice
        ? item.salesAtShelfPrice === salesAtShelfPrice
        : true) &&
      matchesApprovedPrice(item.approvedPriceInVat, approvedPriceInVat)
    );
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    },
  };
}

function createContractPrice(
  id: number,
  number: string,
  type: string,
  startDate: string,
  endDate: string,
  store: string,
  requestedBy: string
): ContractPrice {
  return {
    id: `contract-price-${id}`,
    number,
    type,
    cvCode: `CV-${String(200 + id).padStart(4, "0")}`,
    customerName: `${["Nagarro Retail", "Siam Makro", "CP Axtra", "Fresh Buyer"][id % 4]} ${id}`,
    itemNo: `SKU-${String(3600 + id).padStart(5, "0")}`,
    itemDescription: `${["Rice", "Cooking oil", "Frozen food", "Beverage", "Bakery"][id % 5]} store assortment`,
    startDate,
    endDate,
    store,
    requestedBy,
  };
}

function buildContractPricePeriod(
  seed: string,
  index: number
): ContractPricePeriod {
  const startDay = 31 - index;
  const endDay = 30 - index;
  const status = PERIOD_STATUSES[index % PERIOD_STATUSES.length];
  const isApproved =
    status === StatusEnum.Approved || status === StatusEnum.Active;

  return {
    id: `${seed}-period-${index + 1}`,
    startDate: `${String(Math.max(1, startDay)).padStart(2, "0")}-Jul-2026`,
    endDate: `${String(Math.max(1, endDay)).padStart(2, "0")}-Aug-2026`,
    itemCount: 5 - (index % 3),
    requestedBy: "SE001_01_UAT_ไทย CPAXTRA",
    requestedAt: "22-Jul-2026 11:45",
    approvedBy: isApproved ? "approver.test.catalog+rsm1@gmail.com" : "",
    approvedAt: isApproved ? "23-Jul-2026 15:10" : "",
    status,
  };
}

function buildContractPriceItem(
  seed: string,
  index: number
): ContractPriceItem {
  const source = mockItemSeeds[index % mockItemSeeds.length];
  const period = buildContractPricePeriod(
    seed,
    index % CONTRACT_PRICE_PERIODS_TOTAL
  );
  const salesAtShelfOptions: Array<"Y" | "N" | null> = ["Y", "N", null];
  const normalGpPercent = Number((-61.4 + (index % 7) * 10.4).toFixed(2));
  const promoGpPercent = Number((108.66 - (index % 5) * 3.2).toFixed(2));
  const approvedPriceInVat = Number(
    (source.finalPriceInVat + (index % 3) * 50).toFixed(2)
  );

  return {
    ...source,
    id: `${seed}-item-${index + 1}`,
    charge: Number((source.regularPriceInVat * 0.06).toFixed(2)),
    catalogTier: CONTRACT_PRICE_TIERS[index % CONTRACT_PRICE_TIERS.length],
    periodStatus: period.status,
    periodStart: period.startDate,
    periodEnd: period.endDate,
    normalGpPercent,
    promoGpPercent,
    salesAtShelfPrice: salesAtShelfOptions[index % salesAtShelfOptions.length],
    approvedPriceInVat,
  };
}

function matchesField(value: string, filter?: string) {
  const normalized = normalize(filter);
  return normalized ? normalize(value).includes(normalized) : true;
}

function matchesApprovedPrice(value: number, filter?: string) {
  if (!filter) return true;
  if (String(value).includes(filter)) return true;
  const asNumber = Number(filter);
  return !Number.isNaN(asNumber) && value === asNumber;
}

function matchesText(values: string[], search?: string) {
  return search
    ? values.some((value) => normalize(value).includes(search))
    : true;
}

function matchesDate(value: string, filter?: number) {
  return filter ? parseDateToTime(value) === filter : true;
}

/** True when period start or end lies within the selected filter range (inclusive). */
function matchesPeriodDateRange(
  periodStart: string,
  periodEnd: string,
  rangeStart?: number,
  rangeEnd?: number
) {
  if (rangeStart === undefined && rangeEnd === undefined) return true;

  return (
    isDateInRange(periodStart, rangeStart, rangeEnd) ||
    isDateInRange(periodEnd, rangeStart, rangeEnd)
  );
}

function isDateInRange(value: string, rangeStart?: number, rangeEnd?: number) {
  const time = parseDateToTime(value);
  if (time === undefined) return false;
  if (rangeStart !== undefined && time < rangeStart) return false;
  if (rangeEnd !== undefined && time > rangeEnd) return false;
  return true;
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() || "";
}

export const CONTRACT_TYPE_OPTIONS = ["B2B", "SGM", "HO", "Other"];

export const CUSTOMER_SELECTION_TYPE_OPTIONS = ["Single", "Multi"];

export const CUSTOMER_OPTIONS: CustomerOption[] = [
  {
    id: "3-T2-0030751209",
    label: "3 - T2 - 0030751209 - Hello Sunny Home",
    charge: 3,
    primaryStore: 74,
    storeOperation: 74,
    cvCode: "0030751209",
    customerName: "Hello Sunny Home",
    tier: "T2",
  },
  {
    id: "11-T1-0110901326",
    label: "11 - T1 - 0110901326 - 24 healthy",
    charge: 11,
    primaryStore: 1,
    storeOperation: 12,
    cvCode: "0110901326",
    customerName: "24 healthy",
    tier: "T1",
  },
  {
    id: "11-T1-0110666444",
    label: "11 - T1 - 0110666444 - 24 bye",
    charge: 21,
    primaryStore: 121,
    storeOperation: 2002,
    cvCode: "0110666444",
    customerName: "24 bye",
    tier: "T1",
  },
];
