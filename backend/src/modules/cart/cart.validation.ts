import { z } from "zod";

export const cartItemParamsSchema = z.object({
  itemId: z.string().trim().min(1),
});

export const addCartItemSchema = z.object({
  productId: z.string().trim().min(1, "Product is required"),
  variantId: z.string().trim().min(1).optional().nullable(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  customText: z.string().trim().min(1).optional().nullable(),
  customData: z.unknown().optional().nullable(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const applyCouponSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required").transform((value) => value.toUpperCase()),
});

export const mergeCartSchema = z.object({
  sessionId: z.string().trim().min(1, "Session id is required"),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;
