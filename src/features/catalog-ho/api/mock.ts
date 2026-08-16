import type {
  Catalog,
  CatalogCustomer,
  CatalogDetail,
  CatalogItem,
  CatalogItemListParams,
  CatalogItemListResponse,
  CatalogListParams,
  CatalogListResponse,
  CatalogItemStatus,
} from "@/features/catalog-ho/types";
import { parseDateToTime, parseInputDate } from "@/lib/utils/date-format";

export type CatalogItemSeed = {
  priceSource: number;
  department: number;
  classNo: number;
  itemNo: string;
  itemDescription: string;
  status: CatalogItemStatus;
  regularPriceInVat: number;
  catalogChargePercent: number;
  shelfPriceInVatPlusCharge: number;
  finalPriceInVat: number;
  finalPriceExVat: number;
  vat: number;
};

export const mockItemSeeds: CatalogItemSeed[] = [
  {
    priceSource: 99,
    department: 16,
    classNo: 97,
    itemNo: "105300",
    itemDescription: "HPชาผงสำเร็จรูปเนสที ขวด85กรัม",
    status: "ACTIVE",
    regularPriceInVat: 160.0,
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 160.0,
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
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 150.0,
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
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 37.0,
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
    catalogChargePercent: 0,
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
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 67.0,
    finalPriceInVat: 67.0,
    finalPriceExVat: 62.62,
    vat: 4.38,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "148524",
    itemDescription: "HP M&K มีเดกลอชู้กที 500 กA1",
    status: "ACTIVE",
    regularPriceInVat: 37.0,
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 37.0,
    finalPriceInVat: 37.0,
    finalPriceExVat: 34.58,
    vat: 2.42,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "149195",
    itemDescription: "สินค้าจากผัดพลาดที 1",
    status: "ACTIVE",
    regularPriceInVat: 937.0,
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 937.0,
    finalPriceInVat: 937.0,
    finalPriceExVat: 875.7,
    vat: 61.3,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "149196",
    itemDescription: "สินค้าจากผัดพลาดที 2",
    status: "ACTIVE",
    regularPriceInVat: 1597.0,
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 1597.0,
    finalPriceInVat: 1597.0,
    finalPriceExVat: 1492.52,
    vat: 104.48,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "149198",
    itemDescription: "สินค้าจากผัดพลาดที 3",
    status: "ACTIVE",
    regularPriceInVat: 3257.0,
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 3257.0,
    finalPriceInVat: 3257.0,
    finalPriceExVat: 3043.93,
    vat: 213.07,
  },
  {
    priceSource: 1,
    department: 16,
    classNo: 97,
    itemNo: "156036",
    itemDescription: "LP-15 (2011)",
    status: "ACTIVE",
    regularPriceInVat: 247.0,
    catalogChargePercent: 0,
    shelfPriceInVatPlusCharge: 247.0,
    finalPriceInVat: 247.0,
    finalPriceExVat: 230.84,
    vat: 16.16,
  },
];

