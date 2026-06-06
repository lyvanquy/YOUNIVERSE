import {
  type Coupon,
  CouponType,
  InventoryChangeType,
  OrderStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { prisma } from "../../config/prisma";
import * as emailService from "../emails/email.service";
import type {
  AdminOrderListQuery,
  CouponListQuery,
  CreateCouponInput,
  InventoryAdjustInput,
  InventoryListQuery,
  UpdateCouponInput,
  UpdateOrderStatusInput,
  UserListQuery,
} from "./admin.validation";

const orderInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  },
  coupon: true,
  items: true,
  payments: {
    orderBy: {
      createdAt: "desc",
    },
  },
  inventoryLogs: true,
} satisfies Prisma.OrderInclude;

const inventoryInclude = {
  product: {
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  },
  logs: {
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  },
} satisfies Prisma.InventoryInclude;

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

type InventoryWithProduct = Prisma.InventoryGetPayload<{
  include: typeof inventoryInclude;
}>;

const decimalToNumber = (value: Prisma.Decimal | null): number | null => (value === null ? null : value.toNumber());

const toPaymentDto = (payment: OrderWithRelations["payments"][number]) => ({
  id: payment.id,
  provider: payment.provider,
  status: payment.status,
  amount: decimalToNumber(payment.amount),
  currency: payment.currency,
  providerTxnId: payment.providerTxnId,
  paymentUrl: payment.paymentUrl,
  paidAt: payment.paidAt,
  failedReason: payment.failedReason,
  createdAt: payment.createdAt,
  updatedAt: payment.updatedAt,
});

const toOrderDto = (order: OrderWithRelations) => ({
  id: order.id,
  orderCode: order.orderCode,
  user: order.user,
  coupon: order.coupon
    ? {
        id: order.coupon.id,
        code: order.coupon.code,
        name: order.coupon.name,
      }
    : null,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  shippingAddress: order.shippingAddress,
  note: order.note,
  subtotalAmount: decimalToNumber(order.subtotalAmount),
  discountAmount: decimalToNumber(order.discountAmount),
  shippingFee: decimalToNumber(order.shippingFee),
  totalAmount: decimalToNumber(order.totalAmount),
  status: order.status,
  adminNote: order.adminNote,
  trackingCode: order.trackingCode,
  paymentStatus: order.payments[0]?.status ?? null,
  paymentProvider: order.payments[0]?.provider ?? null,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    productName: item.productName,
    variantName: item.variantName,
    sku: item.sku,
    imageUrl: item.imageUrl,
    unitPrice: decimalToNumber(item.unitPrice),
    quantity: item.quantity,
    totalPrice: decimalToNumber(item.totalPrice),
    customText: item.customText,
    customData: item.customData,
  })),
  payments: order.payments.map(toPaymentDto),
  inventoryLogs: order.inventoryLogs.map((log) => ({
    id: log.id,
    inventoryId: log.inventoryId,
    type: log.type,
    quantity: log.quantity,
    note: log.note,
    createdById: log.createdById,
    createdAt: log.createdAt,
  })),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const toOrderSummaryDto = (order: OrderWithRelations) => ({
  id: order.id,
  orderCode: order.orderCode,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  totalAmount: decimalToNumber(order.totalAmount),
  status: order.status,
  paymentStatus: order.payments[0]?.status ?? null,
  paymentProvider: order.payments[0]?.provider ?? null,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const getPrimaryProductImage = (inventory: InventoryWithProduct): string | null =>
  inventory.product.images.find((image) => image.isPrimary)?.url ?? inventory.product.images[0]?.url ?? null;

const toInventoryDto = (inventory: InventoryWithProduct) => ({
  id: inventory.id,
  productId: inventory.productId,
  quantity: inventory.quantity,
  reservedQuantity: inventory.reservedQuantity,
  soldQuantity: inventory.soldQuantity,
  lowStockThreshold: inventory.lowStockThreshold,
  isLowStock: inventory.quantity <= inventory.lowStockThreshold,
  product: {
    id: inventory.product.id,
    name: inventory.product.name,
    slug: inventory.product.slug,
    sku: inventory.product.sku,
    productLine: inventory.product.productLine,
    status: inventory.product.status,
    imageUrl: getPrimaryProductImage(inventory),
  },
  logs: inventory.logs.map((log) => ({
    id: log.id,
    type: log.type,
    quantity: log.quantity,
    note: log.note,
    orderId: log.orderId,
    createdById: log.createdById,
    createdAt: log.createdAt,
  })),
  createdAt: inventory.createdAt,
  updatedAt: inventory.updatedAt,
});

const toCouponDto = (coupon: Coupon) => ({
  id: coupon.id,
  code: coupon.code,
  name: coupon.name,
  description: coupon.description,
  type: coupon.type,
  value: decimalToNumber(coupon.value),
  minOrderAmount: decimalToNumber(coupon.minOrderAmount),
  maxDiscountAmount: decimalToNumber(coupon.maxDiscountAmount),
  usageLimit: coupon.usageLimit,
  usagePerUser: coupon.usagePerUser,
  usedCount: coupon.usedCount,
  startsAt: coupon.startsAt,
  endsAt: coupon.endsAt,
  isActive: coupon.isActive,
  createdAt: coupon.createdAt,
  updatedAt: coupon.updatedAt,
});

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AppError("Unique constraint violation", HTTP_STATUS.CONFLICT, {
      target: error.meta?.target,
    });
  }

  throw error;
};

