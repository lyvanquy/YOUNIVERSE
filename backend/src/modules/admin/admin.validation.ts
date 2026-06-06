import {
  CouponType,
  InventoryChangeType,
  OrderStatus,
  PaymentStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { z } from "zod";

const optionalText = z.string().trim().min(1).optional().nullable();
const money = z.coerce.number().positive("Amount must be positive");
const optionalMoney = z.coerce.number().min(0, "Amount must be non-negative").optional().nullable();
const positiveInt = z.coerce.number().int().min(1);
const optionalPositiveInt = z.coerce.number().int().min(1).optional().nullable();
const booleanQuery = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();
const optionalDate = z.coerce.date().optional().nullable();

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamsSchema = z.object({
  id: z.string().trim().min(1),
});

export const productIdParamsSchema = z.object({
  productId: z.string().trim().min(1),
});

export const adminOrderListQuerySchema = paginationQuerySchema.extend({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  search: z.string().trim().optional().default(""),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: optionalText,
  trackingCode: optionalText,
});

export const inventoryListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional().default(""),
  lowStock: booleanQuery,
});

export const inventoryAdjustSchema = z.object({
  type: z.union([
    z.literal(InventoryChangeType.IMPORT),
    z.literal(InventoryChangeType.EXPORT),
    z.literal(InventoryChangeType.ADJUSTMENT),
  ]),
  quantity: positiveInt,
  note: optionalText,
});

const couponObjectSchema = z.object({
  code: z.string().trim().min(1, "Code is required").transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1, "Name is required"),
  description: optionalText,
  type: z.nativeEnum(CouponType),
  value: money,
  minOrderAmount: optionalMoney,
  maxDiscountAmount: optionalMoney,
  usageLimit: optionalPositiveInt,
  usagePerUser: optionalPositiveInt,
  startsAt: optionalDate,
  endsAt: optionalDate,
  isActive: z.boolean().optional(),
});

export const createCouponSchema = couponObjectSchema
  .extend({
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => data.type !== CouponType.PERCENTAGE || data.value <= 100, {
    path: ["value"],
    message: "Percentage coupon value must be between 1 and 100",
  })
  .refine((data) => !data.startsAt || !data.endsAt || data.endsAt > data.startsAt, {
    path: ["endsAt"],
    message: "End date must be after start date",
  });

export const updateCouponSchema = couponObjectSchema.partial().refine(
  (data) => data.type !== CouponType.PERCENTAGE || data.value === undefined || data.value <= 100,
  {
    path: ["value"],
    message: "Percentage coupon value must be between 1 and 100",
  },
).refine(
  (data) => {
    if (data.startsAt && data.endsAt) {
      return data.endsAt > data.startsAt;
    }

    return true;
  },
  {
    path: ["endsAt"],
    message: "End date must be after start date",
  },
);

export const couponListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional().default(""),
  isActive: booleanQuery,
});

export const userListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional().default(""),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export type AdminOrderListQuery = z.infer<typeof adminOrderListQuerySchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type InventoryListQuery = z.infer<typeof inventoryListQuerySchema>;
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;
export type CouponListQuery = z.infer<typeof couponListQuerySchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
