import {
  CartStatus,
  CouponType,
  InventoryChangeType,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { prisma } from "../../config/prisma";
import * as emailService from "../emails/email.service";
import * as paymentService from "../payments/payment.service";
import * as settingsService from "../settings/settings.service";
import type { CheckoutInput } from "./checkout.validation";

type CheckoutIdentity = {
  userId?: string;
  sessionId?: string;
};

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_SUBTOTAL = 500000;

const checkoutCartInclude = {
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

type CheckoutCart = Prisma.CartGetPayload<{
  include: typeof checkoutCartInclude;
}>;

type CheckoutCartItem = CheckoutCart["items"][number];

type CheckoutLineItem = {
  cartItemId: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  customText: string | null;
  customData: Prisma.JsonValue | null;
  inventoryId: string;
};

const getSessionScopedWhere = (input: CheckoutInput, identity: CheckoutIdentity): Prisma.CartWhereInput => {
  if (identity.userId && identity.sessionId) {
    return {
      id: input.cartId,
      status: CartStatus.ACTIVE,
      OR: [
        { userId: identity.userId },
        { sessionId: identity.sessionId },
      ],
    };
  }

  if (identity.userId) {
    return {
      id: input.cartId,
      userId: identity.userId,
      status: CartStatus.ACTIVE,
    };
  }

  if (identity.sessionId) {
    return {
      id: input.cartId,
      sessionId: identity.sessionId,
      status: CartStatus.ACTIVE,
    };
  }

  throw new AppError("x-session-id is required for guest checkout", HTTP_STATUS.BAD_REQUEST);
};

const getPrimaryImageUrl = (item: CheckoutCartItem): string | null =>
  item.product.images.find((image) => image.isPrimary)?.url ?? item.product.images[0]?.url ?? null;

const getUnitPrice = (item: CheckoutCartItem): number => {
  if (item.variant?.price) {
    return item.variant.price.toNumber();
  }

  return (item.product.salePrice ?? item.product.price).toNumber();
};

const getAvailableStock = (item: CheckoutCartItem): number => {
  if (item.product.status !== ProductStatus.ACTIVE) {
    return 0;
  }

  if (item.variant) {
    return item.variant.isActive ? item.variant.stock : 0;
  }

  return item.product.inventory?.quantity ?? 0;
};

const buildShippingAddress = (input: CheckoutInput): string =>
  [input.shipping.addressLine, input.shipping.ward, input.shipping.district, input.shipping.province]
    .filter(Boolean)
    .join(", ");

const createOrderCode = (): string => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `YOU-${date}-${suffix}`;
};

const getCheckoutCart = async (input: CheckoutInput, identity: CheckoutIdentity): Promise<CheckoutCart> => {
  const cart = await prisma.cart.findFirst({
    where: getSessionScopedWhere(input, identity),
    include: checkoutCartInclude,
  });

  if (!cart) {
    throw new AppError("Cart not found", HTTP_STATUS.NOT_FOUND);
  }

  return cart;
};

const validateCoupon = async (couponCode: string | null | undefined, subtotal: number, userId?: string) => {
  if (!couponCode) {
    return null;
  }

  const coupon = await prisma.coupon.findUnique({
    where: {
      code: couponCode,
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
    discountAmount,
    freeShipping,
  };
};

const buildCheckoutPreview = async (input: CheckoutInput, identity: CheckoutIdentity) => {
  const cart = await getCheckoutCart(input, identity);

  if (cart.items.length === 0) {
    throw new AppError("Cart is empty", HTTP_STATUS.BAD_REQUEST);
  }

  const items: CheckoutLineItem[] = cart.items.map((item) => {
    const availableStock = getAvailableStock(item);

    if (item.product.status !== ProductStatus.ACTIVE) {
      throw new AppError(`Product ${item.product.name} is not available`, HTTP_STATUS.BAD_REQUEST);
    }

    if (!item.product.inventory) {
      throw new AppError(`Inventory is missing for ${item.product.name}`, HTTP_STATUS.BAD_REQUEST);
    }

    if (item.quantity > availableStock) {
      throw new AppError("Stock not enough", HTTP_STATUS.BAD_REQUEST, [
        {
          field: "quantity",
          message: `${item.product.name} only has ${availableStock} item(s) available`,
        },
      ]);
    }

    const unitPrice = getUnitPrice(item);

    return {
      cartItemId: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      variantName: item.variant?.name ?? null,
      sku: item.variant?.sku ?? item.product.sku,
      imageUrl: getPrimaryImageUrl(item),
      unitPrice,
      quantity: item.quantity,
      totalPrice: unitPrice * item.quantity,
      customText: item.customText,
      customData: item.customData,
      inventoryId: item.product.inventory.id,
    };
  });

  const subtotalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  const baseShippingFee = subtotalAmount >= FREE_SHIPPING_SUBTOTAL ? 0 : SHIPPING_FEE;
  const coupon = await validateCoupon(input.couponCode, subtotalAmount, identity.userId);
  const shippingFee = coupon?.freeShipping ? 0 : baseShippingFee;
  const discountAmount = coupon?.discountAmount ?? 0;
  const totalAmount = subtotalAmount - discountAmount + shippingFee;

  if (totalAmount <= 0) {
    throw new AppError("Total amount must be positive", HTTP_STATUS.BAD_REQUEST);
  }

  const paymentSetting = await settingsService.getPaymentSetting();

  if (input.paymentProvider === PaymentProvider.COD && !paymentSetting.codEnabled) {
    throw new AppError("Cash on delivery is currently unavailable", HTTP_STATUS.BAD_REQUEST);
  }

  if (input.paymentProvider === PaymentProvider.BANK_TRANSFER && !paymentSetting.bankTransferEnabled) {
    throw new AppError("Bank transfer is currently unavailable", HTTP_STATUS.BAD_REQUEST);
  }

  return {
    cart,
    items,
    coupon,
    subtotalAmount,
    discountAmount,
    shippingFee,
    totalAmount,
    customer: input.customer,
    shippingAddress: buildShippingAddress(input),
    paymentProvider: input.paymentProvider,
    note: input.note ?? null,
  };
};

export const validateCheckout = async (input: CheckoutInput, identity: CheckoutIdentity) => {
  const preview = await buildCheckoutPreview(input, identity);

  return {
    cartId: preview.cart.id,
    items: preview.items,
    coupon: preview.coupon,
    subtotalAmount: preview.subtotalAmount,
    discountAmount: preview.discountAmount,
    shippingFee: preview.shippingFee,
    totalAmount: preview.totalAmount,
    paymentProvider: preview.paymentProvider,
  };
};

export const createOrder = async (input: CheckoutInput, identity: CheckoutIdentity) => {
  const preview = await buildCheckoutPreview(input, identity);
  let orderCode = createOrderCode();

  if (input.paymentProvider !== PaymentProvider.COD) {
    paymentService.ensurePaymentProviderCanCreate(input.paymentProvider);

    const order = await prisma.$transaction(async (tx) => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const exists = await tx.order.findUnique({
          where: {
            orderCode,
          },
        });

        if (!exists) {
          break;
        }

        orderCode = createOrderCode();
      }

      const savedOrder = await tx.order.create({
        data: {
          orderCode,
          userId: identity.userId ?? null,
          guestSessionId: identity.userId ? null : identity.sessionId ?? null,
          couponId: preview.coupon?.id ?? null,
          customerName: preview.customer.fullName,
          customerEmail: preview.customer.email,
          customerPhone: preview.customer.phone,
          shippingAddress: preview.shippingAddress,
          note: preview.note,
          subtotalAmount: preview.subtotalAmount,
          discountAmount: preview.discountAmount,
          shippingFee: preview.shippingFee,
          totalAmount: preview.totalAmount,
          status: OrderStatus.PENDING_PAYMENT,
          items: {
            create: preview.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantName: item.variantName,
              sku: item.sku,
              imageUrl: item.imageUrl,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              customText: item.customText,
              customData: item.customData === null ? undefined : (item.customData as Prisma.InputJsonValue),
            })),
          },
          payments: {
            create: {
              provider: input.paymentProvider,
              status: PaymentStatus.PENDING,
              amount: preview.totalAmount,
              currency: "VND",
            },
          },
        },
        include: {
          payments: true,
        },
      });

      await tx.cart.update({
        where: {
          id: preview.cart.id,
        },
        data: {
          status: CartStatus.CHECKED_OUT,
        },
      });

      return savedOrder;
    });

    const payment = order.payments[0];

    if (!payment) {
      throw new AppError("Payment transaction was not created", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    await paymentService.createPaymentForOrder({
      orderId: order.id,
      paymentId: payment.id,
      provider: input.paymentProvider,
    });

    return {
      orderCode: order.orderCode,
      orderId: order.id,
      paymentProvider: input.paymentProvider,
    };
  }

  const order = await prisma.$transaction(async (tx) => {
    for (const item of preview.items) {
      const inventoryUpdate = await tx.inventory.updateMany({
        where: {
          id: item.inventoryId,
          quantity: {
            gte: item.quantity,
          },
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
          soldQuantity: {
            increment: item.quantity,
          },
        },
      });

      if (inventoryUpdate.count !== 1) {
        throw new AppError("Stock not enough", HTTP_STATUS.BAD_REQUEST);
      }

      if (item.variantId) {
        const variantUpdate = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stock: {
              gte: item.quantity,
            },
            isActive: true,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (variantUpdate.count !== 1) {
          throw new AppError("Variant stock not enough", HTTP_STATUS.BAD_REQUEST);
        }
      }
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const exists = await tx.order.findUnique({
        where: {
          orderCode,
        },
      });

      if (!exists) {
        break;
      }

      orderCode = createOrderCode();
    }

    const savedOrder = await tx.order.create({
      data: {
        orderCode,
        userId: identity.userId ?? null,
        guestSessionId: identity.userId ? null : identity.sessionId ?? null,
        couponId: preview.coupon?.id ?? null,
        customerName: preview.customer.fullName,
        customerEmail: preview.customer.email,
        customerPhone: preview.customer.phone,
        shippingAddress: preview.shippingAddress,
        note: preview.note,
        subtotalAmount: preview.subtotalAmount,
        discountAmount: preview.discountAmount,
        shippingFee: preview.shippingFee,
        totalAmount: preview.totalAmount,
        status: OrderStatus.CONFIRMED,
        items: {
          create: preview.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            sku: item.sku,
            imageUrl: item.imageUrl,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            customText: item.customText,
            customData: item.customData === null ? undefined : (item.customData as Prisma.InputJsonValue),
          })),
        },
        payments: {
          create: {
            provider: PaymentProvider.COD,
            status: PaymentStatus.PENDING,
            amount: preview.totalAmount,
            currency: "VND",
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    await tx.inventoryLog.createMany({
      data: preview.items.map((item) => ({
        inventoryId: item.inventoryId,
        type: InventoryChangeType.SALE,
        quantity: -item.quantity,
        note: `Stock deducted for order ${savedOrder.orderCode}`,
        orderId: savedOrder.id,
        createdById: identity.userId ?? null,
      })),
    });

    if (preview.coupon) {
      await tx.coupon.update({
        where: {
          id: preview.coupon.id,
        },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });

      await tx.couponUsage.create({
        data: {
          couponId: preview.coupon.id,
          userId: identity.userId ?? null,
          orderId: savedOrder.id,
        },
      });
    }

    await tx.cart.update({
      where: {
        id: preview.cart.id,
      },
      data: {
        status: CartStatus.CHECKED_OUT,
      },
    });

    return savedOrder;
  });

  await emailService.sendOrderConfirmationEmail(order.id);

  return {
    orderCode: order.orderCode,
    orderId: order.id,
    paymentProvider: PaymentProvider.COD,
    redirectUrl: `/order-success?orderCode=${order.orderCode}`,
  };
};
