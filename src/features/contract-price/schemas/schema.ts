import { z } from "zod";

import { StatusEnum } from "@/types/catalog";

export const contractPriceStatusSchema = z.nativeEnum(StatusEnum);

export const contractPriceItemStatusSchema = z.enum([
  "ACTIVE",
  "DISCONTINUED",
  "INACTIVE",
]);

export const contractPriceListParamsSchema = z.object({
  search: z.string().trim().optional(),
  itemNo: z.string().trim().optional(),
  itemDescription: z.string().trim().optional(),
  cvCode: z.string().trim().optional(),
  customerName: z.string().trim().optional(),
  number: z.string().trim().optional(),
  type: z.string().trim().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  store: z.string().trim().optional(),
  requestedBy: z.string().trim().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export const contractPriceSchema = z.object({
  id: z.string(),
  number: z.string(),
  type: z.string(),
  cvCode: z.string(),
  customerName: z.string(),
  itemNo: z.string(),
  itemDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  store: z.string(),
  requestedBy: z.string(),
});

export const contractPriceListResponseSchema = z.object({
  items: z.array(contractPriceSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export const contractPriceDetailSchema = z.object({
  id: z.string(),
  contractType: z.string(),
  charge: z.number(),
  number: z.string(),
  primaryStore: z.string(),
  storeOperation: z.string(),
  cvCode: z.string(),
  mmid: z.string(),
  customerName: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  lastModifiedBy: z.string(),
  lastModifiedAt: z.string(),
  submittedBy: z.string(),
  submittedAt: z.string(),
  totalPeriods: z.number().int().nonnegative(),
  totalItems: z.number().int().nonnegative(),
});

export const contractPricePeriodListParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  status: z.array(contractPriceStatusSchema).optional(),
});

export const contractPricePeriodSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  itemCount: z.number().int().nonnegative(),
  requestedBy: z.string(),
  requestedAt: z.string(),
  approvedBy: z.string(),
  approvedAt: z.string(),
  status: contractPriceStatusSchema,
});

export const contractPricePeriodListResponseSchema = z.object({
  items: z.array(contractPricePeriodSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export const contractPriceItemListParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(200).optional(),
  search: z.string().trim().optional(),
  itemNo: z.string().trim().optional(),
  itemDescription: z.string().trim().optional(),
  salesAtShelfPrice: z.enum(["Y", "N"]).optional(),
  approvedPriceInVat: z.string().trim().optional(),
});

export const contractPriceItemSchema = z.object({
  id: z.string(),
  priceSource: z.number(),
  department: z.number(),
  classNo: z.number(),
  itemNo: z.string(),
  itemDescription: z.string(),
  status: contractPriceItemStatusSchema,
  periodStatus: contractPriceStatusSchema,
  periodStart: z.string(),
  periodEnd: z.string(),
  normalGpPercent: z.number(),
  promoGpPercent: z.number(),
  salesAtShelfPrice: z.enum(["Y", "N"]).nullable(),
  approvedPriceInVat: z.number(),
  regularPriceInVat: z.number(),
  catalogChargePercent: z.number(),
  charge: z.number(),
  shelfPriceInVatPlusCharge: z.number(),
  finalPriceInVat: z.number(),
  finalPriceExVat: z.number(),
  vat: z.number(),
  catalogTier: z.string(),
});

export const contractPriceItemListResponseSchema = z.object({
  items: z.array(contractPriceItemSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});
