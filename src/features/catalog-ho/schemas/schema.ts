import { z } from "zod";

export const catalogStatusSchema = z.enum([
  "Preview",
  "Approved",
  "Draft",
  "Active",
  "Expired",
]);

export const catalogItemStatusSchema = z.enum([
  "ACTIVE",
  "DISCONTINUED",
  "INACTIVE",
]);

export const catalogListParamsSchema = z.object({
  search: z.string().trim().optional(),
  mmid: z.string().trim().optional(),
  cvCode: z.string().trim().optional(),
  customerName: z.string().trim().optional(),
  itemNo: z.string().trim().optional(),
  itemDescription: z.string().trim().optional(),
  catalogType: z
    .array(z.enum(["Catalog_HO", "Contract_Price", "Catalog_Store"]))
    .optional(),
  subType: z.string().trim().optional(),
  buyerCode: z.string().trim().optional(),
  store: z.string().trim().optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
  status: z
    .enum(["ALL", "Preview", "Approved", "Draft", "Active", "Expired"])
    .optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export type CatalogListParamsInput = z.infer<typeof catalogListParamsSchema>;

export const catalogItemListParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(200).optional(),
  search: z.string().trim().optional(),
});

export type CatalogItemListParamsInput = z.infer<
  typeof catalogItemListParamsSchema
>;

export const catalogItemSchema = z.object({
  id: z.string(),
  priceSource: z.number(),
  department: z.number(),
  classNo: z.number(),
  itemNo: z.string(),
  itemDescription: z.string(),
  status: catalogItemStatusSchema,
  regularPriceInVat: z.number(),
  catalogChargePercent: z.number(),
  charge: z.number(),
  shelfPriceInVatPlusCharge: z.number(),
  finalPriceInVat: z.number(),
  finalPriceExVat: z.number(),
  vat: z.number(),
});

export const catalogCustomerSchema = z.object({
  id: z.string(),
  cvCode: z.string(),
  mmid: z.string(),
  customerName: z.string(),
  catalogTier: z.string(),
});

export const catalogDetailSchema = z.object({
  id: z.string(),
  status: catalogStatusSchema,
  catalogType: z.string(),
  charge: z.number(),
  number: z.string(),
  revision: z.number(),
  storeMasterAndPriceSequence: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  priceStart: z.string(),
  priceEnd: z.string(),
  lastModifiedBy: z.string(),
  lastModifiedAt: z.string(),
  approvedAt: z.string().optional(),
  totalItems: z.number().int().nonnegative(),
  customers: z.array(catalogCustomerSchema),
});

export const catalogItemListResponseSchema = z.object({
  items: z.array(catalogItemSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});
