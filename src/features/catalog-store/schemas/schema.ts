import { z } from "zod";

export const catalogStoreStatusSchema = z.enum([
  "Preview",
  "Approved",
  "Draft",
  "Active",
  "Expired",
  "Pending",
  "Rejected",
  "Inactive EOD",
  "Inactive Immediate",
]);

export const catalogStoreItemStatusSchema = z.enum([
  "ACTIVE",
  "DISCONTINUED",
  "INACTIVE",
]);

export const catalogStoreListParamsSchema = z.object({
  search: z.string().trim().optional(),
  mmid: z.string().trim().optional(),
  cvCode: z.string().trim().optional(),
  customerName: z.string().trim().optional(),
  itemNo: z.string().trim().optional(),
  itemDescription: z.string().trim().optional(),
  catalogType: z.string().trim().optional(),
  number: z.string().trim().optional(),
  revision: z.string().trim().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  priceStartDate: z.string().trim().optional(),
  priceEndDate: z.string().trim().optional(),
  store: z.string().trim().optional(),
  status: z
    .enum([
      "ALL",
      "Preview",
      "Approved",
      "Draft",
      "Active",
      "Expired",
      "Pending",
      "Rejected",
      "Inactive EOD",
      "Inactive Immediate",
    ])
    .optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export const catalogStoreSchema = z.object({
  id: z.string(),
  catalogType: z.string(),
  number: z.string(),
  revision: z.number(),
  mmid: z.string(),
  cvCode: z.string(),
  customerName: z.string(),
  itemNo: z.string(),
  itemDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  priceStartDate: z.string(),
  priceEndDate: z.string(),
  store: z.string(),
  status: catalogStoreStatusSchema,
});

export const catalogStoreListResponseSchema = z.object({
  items: z.array(catalogStoreSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export const catalogStoreItemListParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(200).optional(),
  search: z.string().trim().optional(),
  tier: z.string().trim().optional(),
  itemNo: z.string().trim().optional(),
  itemDescription: z.string().trim().optional(),
});

export const catalogStoreItemSchema = z.object({
  id: z.string(),
  priceSource: z.number(),
  department: z.number(),
  classNo: z.number(),
  itemNo: z.string(),
  itemDescription: z.string(),
  status: catalogStoreItemStatusSchema,
  regularPriceInVat: z.number(),
  catalogChargePercent: z.number(),
  charge: z.number(),
  shelfPriceInVatPlusCharge: z.number(),
  finalPriceInVat: z.number(),
  finalPriceExVat: z.number(),
  vat: z.number(),
  catalogTier: z.string(),
});

export const catalogStoreCustomerSchema = z.object({
  id: z.string(),
  cvCode: z.string(),
  mmid: z.string(),
  customerName: z.string(),
  catalogTier: z.string(),
  operationStore: z.string(),
});

export const catalogStoreDetailSchema = z.object({
  id: z.string(),
  status: catalogStoreStatusSchema,
  catalogType: z.string(),
  charge: z.number(),
  number: z.string(),
  revision: z.number(),
  storeMaster: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  priceStart: z.string(),
  priceEnd: z.string(),
  lastModifiedBy: z.string(),
  lastModifiedAt: z.string(),
  approvedAt: z.string().optional(),
  totalItems: z.number().int().nonnegative(),
  customers: z.array(catalogStoreCustomerSchema),
});

export const catalogStoreItemListResponseSchema = z.object({
  items: z.array(catalogStoreItemSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});
