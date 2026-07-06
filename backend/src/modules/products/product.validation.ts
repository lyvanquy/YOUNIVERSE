import { ProductLine, ProductStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z.string().trim().min(1).optional().nullable();
const optionalSlug = z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug").optional();
const money = z.coerce.number().positive("Amount must be positive");
const nonNegativeInt = z.coerce.number().int().min(0);

export const publicProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().optional().default(""),
  line: z.nativeEnum(ProductLine).optional(),
  category: z.string().trim().min(1).optional(),
  sort: z.enum(["newest", "price-low-high", "price-high-low"]).default("newest"),
});

export const adminProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional().default(""),
  line: z.nativeEnum(ProductLine).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  sort: z.enum(["newest", "price-low-high", "price-high-low"]).default("newest"),
});

export const productSlugParamsSchema = z.object({
  slug: z.string().trim().min(1),
});

export const productIdParamsSchema = z.object({
  id: z.string().trim().min(1),
});

export const productImageInputSchema = z.object({
  url: z.string().trim().min(1),
  alt: z.string().trim().min(1).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

const productBaseSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: optionalSlug,
  categoryId: optionalText,
  categorySlug: optionalText,
  productLine: z.nativeEnum(ProductLine),
  badge: optionalText,
  shortDescription: z.string().trim().min(1, "Short description is required"),
  description: optionalText,
  price: money,
  salePrice: money.optional().nullable(),
  sku: optionalText,
  stockQuantity: nonNegativeInt.default(0),
  lowStockThreshold: nonNegativeInt.default(5),
  images: z.array(productImageInputSchema).optional().default([]),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  isFeatured: z.boolean().optional().default(false),
  allowCustomize: z.boolean().optional().default(false),
  metaTitle: optionalText,
  metaDescription: optionalText,
});

export const createProductSchema = productBaseSchema
  .refine((data) => data.salePrice === null || data.salePrice === undefined || data.salePrice < data.price, {
    path: ["salePrice"],
    message: "Sale price must be less than price",
  });

export const updateProductSchema = productBaseSchema.partial().refine(
  (data) => data.salePrice === null || data.salePrice === undefined || data.price === undefined || data.salePrice < data.price,
  {
    path: ["salePrice"],
    message: "Sale price must be less than price",
  },
);

export type PublicProductListQuery = z.infer<typeof publicProductListQuerySchema>;
export type AdminProductListQuery = z.infer<typeof adminProductListQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const variantIdParamsSchema = z.object({
  id: z.string().trim().min(1),
  variantId: z.string().trim().min(1),
});

export const createVariantSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  sku: optionalText,
  price: money.optional().nullable(),
  stock: nonNegativeInt.default(0),
  imageUrl: optionalText,
  imageAlt: optionalText,
  description: optionalText,
  group: optionalText,
  groupEmoji: optionalText,
  sortOrder: nonNegativeInt.default(0),
  isActive: z.boolean().default(true),
});

export const updateVariantSchema = createVariantSchema.partial();