const mockCatalogs: Catalog[] = [
  createCatalog(
    1,
    "Catalog_HO",
    "0000-H00C-000013",
    0,
    0,
    "09-Jul-2026",
    "31-Jul-2026",
    "09-Jul-2026",
    "31-Jul-2026",
    "1 : 10",
    "Preview"
  ),
  createCatalog(
    2,
    "Catalog_HO",
    "0000-H09C-000001",
    1,
    9,
    "01-Aug-2026",
    "31-Aug-2026",
    "01-Aug-2026",
    "31-Aug-2026",
    "1 : 1, 2 : 13, 3 : 7",
    "Approved"
  ),
  createCatalog(
    3,
    "Catalog_HO",
    "0000-H02C-000001",
    0,
    2,
    "01-Aug-2026",
    "31-Aug-2026",
    "01-Aug-2026",
    "31-Aug-2026",
    "1 : 3, 2 : 9",
    "Draft"
  ),
  createCatalog(
    4,
    "Catalog_HO",
    "0000-H00C-000011",
    6,
    0,
    "03-Jul-2026",
    "31-Jul-2026",
    "03-Jul-2026",
    "31-Jul-2026",
    "1 : 1, 2 : 13, 3 : 7",
    "Active"
  ),
  createCatalog(
    5,
    "Catalog_HO",
    "0000-H00C-000010",
    0,
    0,
    "24-Jun-2026",
    "29-Jun-2026",
    "24-Jun-2026",
    "29-Jun-2026",
    "1 : 10",
    "Expired"
  ),
  createCatalog(
    6,
    "Catalog_HO",
    "0000-H03C-000003",
    1000,
    3,
    "01-Mar-2026",
    "30-Dec-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "1, 8, 17, 57, 58, 74",
    "Approved"
  ),
  createCatalog(
    7,
    "Catalog_HO",
    "0000-H00C-000062",
    1000,
    0,
    "31-Oct-2025",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "1",
    "Approved"
  ),
  createCatalog(
    8,
    "Catalog_HO",
    "0000-H03C-000034",
    1000,
    3,
    "03-Nov-2025",
    "29-Nov-2030",
    "30-Jun-2026",
    "30-Jul-2026",
    "1, 8, 17, 58, 74",
    "Approved"
  ),
  createCatalog(
    9,
    "Catalog_HO",
    "0000-H00C-000009",
    0,
    0,
    "26-May-2026",
    "31-Jul-2026",
    "26-May-2026",
    "31-May-2026",
    "1 : 4",
    "Expired"
  ),
  createCatalog(
    10,
    "Catalog_HO",
    "0000-H00C-000063",
    1000,
    0,
    "31-Oct-2025",
    "29-Jun-2026",
    "31-May-2026",
    "29-Jun-2026",
    "1",
    "Approved"
  ),
  createCatalog(
    11,
    "Catalog_HO",
    "0000-S14C-000087",
    2,
    4,
    "15-Jul-2026",
    "15-Aug-2026",
    "15-Jul-2026",
    "15-Aug-2026",
    "14, 19, 22",
    "Draft"
  ),
  createCatalog(
    12,
    "Catalog_HO",
    "0000-CV22-000018",
    3,
    0,
    "01-Jul-2026",
    "31-Dec-2026",
    "01-Jul-2026",
    "31-Dec-2026",
    "All stores",
    "Active"
  ),
  createCatalog(
    13,
    "Catalog_HO",
    "0000-H07C-000044",
    1,
    6,
    "10-Jul-2026",
    "10-Sep-2026",
    "10-Jul-2026",
    "10-Sep-2026",
    "3, 7, 12, 21",
    "Preview"
  ),
  createCatalog(
    14,
    "Catalog_HO",
    "0000-S09C-000031",
    4,
    1,
    "05-Jun-2026",
    "05-Aug-2026",
    "05-Jun-2026",
    "05-Aug-2026",
    "9 : 2, 10 : 4",
    "Approved"
  ),
  createCatalog(
    15,
    "Catalog_HO",
    "0000-CV08-000026",
    0,
    0,
    "01-Jan-2026",
    "30-Jun-2026",
    "01-Jan-2026",
    "30-Jun-2026",
    "1, 2, 5, 8",
    "Expired"
  ),
  createCatalog(
    16,
    "Catalog_HO",
    "0000-H11C-000072",
    8,
    5,
    "20-Jul-2026",
    "20-Oct-2026",
    "20-Jul-2026",
    "20-Oct-2026",
    "1, 4, 8, 17, 57",
    "Active"
  ),
  createCatalog(
    17,
    "Catalog_Store",
    "0058-SC-000001",
    0,
    0,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "58",
    "Active"
  ),
  createCatalog(
    18,
    "Catalog_Store",
    "0057-SC-000001",
    0,
    0,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "57",
    "Approved"
  ),
  createCatalog(
    19,
    "Catalog_Store",
    "0008-SC-000001",
    0,
    0,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "8",
    "Expired"
  ),
];