const buildOrderWhere = (query: AdminOrderListQuery): Prisma.OrderWhereInput => {
  const where: Prisma.OrderWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.paymentStatus) {
    where.payments = {
      some: {
        status: query.paymentStatus,
      },
    };
  }

  if (query.search) {
    where.OR = [
      {
        orderCode: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        customerName: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        customerEmail: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        customerPhone: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.from || query.to) {
    where.createdAt = {
      gte: query.from,
      lte: query.to,
    };
  }

  return where;
};

const getOrderOrThrow = async (id: string): Promise<OrderWithRelations> => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

const restoreOrderStockIfNeeded = async (
  tx: Prisma.TransactionClient,
  order: OrderWithRelations,
  adminUserId: string,
): Promise<void> => {
  const stockWasDeducted = order.inventoryLogs.some((log) => log.type === InventoryChangeType.SALE);
  const stockWasRestored = order.inventoryLogs.some((log) => log.type === InventoryChangeType.CANCEL_RETURN);

  if (!stockWasDeducted || stockWasRestored) {
    return;
  }

  for (const item of order.items) {
    const inventoryUpdate = await tx.inventory.updateMany({
      where: {
        productId: item.productId,
      },
      data: {
        quantity: {
          increment: item.quantity,
        },
        soldQuantity: {
          decrement: item.quantity,
        },
      },
    });

    if (inventoryUpdate.count === 1) {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId: item.productId,
        },
      });

      if (inventory) {
        await tx.inventoryLog.create({
          data: {
            inventoryId: inventory.id,
            type: InventoryChangeType.CANCEL_RETURN,
            quantity: item.quantity,
            note: `Stock restored by admin after order ${order.orderCode} cancellation`,
            orderId: order.id,
            createdById: adminUserId,
          },
        });
      }
    }

    if (item.variantId) {
      await tx.productVariant.update({
        where: {
          id: item.variantId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
  }
};

const validateCouponInput = (input: {
  type: CouponType;
  value: number;
  startsAt?: Date | null;
  endsAt?: Date | null;
}) => {
  if (input.type === CouponType.PERCENTAGE && input.value > 100) {
    throw new AppError("Percentage coupon value must be between 1 and 100", HTTP_STATUS.UNPROCESSABLE_ENTITY, [
      {
        field: "value",
        message: "Percentage coupon value must be between 1 and 100",
      },
    ]);
  }

  if (input.startsAt && input.endsAt && input.endsAt <= input.startsAt) {
    throw new AppError("End date must be after start date", HTTP_STATUS.UNPROCESSABLE_ENTITY, [
      {
        field: "endsAt",
        message: "End date must be after start date",
      },
    ]);
  }
};

export const getDashboard = async () => {
  const revenueStatuses: OrderStatus[] = [
    OrderStatus.PAID,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPING,
    OrderStatus.COMPLETED,
  ];
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [revenueAggregate, totalOrders, pendingOrders, totalProducts, newCustomers, inventories, recentOrders] =
    await prisma.$transaction([
      prisma.order.aggregate({
        where: {
          status: {
            in: revenueStatuses,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: OrderStatus.PENDING_PAYMENT,
        },
      }),
      prisma.product.count(),
      prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
          createdAt: {
            gte: since,
          },
        },
      }),
      prisma.inventory.findMany({
        select: {
          quantity: true,
          lowStockThreshold: true,
        },
      }),
      prisma.order.findMany({
        include: orderInclude,
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

  return {
    revenue: decimalToNumber(revenueAggregate._sum.totalAmount) ?? 0,
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts: inventories.filter((inventory) => inventory.quantity <= inventory.lowStockThreshold).length,
    newCustomers,
    recentOrders: recentOrders.map(toOrderSummaryDto),
  };
};

export const listOrders = async (query: AdminOrderListQuery) => {
  const where = buildOrderWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: query.limit,
    }),
    prisma.order.count({
      where,
    }),
  ]);

  return {
    items: orders.map(toOrderSummaryDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getOrderById = async (id: string) => {
  const order = await getOrderOrThrow(id);

  return toOrderDto(order);
};

export const updateOrderStatus = async (id: string, input: UpdateOrderStatusInput, adminUserId: string) => {
  const order = await getOrderOrThrow(id);

  if (order.status === OrderStatus.CANCELLED && input.status === OrderStatus.COMPLETED) {
    throw new AppError("Cancelled order cannot be completed", HTTP_STATUS.BAD_REQUEST);
  }

  if (order.status === OrderStatus.COMPLETED && input.status === OrderStatus.CANCELLED) {
    throw new AppError("Completed order cannot be cancelled", HTTP_STATUS.BAD_REQUEST);
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    if (input.status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      await restoreOrderStockIfNeeded(tx, order, adminUserId);

      await tx.paymentTransaction.updateMany({
        where: {
          orderId: order.id,
          status: PaymentStatus.PENDING,
        },
        data: {
          status: PaymentStatus.CANCELLED,
        },
      });
    }

    return tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: input.status,
        adminNote: input.note,
        trackingCode: input.trackingCode,
      },
      include: orderInclude,
    });
  });

  if (order.status !== updatedOrder.status) {
    await emailService.sendOrderStatusUpdatedEmail(updatedOrder.id, {
      previousStatus: order.status,
    });
  }

  return toOrderDto(updatedOrder);
};

