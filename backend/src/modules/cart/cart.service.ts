import {
  CartStatus,
  CouponType,
  Prisma,
  ProductStatus,
  type Product,
  type ProductVariant,
} from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { prisma } from "../../config/prisma";
import type { AddCartItemInput, ApplyCouponInput, MergeCartInput, UpdateCartItemInput } from "./cart.validation";

type CartIdentity = {
  userId?: string;
  sessionId?: string;
};

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_SUBTOTAL = 500000;

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          inventory: true,
        },
      },
      variant: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartInclude;
}>;

type CartItemWithProduct = CartWithItems["items"][number];

const decimalToNumber = (value: Prisma.Decimal | null): number | null => (value === null ? null : value.toNumber());

const getCartIdentityOrThrow = (identity: CartIdentity): CartIdentity => {
  if (identity.userId || identity.sessionId) {
    return identity;
  }

  throw new AppError("x-session-id is required for guest cart", HTTP_STATUS.BAD_REQUEST);
};

const getAvailableStock = (product: Pick<Product, "status"> & { inventory: { quantity: number } | null }, variant: ProductVariant | null): number => {
  if (product.status !== ProductStatus.ACTIVE) {
    return 0;
  }

  if (variant) {
    return variant.isActive ? variant.stock : 0;
  }

  return product.inventory?.quantity ?? 0;
};

const getUnitPrice = (item: CartItemWithProduct): number => {
  if (item.variant?.price) {
    return item.variant.price.toNumber();
  }

  return (item.product.salePrice ?? item.product.price).toNumber();
};

const getPrimaryImageUrl = (item: CartItemWithProduct): string | null =>
  item.product.images.find((image) => image.isPrimary)?.url ?? item.product.images[0]?.url ?? null;

const getCartWhere = (identity: CartIdentity): Prisma.CartWhereInput => {
  if (identity.userId) {
    return {
      userId: identity.userId,
      status: CartStatus.ACTIVE,
    };
  }

  return {
    sessionId: identity.sessionId,
    status: CartStatus.ACTIVE,
  };
};

const findActiveCart = (identity: CartIdentity) =>
  prisma.cart.findFirst({
    where: getCartWhere(identity),
    include: cartInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });

const getOrCreateActiveCart = async (identity: CartIdentity): Promise<CartWithItems> => {
  const cartIdentity = getCartIdentityOrThrow(identity);
  const existingCart = await findActiveCart(cartIdentity);

  if (existingCart) {
    return existingCart;
  }

  return prisma.cart.create({
    data: {
      userId: cartIdentity.userId,
      sessionId: cartIdentity.userId ? null : cartIdentity.sessionId,
      status: CartStatus.ACTIVE,
    },
    include: cartInclude,
  });
};

const getCartItemOrThrow = async (identity: CartIdentity, itemId: string) => {
  const cart = await getOrCreateActiveCart(identity);
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
    include: {
      product: {
        include: {
          inventory: true,
        },
      },
      variant: true,
    },
  });

  if (!item) {
    throw new AppError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  return {
    cart,
    item,
  };
};

const validateProductForCart = async (productId: string, variantId: string | null | undefined, quantity: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      inventory: true,
      variants: true,
    },
  });

  if (!product || product.status !== ProductStatus.ACTIVE) {
    throw new AppError("Product is not available", HTTP_STATUS.BAD_REQUEST);
  }

  const variant = variantId ? product.variants.find((item) => item.id === variantId) ?? null : null;

  if (variantId && !variant) {
    throw new AppError("Product variant not found", HTTP_STATUS.NOT_FOUND);
  }

  if (variant && !variant.isActive) {
    throw new AppError("Product variant is not available", HTTP_STATUS.BAD_REQUEST);
  }

  const availableStock = getAvailableStock(product, variant);

  if (quantity > availableStock) {
    throw new AppError("Stock not enough", HTTP_STATUS.BAD_REQUEST, [
      {
        field: "quantity",
        message: `Only ${availableStock} item(s) available`,
      },
    ]);
  }

  return {
    product,
    variant,
    availableStock,
  };
};

