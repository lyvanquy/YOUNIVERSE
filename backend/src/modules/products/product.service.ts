import { Prisma, ProductStatus } from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { createSlug } from "../../common/utils/slug";
import { prisma } from "../../config/prisma";
import type {
  AdminProductListQuery,
  CreateProductInput,
  PublicProductListQuery,
  UpdateProductInput,
} from "./product.validation";

const productInclude = {
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  inventory: true,
  variants: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

const toMoney = (value: Prisma.Decimal | null): number | null => (value === null ? null : value.toNumber());

const toVariantDto = (variant: ProductWithRelations["variants"][number]) => ({
  id: variant.id,
  name: variant.name,
  sku: variant.sku,
  price: variant.price ? variant.price.toNumber() : null,
  stock: variant.stock,
  isActive: variant.isActive,
  imageUrl: variant.imageUrl,
  imageAlt: variant.imageAlt,
  description: variant.description,
  group: variant.group,
  groupEmoji: variant.groupEmoji,
  sortOrder: variant.sortOrder,
});

const toProductDto = (product: ProductWithRelations) => ({
  id: product.id,
  categoryId: product.categoryId,
  category: product.category
    ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      }
    : null,
  name: product.name,
  slug: product.slug,
  productLine: product.productLine,
  badge: product.badge,
  shortDescription: product.shortDescription,
  description: product.description,
  price: toMoney(product.price),
  salePrice: toMoney(product.salePrice),
  sku: product.sku,
  status: product.status,
  isFeatured: product.isFeatured,
  allowCustomize: product.allowCustomize,
  sortOrder: product.sortOrder,
  metaTitle: product.metaTitle,
  metaDescription: product.metaDescription,
  images: product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
  })),
  variants: product.variants.map(toVariantDto),
  inventory: product.inventory
    ? {
        quantity: product.inventory.quantity,
        reservedQuantity: product.inventory.reservedQuantity,
        soldQuantity: product.inventory.soldQuantity,
        lowStockThreshold: product.inventory.lowStockThreshold,
      }
    : null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const buildOrderBy = (sort: PublicProductListQuery["sort"]): Prisma.ProductOrderByWithRelationInput => {
  if (sort === "price-low-high") {
    return {
      price: "asc",
    };
  }

  if (sort === "price-high-low") {
    return {
      price: "desc",
    };
  }

  return {
    createdAt: "desc",
  };
};

const buildWhere = (query: PublicProductListQuery | AdminProductListQuery, publicOnly: boolean): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (publicOnly) {
    where.status = ProductStatus.ACTIVE;
  } else if ("status" in query && query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        shortDescription: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        sku: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.line) {
    where.productLine = query.line;
  }

  if (query.category) {
    where.category = {
      slug: query.category,
    };
  }

  return where;
};

const getCategoryId = async (input: { categoryId?: string | null; categorySlug?: string | null }): Promise<string | null> => {
  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: input.categoryId,
      },
    });

    if (!category) {
      throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
    }

    return category.id;
  }

  if (input.categorySlug) {
    const category = await prisma.category.findUnique({
      where: {
        slug: input.categorySlug,
      },
    });

    if (!category) {
      throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
    }

    return category.id;
  }

  return null;
};

const replaceImages = async (
  tx: Prisma.TransactionClient,
  productId: string,
  images: NonNullable<CreateProductInput["images"]>,
) => {
  await tx.productImage.deleteMany({
    where: {
      productId,
    },
  });

  if (images.length === 0) {
    return;
  }

  await tx.productImage.createMany({
    data: images.map((image, index) => ({
      productId,
      url: image.url,
      alt: image.alt ?? null,
      sortOrder: image.sortOrder ?? index,
      isPrimary: image.isPrimary ?? index === 0,
    })),
  });
};

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AppError("Unique constraint violation", HTTP_STATUS.CONFLICT, {
      target: error.meta?.target,
    });
  }

  throw error;
};

export const listPublicProducts = async (query: PublicProductListQuery) => {
  const where = buildWhere(query, true);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: query.limit,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return {
    items: items.map(toProductDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const listFeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  return products.map(toProductDto);
};

export const getPublicProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: ProductStatus.ACTIVE,
    },
    include: productInclude,
  });

  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return toProductDto(product);
};

export const listAdminProducts = async (query: AdminProductListQuery) => {
  const where = buildWhere(query, false);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: query.limit,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return {
    items: items.map(toProductDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getAdminProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: productInclude,
  });

  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return toProductDto(product);
};

export const createProduct = async (input: CreateProductInput) => {
  const categoryId = await getCategoryId(input);
  const slug = input.slug ?? createSlug(input.name);

  try {
    const product = await prisma.$transaction(async (tx) => {
      const savedProduct = await tx.product.create({
        data: {
          categoryId,
          name: input.name,
          slug,
          productLine: input.productLine,
          badge: input.badge ?? null,
          shortDescription: input.shortDescription,
          description: input.description ?? null,
          price: input.price,
          salePrice: input.salePrice ?? null,
          sku: input.sku ?? null,
          status: input.status,
          isFeatured: input.isFeatured,
          allowCustomize: input.allowCustomize,
          metaTitle: input.metaTitle ?? null,
          metaDescription: input.metaDescription ?? null,
          inventory: {
            create: {
              quantity: input.stockQuantity,
              lowStockThreshold: input.lowStockThreshold,
            },
          },
        },
      });

      await replaceImages(tx, savedProduct.id, input.images);

      return tx.product.findUniqueOrThrow({
        where: {
          id: savedProduct.id,
        },
        include: productInclude,
      });
    });

    return toProductDto(product);
  } catch (error) {
    mapPrismaError(error);
    throw error;
  }
};