export async function listMockCatalogs(
  params: CatalogListParams = {}
): Promise<CatalogListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const search = normalize(params.search);
  const status = params.status ?? "ALL";
  const startDate = params.startDate
    ? parseInputDate(params.startDate)
    : undefined;
  const endDate = params.endDate ? parseInputDate(params.endDate) : undefined;
  const priceStartDate = params.priceStartDate
    ? parseInputDate(params.priceStartDate)
    : undefined;
  const priceEndDate = params.priceEndDate
    ? parseInputDate(params.priceEndDate)
    : undefined;

  const filtered = mockCatalogs.filter((catalog) => {
    return (
      matchesText(
        [
          catalog.catalogType,
          catalog.number,
          catalog.revision.toString(),
          catalog.store,
          catalog.status,
          catalog.mmid,
          catalog.cvCode,
          catalog.customerName,
          catalog.itemNo,
          catalog.itemDescription,
        ],
        search
      ) &&
      matchesField(catalog.mmid, params.mmid) &&
      matchesField(catalog.cvCode, params.cvCode) &&
      matchesField(catalog.customerName, params.customerName) &&
      matchesField(catalog.itemNo, params.itemNo) &&
      matchesField(catalog.itemDescription, params.itemDescription) &&
      matchesCatalogTypes(catalog.catalogType, params.catalogType) &&
      matchesField(catalog.number, params.number) &&
      matchesField(catalog.revision.toString(), params?.revision?.toString()) &&
      matchesField(catalog.store, params.store) &&
      (status === "ALL" || catalog.status === status) &&
      matchesDate(catalog.startDate, startDate) &&
      matchesDate(catalog.endDate, endDate) &&
      matchesDate(catalog.priceStartDate, priceStartDate) &&
      matchesDate(catalog.priceEndDate, priceEndDate)
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

const CATALOG_ITEMS_TOTAL = 291;

const catalogDetailByNumber: Record<string, Partial<CatalogDetail>> = {
  "0000-H00C-000011": {
    lastModifiedBy: "se074_05_uat@cpaxtra.co.th",
    lastModifiedAt: "03-Jul-2026 14:24",
    approvedAt: "03-Jul-2026 16:38",
    storeMasterAndPriceSequence: "1 : 1, 2 : 13, 3 : 7",
  },
};

function buildCatalogCustomers(seed: string): CatalogCustomer[] {
  return [
    {
      id: `${seed}-cust-1`,
      cvCode: "CV-0100",
      mmid: "MMID-05000",
      customerName: "Siam Makro HQ",
      catalogTier: "Wholesale",
    },
    {
      id: `${seed}-cust-2`,
      cvCode: "CV-0104",
      mmid: "MMID-05004",
      customerName: "CP Axtra Retail",
      catalogTier: "Modern trade",
    },
  ];
}

function buildCatalogItem(seed: string, index: number): CatalogItem {
  const source = mockItemSeeds[index % mockItemSeeds.length];
  return {
    ...source,
    id: `${seed}-item-${index + 1}`,
    charge: 0,
  };
}

export async function getMockCatalogDetail(
  id: string
): Promise<CatalogDetail | null> {
  const catalog = mockCatalogs.find((entry) => entry.id === id);
  if (!catalog) return null;
  const overrides = catalogDetailByNumber[catalog.number] ?? {};

  return {
    id: catalog.id,
    status: catalog.status,
    catalogType: catalog.catalogType,
    charge: catalog.charge,
    number: catalog.number,
    revision: catalog.revision,
    storeMasterAndPriceSequence:
      overrides.storeMasterAndPriceSequence ?? catalog.store,
    periodStart: catalog.startDate,
    periodEnd: catalog.endDate,
    priceStart: catalog.priceStartDate,
    priceEnd: catalog.priceEndDate,
    lastModifiedBy: overrides.lastModifiedBy ?? "se074_05_uat@cpaxtra.co.th",
    lastModifiedAt: overrides.lastModifiedAt ?? `${catalog.startDate} 14:24`,
    approvedAt:
      overrides.approvedAt ??
      (catalog.status === "Active" || catalog.status === "Approved"
        ? `${catalog.startDate} 16:38`
        : undefined),
    totalItems: CATALOG_ITEMS_TOTAL,
    customers: buildCatalogCustomers(catalog.id),
  };
}

export async function listMockCatalogItems(
  catalogId: string,
  params: CatalogItemListParams = {}
): Promise<CatalogItemListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const search = normalize(params.search);

  const allItems: CatalogItem[] = Array.from(
    { length: CATALOG_ITEMS_TOTAL },
    (_unused, index) => buildCatalogItem(catalogId, index)
  );

  const filtered = search
    ? allItems.filter((item) =>
        [item.itemNo, item.itemDescription, item.status].some((value) =>
          normalize(String(value)).includes(search)
        )
      )
    : allItems;

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

function createCatalog(
  id: number,
  catalogType: Catalog["catalogType"],
  number: string,
  revision: number,
  charge: number,
  startDate: string,
  endDate: string,
  priceStartDate: string,
  priceEndDate: string,
  store: string,
  status: Catalog["status"]
): Catalog {
  return {
    id: `cat-${id}`,
    catalogType,
    number,
    mmid: `MMID-${String(5000 + id).padStart(5, "0")}`,
    cvCode: `CV-${String(100 + id).padStart(4, "0")}`,
    customerName: `${["Siam Makro", "Nagarro Retail", "Fresh Buyer", "CP Axtra"][id % 4]} ${id}`,
    itemNo: `SKU-${String(2600 + id).padStart(5, "0")}`,
    itemDescription: `${["Rice", "Cooking oil", "Frozen food", "Beverage", "Bakery"][id % 5]} assortment`,
    revision,
    charge,
    startDate,
    endDate,
    priceStartDate,
    priceEndDate,
    store,
    status,
  };
}

function matchesField(value: string, filter?: string) {
  const normalized = normalize(filter);
  return normalized ? normalize(value).includes(normalized) : true;
}

function matchesCatalogTypes(value: string, filter?: readonly string[]) {
  if (!filter?.length) return true;
  return filter.some((entry) => normalize(value) === normalize(entry));
}

function matchesText(values: string[], search?: string) {
  return search
    ? values.some((value) => normalize(value).includes(search))
    : true;
}

function matchesDate(value: string, filter?: number) {
  return filter ? parseDateToTime(value) === filter : true;
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() || "";
}