const validateCoupon = async (input: ApplyCouponInput, subtotal: number, userId?: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      code: input.code,
    },
  });

  if (!coupon || !coupon.isActive) {
    throw new AppError("Coupon is invalid", HTTP_STATUS.BAD_REQUEST);
  }

  const now = new Date();

  if (coupon.startsAt && coupon.startsAt > now) {
    throw new AppError("Coupon is not active yet", HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.endsAt && coupon.endsAt < now) {
    throw new AppError("Coupon expired", HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached", HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.minOrderAmount !== null && subtotal < coupon.minOrderAmount.toNumber()) {
    throw new AppError("Order amount does not meet coupon minimum", HTTP_STATUS.BAD_REQUEST);
  }

  if (userId && coupon.usagePerUser !== null) {
    const usedByUser = await prisma.couponUsage.count({
      where: {
        couponId: coupon.id,
        userId,
      },
    });

    if (usedByUser >= coupon.usagePerUser) {
      throw new AppError("Coupon usage per user reached", HTTP_STATUS.BAD_REQUEST);
    }
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (coupon.type === CouponType.PERCENTAGE) {
    discountAmount = (subtotal * coupon.value.toNumber()) / 100;

    if (coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount.toNumber());
    }
  }

  if (coupon.type === CouponType.FIXED_AMOUNT) {
    discountAmount = Math.min(coupon.value.toNumber(), subtotal);
  }

  if (coupon.type === CouponType.FREE_SHIPPING) {
    freeShipping = true;
  }

  return {
    id: coupon.id,
    code: coupon.code,
    name: coupon.name,
    type: coupon.type,
    value: coupon.value.toNumber(),
    discountAmount,
    freeShipping,
  };
};

const calculateCart = async (cart: CartWithItems, couponCode?: string, userId?: string) => {
  const items = cart.items.map((item) => {
    const unitPrice = getUnitPrice(item);
    const totalPrice = unitPrice * item.quantity;
    const availableStock = getAvailableStock(item.product, item.variant);

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      productSlug: item.product.slug,
      variantName: item.variant?.name ?? null,
      imageUrl: getPrimaryImageUrl(item),
      unitPrice,
      quantity: item.quantity,
      totalPrice,
      customText: item.customText,
      customData: item.customData,
      productStatus: item.product.status,
      availableStock,
      isAvailable: item.product.status === ProductStatus.ACTIVE && availableStock >= item.quantity,
    };
  });

  const subtotalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  const baseShippingFee = subtotalAmount === 0 || subtotalAmount >= FREE_SHIPPING_SUBTOTAL ? 0 : SHIPPING_FEE;
  const coupon = couponCode ? await validateCoupon({ code: couponCode }, subtotalAmount, userId) : null;
  const shippingFee = coupon?.freeShipping ? 0 : baseShippingFee;
  const discountAmount = coupon?.discountAmount ?? 0;
  const totalAmount = Math.max(subtotalAmount - discountAmount + shippingFee, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    sessionId: cart.sessionId,
    status: cart.status,
    items,
    coupon,
    subtotalAmount,
    discountAmount,
    shippingFee,
    totalAmount,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

export const getCart = async (identity: CartIdentity) => {
  const cart = await getOrCreateActiveCart(identity);

  return calculateCart(cart, undefined, identity.userId);
};

export const addCartItem = async (identity: CartIdentity, input: AddCartItemInput) => {
  const cart = await getOrCreateActiveCart(identity);
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: input.productId,
      variantId: input.variantId ?? null,
      customText: input.customText ?? null,
    },
  });

  const nextQuantity = (existingItem?.quantity ?? 0) + input.quantity;
  await validateProductForCart(input.productId, input.variantId, nextQuantity);

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: nextQuantity,
        customData: input.customData === undefined || input.customData === null ? undefined : (input.customData as Prisma.InputJsonValue),
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: input.productId,
        variantId: input.variantId ?? null,
        quantity: input.quantity,
        customText: input.customText ?? null,
        customData: input.customData === undefined || input.customData === null ? undefined : (input.customData as Prisma.InputJsonValue),
      },
    });
  }

  const updatedCart = await getOrCreateActiveCart(identity);

  return calculateCart(updatedCart, undefined, identity.userId);
};

export const updateCartItem = async (identity: CartIdentity, itemId: string, input: UpdateCartItemInput) => {
  const { item } = await getCartItemOrThrow(identity, itemId);

  await validateProductForCart(item.productId, item.variantId, input.quantity);

  await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity: input.quantity,
    },
  });

  const updatedCart = await getOrCreateActiveCart(identity);

  return calculateCart(updatedCart, undefined, identity.userId);
};

export const removeCartItem = async (identity: CartIdentity, itemId: string) => {
  await getCartItemOrThrow(identity, itemId);

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  const updatedCart = await getOrCreateActiveCart(identity);

  return calculateCart(updatedCart, undefined, identity.userId);
};

export const applyCoupon = async (identity: CartIdentity, input: ApplyCouponInput) => {
  const cart = await getOrCreateActiveCart(identity);

  return calculateCart(cart, input.code, identity.userId);
};

export const mergeCart = async (userId: string, input: MergeCartInput) => {
  const guestCart = await prisma.cart.findFirst({
    where: {
      sessionId: input.sessionId,
      status: CartStatus.ACTIVE,
    },
    include: cartInclude,
  });

  const userCart = await getOrCreateActiveCart({ userId });

  if (!guestCart || guestCart.items.length === 0) {
    return calculateCart(userCart, undefined, userId);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of guestCart.items) {
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
          customText: item.customText,
        },
      });

      const nextQuantity = (existingItem?.quantity ?? 0) + item.quantity;
      const availableStock = getAvailableStock(item.product, item.variant);

      if (item.product.status !== ProductStatus.ACTIVE || nextQuantity > availableStock) {
        continue;
      }

      if (existingItem) {
        await tx.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: nextQuantity,
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            customText: item.customText,
            customData: item.customData === null ? undefined : (item.customData as Prisma.InputJsonValue),
          },
        });
      }
    }

    await tx.cart.update({
      where: {
        id: guestCart.id,
      },
      data: {
        status: CartStatus.ABANDONED,
      },
    });
  });

  const updatedUserCart = await getOrCreateActiveCart({ userId });

  return calculateCart(updatedUserCart, undefined, userId);
};