export const updateProduct = async (id: string, input: UpdateProductInput) => {
  const existingProduct = await getAdminProductById(id);

  if (input.salePrice !== null && input.salePrice !== undefined) {
    const effectivePrice = input.price ?? existingProduct.price;

    if (effectivePrice !== null && input.salePrice >= effectivePrice) {
      throw new AppError("Sale price must be less than price", HTTP_STATUS.UNPROCESSABLE_ENTITY, [
        {
          field: "salePrice",
          message: "Sale price must be less than price",
        },
      ]);
    }
  }

  const categoryId =
    input.categoryId !== undefined || input.categorySlug !== undefined
      ? await getCategoryId({
          categoryId: input.categoryId,
          categorySlug: input.categorySlug,
        })
      : undefined;

  try {
    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id,
        },
        data: {
          categoryId,
          name: input.name,
          slug: input.slug,
          productLine: input.productLine,
          badge: input.badge,
          shortDescription: input.shortDescription,
          description: input.description,
          price: input.price,
          salePrice: input.salePrice,
          sku: input.sku,
          status: input.status,
          isFeatured: input.isFeatured,
          allowCustomize: input.allowCustomize,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
        },
      });

      if (input.stockQuantity !== undefined || input.lowStockThreshold !== undefined) {
        await tx.inventory.upsert({
          where: {
            productId: id,
          },
          create: {
            productId: id,
            quantity: input.stockQuantity ?? 0,
            lowStockThreshold: input.lowStockThreshold ?? 5,
          },
          update: {
            quantity: input.stockQuantity,
            lowStockThreshold: input.lowStockThreshold,
          },
        });
      }

      if (input.images) {
        await replaceImages(tx, id, input.images);
      }

      return tx.product.findUniqueOrThrow({
        where: {
          id,
        },
        include: productInclude,
      });
    });

    return toProductDto(product);
  } catch (error) {
    mapPrismaError(error);
    throw error;
  }
};

export const archiveProduct = async (id: string) => {
  await getAdminProductById(id);

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      status: ProductStatus.ARCHIVED,
    },
    include: productInclude,
  });

  return toProductDto(product);
};

/* ─── Showcase API (public) ─── */

export const getShowcaseData = async () => {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    include: productInclude,
    orderBy: { sortOrder: "asc" },
  });

  return products.map(toProductDto);
};

/* ─── Variant CRUD (admin) ─── */

export const listVariants = async (productId: string) => {
  await getAdminProductById(productId);

  const variants = await prisma.productVariant.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  return variants.map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    price: v.price ? v.price.toNumber() : null,
    stock: v.stock,
    isActive: v.isActive,
    imageUrl: v.imageUrl,
    imageAlt: v.imageAlt,
    description: v.description,
    group: v.group,
    groupEmoji: v.groupEmoji,
    sortOrder: v.sortOrder,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));
};

export const createVariant = async (productId: string, input: {
  name: string;
  sku?: string | null;
  price?: number | null;
  stock?: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  description?: string | null;
  group?: string | null;
  groupEmoji?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) => {
  await getAdminProductById(productId);

  try {
    return await prisma.productVariant.create({
      data: {
        productId,
        name: input.name,
        sku: input.sku ?? null,
        price: input.price ?? null,
        stock: input.stock ?? 0,
        imageUrl: input.imageUrl ?? null,
        imageAlt: input.imageAlt ?? null,
        description: input.description ?? null,
        group: input.group ?? null,
        groupEmoji: input.groupEmoji ?? null,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
      },
    });
  } catch (error) {
    mapPrismaError(error);
    throw error;
  }
};

export const updateVariant = async (productId: string, variantId: string, input: {
  name?: string;
  sku?: string | null;
  price?: number | null;
  stock?: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  description?: string | null;
  group?: string | null;
  groupEmoji?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) => {
  await getAdminProductById(productId);

  const existing = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });

  if (!existing) {
    throw new AppError("Variant not found", HTTP_STATUS.NOT_FOUND);
  }

  try {
    return await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        name: input.name,
        sku: input.sku,
        price: input.price,
        stock: input.stock,
        imageUrl: input.imageUrl,
        imageAlt: input.imageAlt,
        description: input.description,
        group: input.group,
        groupEmoji: input.groupEmoji,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
    });
  } catch (error) {
    mapPrismaError(error);
    throw error;
  }
};

export const deleteVariant = async (productId: string, variantId: string) => {
  await getAdminProductById(productId);

  const existing = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });

  if (!existing) {
    throw new AppError("Variant not found", HTTP_STATUS.NOT_FOUND);
  }

  await prisma.productVariant.delete({
    where: { id: variantId },
  });
};