export const listInventory = async (query: InventoryListQuery) => {
  const where: Prisma.InventoryWhereInput = {};

  if (query.search) {
    where.product = {
      OR: [
        {
          name: {
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
      ],
    };
  }

  const inventories = await prisma.inventory.findMany({
    where,
    include: inventoryInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });
  const filteredInventories =
    query.lowStock === undefined
      ? inventories
      : inventories.filter((inventory) => inventory.quantity <= inventory.lowStockThreshold === query.lowStock);
  const skip = (query.page - 1) * query.limit;
  const items = filteredInventories.slice(skip, skip + query.limit);

  return {
    items: items.map(toInventoryDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: filteredInventories.length,
      totalPages: Math.ceil(filteredInventories.length / query.limit),
    },
  };
};

export const adjustInventory = async (productId: string, input: InventoryAdjustInput, adminUserId: string) => {
  const inventory = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
    }

    const currentInventory =
      product.inventory ??
      (await tx.inventory.create({
        data: {
          productId: product.id,
          quantity: 0,
        },
      }));
    let nextQuantity = currentInventory.quantity;
    let logQuantity = input.quantity;

    if (input.type === InventoryChangeType.IMPORT) {
      nextQuantity = currentInventory.quantity + input.quantity;
    }

    if (input.type === InventoryChangeType.EXPORT) {
      if (currentInventory.quantity < input.quantity) {
        throw new AppError("Stock not enough", HTTP_STATUS.BAD_REQUEST);
      }

      nextQuantity = currentInventory.quantity - input.quantity;
      logQuantity = -input.quantity;
    }

    if (input.type === InventoryChangeType.ADJUSTMENT) {
      nextQuantity = input.quantity;
      logQuantity = input.quantity - currentInventory.quantity;
    }

    await tx.inventory.update({
      where: {
        id: currentInventory.id,
      },
      data: {
        quantity: nextQuantity,
      },
    });

    await tx.inventoryLog.create({
      data: {
        inventoryId: currentInventory.id,
        type: input.type,
        quantity: logQuantity,
        note: input.note,
        createdById: adminUserId,
      },
    });

    return tx.inventory.findUniqueOrThrow({
      where: {
        id: currentInventory.id,
      },
      include: inventoryInclude,
    });
  });

  return toInventoryDto(inventory);
};

export const listCoupons = async (query: CouponListQuery) => {
  const where: Prisma.CouponWhereInput = {};
  const skip = (query.page - 1) * query.limit;

  if (query.search) {
    where.OR = [
      {
        code: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  const [coupons, total] = await prisma.$transaction([
    prisma.coupon.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: query.limit,
    }),
    prisma.coupon.count({
      where,
    }),
  ]);

  return {
    items: coupons.map(toCouponDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const createCoupon = async (input: CreateCouponInput) => {
  validateCouponInput(input);

  try {
    const coupon = await prisma.coupon.create({
      data: input,
    });

    return toCouponDto(coupon);
  } catch (error) {
    return mapPrismaError(error);
  }
};

export const updateCoupon = async (id: string, input: UpdateCouponInput) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });

  if (!existingCoupon) {
    throw new AppError("Coupon not found", HTTP_STATUS.NOT_FOUND);
  }

  validateCouponInput({
    type: input.type ?? existingCoupon.type,
    value: input.value ?? existingCoupon.value.toNumber(),
    startsAt: input.startsAt === undefined ? existingCoupon.startsAt : input.startsAt,
    endsAt: input.endsAt === undefined ? existingCoupon.endsAt : input.endsAt,
  });

  try {
    const coupon = await prisma.coupon.update({
      where: {
        id,
      },
      data: input,
    });

    return toCouponDto(coupon);
  } catch (error) {
    return mapPrismaError(error);
  }
};

export const disableCoupon = async (id: string) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });

  if (!existingCoupon) {
    throw new AppError("Coupon not found", HTTP_STATUS.NOT_FOUND);
  }

  const coupon = await prisma.coupon.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return toCouponDto(coupon);
};

export const listUsers = async (query: UserListQuery) => {
  const where: Prisma.UserWhereInput = {};
  const skip = (query.page - 1) * query.limit;

  if (query.role) {
    where.role = query.role;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      {
        fullName: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: query.limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            carts: true,
          },
        },
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);

  return {
    items: users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      orderCount: user._count.orders,
      cartCount: user._count.carts,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};
