import { InventoryChangeType, OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { prisma } from "../../config/prisma";
import type { CustomerOrderListQuery } from "./order.validation";

const orderInclude = {
  items: true,
  payments: {
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.OrderInclude;

const orderDetailInclude = {
  ...orderInclude,
  inventoryLogs: true,
} satisfies Prisma.OrderInclude;

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

type OrderDetailWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderDetailInclude;
}>;

const decimalToNumber = (value: Prisma.Decimal): number => value.toNumber();

const toOrderDto = (order: OrderWithRelations | OrderDetailWithRelations) => ({
  id: order.id,
  orderCode: order.orderCode,
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
  payments: order.payments.map((payment) => ({
    id: payment.id,
    provider: payment.provider,
    status: payment.status,
    amount: decimalToNumber(payment.amount),
    currency: payment.currency,
    providerTxnId: payment.providerTxnId,
    paidAt: payment.paidAt,
    failedReason: payment.failedReason,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  })),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const findCustomerOrderOrThrow = async (userId: string, orderId: string): Promise<OrderDetailWithRelations> => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: orderDetailInclude,
  });

  if (!order) {
    throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

export const listMyOrders = async (userId: string, query: CustomerOrderListQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.OrderWhereInput = {
    userId,
  };

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
    items: orders.map(toOrderDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getMyOrder = async (userId: string, orderId: string) => {
  const order = await findCustomerOrderOrThrow(userId, orderId);

  return toOrderDto(order);
};

export const cancelMyOrder = async (userId: string, orderId: string) => {
  const order = await findCustomerOrderOrThrow(userId, orderId);
  const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING_PAYMENT, OrderStatus.PAID, OrderStatus.CONFIRMED];

  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError("Order cannot be cancelled", HTTP_STATUS.BAD_REQUEST);
  }

  const stockWasDeducted = order.inventoryLogs.some((log) => log.type === InventoryChangeType.SALE);

  const cancelledOrder = await prisma.$transaction(async (tx) => {
    if (stockWasDeducted) {
      for (const item of order.items) {
        const inventory = await tx.inventory.updateMany({
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

        if (inventory.count === 1) {
          const restoredInventory = await tx.inventory.findUnique({
            where: {
              productId: item.productId,
            },
          });

          if (restoredInventory) {
            await tx.inventoryLog.create({
              data: {
                inventoryId: restoredInventory.id,
                type: InventoryChangeType.CANCEL_RETURN,
                quantity: item.quantity,
                note: `Stock restored after order ${order.orderCode} cancellation`,
                orderId: order.id,
                createdById: userId,
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
    }

    await tx.paymentTransaction.updateMany({
      where: {
        orderId: order.id,
        status: PaymentStatus.PENDING,
      },
      data: {
        status: PaymentStatus.CANCELLED,
      },
    });

    return tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: orderInclude,
    });
  });

  return toOrderDto(cancelledOrder);
};
