import type {
  CatalogStore,
  CatalogStoreCustomer,
  CatalogStoreDetail,
  CatalogStoreItem,
  CatalogStoreItemListParams,
  CatalogStoreItemListResponse,
  CatalogStoreItemStatus,
  CatalogStoreListParams,
  CatalogStoreListResponse,
} from "@/features/catalog-store/types";
import { parseDateToTime, parseInputDate } from "@/lib/utils/date-format";

const CATALOG_STORE_TIERS = ["T1", "T5", "T10", "T15", "T20"] as const;
const CATALOG_STORE_ITEMS_TOTAL = 105;

type CatalogStoreItemSeed = {
  priceSource: number;
  department: number;
  classNo: number;
  itemNo: string;
  itemDescription: string;
  status: CatalogStoreItemStatus;
  regularPriceInVat: number;
  catalogChargePercent: number;
  shelfPriceInVatPlusCharge: number;
  finalPriceInVat: number;
  finalPriceExVat: number;
  vat: number;
};

const mockItemSeeds: CatalogStoreItemSeed[] = [
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

const mockCatalogStores: CatalogStore[] = [
  createCatalogStore(
    1,
    "0058-SC-000001",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "58",
    "Active"
  ),
  createCatalogStore(
    2,
    "0057-SC-000001",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "57",
    "Active"
  ),
  createCatalogStore(
    3,
    "0008-SC-000001",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "44",
    "Active"
  ),
  createCatalogStore(
    4,
    "0043-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "43",
    "Active"
  ),
  createCatalogStore(
    5,
    "0018-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "38",
    "Active"
  ),
  createCatalogStore(
    6,
    "0017-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "37",
    "Active"
  ),
  createCatalogStore(
    7,
    "0000-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "0",
    "Active"
  ),
  createCatalogStore(
    8,
    "0001-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "1",
    "Active"
  ),
  createCatalogStore(
    9,
    "0500-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "500",
    "Active"
  ),
  createCatalogStore(
    10,
    "0074-SC-000013",
    1,
    "30-Jun-2026",
    "30-Jul-2026",
    "30-Jun-2026",
    "30-Jul-2026",
    "74",
    "Active"
  ),
  createCatalogStore(
    11,
    "0014-SC-000012",
    2,
    "15-Jul-2026",
    "15-Aug-2026",
    "15-Jul-2026",
    "15-Aug-2026",
    "14",
    "Approved"
  ),
  createCatalogStore(
    12,
    "0009-SC-000011",
    1,
    "05-Jun-2026",
    "05-Aug-2026",
    "05-Jun-2026",
    "05-Aug-2026",
    "9",
    "Draft"
  ),
  createCatalogStore(
    13,
    "0022-SC-000010",
    3,
    "01-May-2026",
    "31-May-2026",
    "01-May-2026",
    "31-May-2026",
    "22",
    "Expired"
  ),
];

export async function listMockCatalogStores(
  params: CatalogStoreListParams = {}
): Promise<CatalogStoreListResponse> {
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

  const filtered = mockCatalogStores.filter((catalogStore) => {
    return (
      matchesText(
        [
          catalogStore.catalogType,
          catalogStore.number,
          catalogStore.revision.toString(),
          catalogStore.store,
          catalogStore.status,
          catalogStore.mmid,
          catalogStore.cvCode,
          catalogStore.customerName,
          catalogStore.itemNo,
          catalogStore.itemDescription,
        ],
        search
      ) &&
      matchesField(catalogStore.mmid, params.mmid) &&
      matchesField(catalogStore.cvCode, params.cvCode) &&
      matchesField(catalogStore.customerName, params.customerName) &&
      matchesField(catalogStore.itemNo, params.itemNo) &&
      matchesField(catalogStore.itemDescription, params.itemDescription) &&
      matchesField(catalogStore.catalogType, params.catalogType) &&
      matchesField(catalogStore.number, params.number) &&
      matchesField(catalogStore.revision.toString(), params.revision) &&
      matchesField(catalogStore.store, params.store) &&
      (status === "ALL" || catalogStore.status === status) &&
      matchesDate(catalogStore.startDate, startDate) &&
      matchesDate(catalogStore.endDate, endDate) &&
      matchesDate(catalogStore.priceStartDate, priceStartDate) &&
      matchesDate(catalogStore.priceEndDate, priceEndDate)
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

function createCatalogStore(
  id: number,
  number: string,
  revision: number,
  startDate: string,
  endDate: string,
  priceStartDate: string,
  priceEndDate: string,
  store: string,
  status: CatalogStore["status"]
): CatalogStore {
  return {
    id: `catalog-store-${id}`,
    catalogType: "Catalog Store",
    number,
    revision,
    mmid: `MMID-${String(6000 + id).padStart(5, "0")}`,
    cvCode: `CV-${String(200 + id).padStart(4, "0")}`,
    customerName: `${["Nagarro Retail", "Siam Makro", "CP Axtra", "Fresh Buyer"][id % 4]} ${id}`,
    itemNo: `SKU-${String(3600 + id).padStart(5, "0")}`,
    itemDescription: `${["Rice", "Cooking oil", "Frozen food", "Beverage", "Bakery"][id % 5]} store assortment`,
    startDate,
    endDate,
    priceStartDate,
    priceEndDate,
    store,
    status,
  };
}

function buildCatalogStoreCustomers(
  seed: string,
  store: string
): CatalogStoreCustomer[] {
  return [
    {
      id: `${seed}-cust-1`,
      cvCode: "CV-0100",
      mmid: "MMID-05000",
      customerName: "Siam Makro HQ",
      catalogTier: "T10",
      operationStore: store,
    },
    {
      id: `${seed}-cust-2`,
      cvCode: "CV-0104",
      mmid: "MMID-05004",
      customerName: "CP Axtra Retail",
      catalogTier: "T10",
      operationStore: store,
    },
    {
      id: `${seed}-cust-3`,
      cvCode: "CV-0112",
      mmid: "MMID-05012",
      customerName: "Fresh Buyer Central",
      catalogTier: "T5",
      operationStore: store,
    },
    {
      id: `${seed}-cust-4`,
      cvCode: "CV-0120",
      mmid: "MMID-05020",
      customerName: "Nagarro Wholesale",
      catalogTier: "T1",
      operationStore: store,
    },
  ];
}

function buildCatalogStoreItem(seed: string, index: number): CatalogStoreItem {
  const source = mockItemSeeds[index % mockItemSeeds.length];
  return {
    ...source,
    id: `${seed}-item-${index + 1}`,
    charge: Number((source.regularPriceInVat * 0.06).toFixed(2)),
    catalogTier: CATALOG_STORE_TIERS[index % CATALOG_STORE_TIERS.length],
  };
}

/**
 * Resolves a catalog store by id or catalog number (list links use number).
 */
export async function getMockCatalogStoreDetail(
  idOrNumber: string
): Promise<CatalogStoreDetail | null> {
  const catalog = mockCatalogStores.find(
    (entry) => entry.id === idOrNumber || entry.number === idOrNumber
  );
  if (!catalog) return null;

  return {
    id: catalog.id,
    status: catalog.status,
    catalogType: catalog.catalogType,
    charge: 6,
    number: catalog.number,
    revision: catalog.revision,
    storeMaster: catalog.store,
    periodStart: catalog.startDate,
    periodEnd: catalog.endDate,
    priceStart: catalog.priceStartDate,
    priceEnd: catalog.priceEndDate,
    lastModifiedBy: "apiuser",
    lastModifiedAt: `${catalog.startDate} 02:35`,
    approvedAt:
      catalog.status === "Active" || catalog.status === "Approved"
        ? `${catalog.startDate} 22:30`
        : undefined,
    totalItems: CATALOG_STORE_ITEMS_TOTAL,
    customers: buildCatalogStoreCustomers(catalog.id, catalog.store),
  };
}

export async function listMockCatalogStoreItems(
  catalogId: string,
  params: CatalogStoreItemListParams = {}
): Promise<CatalogStoreItemListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const search = normalize(params.search);
  const tier = normalize(params.tier);
  const itemNo = normalize(params.itemNo);
  const itemDescription = normalize(params.itemDescription);

  const allItems: CatalogStoreItem[] = Array.from(
    { length: CATALOG_STORE_ITEMS_TOTAL },
    (_unused, index) => buildCatalogStoreItem(catalogId, index)
  );

  const filtered = allItems.filter((item) => {
    const matchesSearch = search
      ? [item.itemNo, item.itemDescription, item.status].some((value) =>
          normalize(String(value)).includes(search)
        )
      : true;
    const matchesTier = tier ? normalize(item.catalogTier) === tier : true;
    const matchesItemNo = itemNo
      ? normalize(item.itemNo).includes(itemNo)
      : true;
    const matchesItemDescription = itemDescription
      ? normalize(item.itemDescription).includes(itemDescription)
      : true;
    return (
      matchesSearch && matchesTier && matchesItemNo && matchesItemDescription
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

function matchesField(value: string, filter?: string) {
  const normalized = normalize(filter);
  return normalized ? normalize(value).includes(normalized) : true;
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
