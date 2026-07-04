import {
  InventoryChangeType,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import * as emailService from "../emails/email.service";
import { getPaymentProvider, normalizeProviderParam } from "./providers";
import type { VerifyPaymentResult } from "./providers/payment-provider.interface";

type CreatePaymentForOrderInput = {
  orderId: string;
  paymentId: string;
  provider: PaymentProvider;
  ipAddress?: string;
};

type PaymentCallbackResult = {
  orderCode: string;
  status: "success" | "failed";
  alreadyProcessed: boolean;
  redirectUrl: string;
};

const paymentOrderInclude = {
  order: {
    include: {
      items: true,
      inventoryLogs: true,
      couponUsages: true,
    },
  },
} satisfies Prisma.PaymentTransactionInclude;

type PaymentWithOrder = Prisma.PaymentTransactionGetPayload<{
  include: typeof paymentOrderInclude;
}>;

const decimalToNumber = (value: Prisma.Decimal): number => value.toNumber();

const toJson = (value: unknown): Prisma.InputJsonValue | undefined =>
  value === undefined ? undefined : (value as Prisma.InputJsonValue);

const compareAmount = (expected: number, actual: number): boolean => Math.abs(expected - actual) < 0.01;

const buildRedirectUrl = (orderCode: string, status: "success" | "failed"): string => {
  const redirectUrl = new URL(env.PAYMENT_RETURN_URL);

  redirectUrl.searchParams.set("orderCode", orderCode);
  redirectUrl.searchParams.set("status", status);

  return redirectUrl.toString();
};

export const ensurePaymentProviderCanCreate = (provider: PaymentProvider): void => {
  const adapter = getPaymentProvider(provider);

  if (!adapter.canCreatePayment()) {
    throw new AppError(`${provider} provider is not configured yet`, HTTP_STATUS.BAD_REQUEST);
  }
};

export const createPaymentForOrder = async (input: CreatePaymentForOrderInput) => {
  ensurePaymentProviderCanCreate(input.provider);

  const payment = await prisma.paymentTransaction.findUnique({
    where: {
      id: input.paymentId,
    },
    include: {
      order: true,
    },
  });

  if (!payment || payment.orderId !== input.orderId || payment.provider !== input.provider) {
    throw new AppError("Payment transaction not found", HTTP_STATUS.NOT_FOUND);
  }

  if (payment.status !== PaymentStatus.PENDING) {
    throw new AppError("Payment transaction is not pending", HTTP_STATUS.BAD_REQUEST);
  }

  const adapter = getPaymentProvider(input.provider);
  const createPaymentInput = {
    orderId: payment.orderId,
    orderCode: payment.order.orderCode,
    amount: decimalToNumber(payment.amount),
    currency: payment.currency,
    returnUrl: env.PAYMENT_RETURN_URL,
    ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
  };
  const result = await adapter.createPayment(createPaymentInput);

  if (input.provider !== PaymentProvider.COD && input.provider !== PaymentProvider.BANK_TRANSFER && !result.paymentUrl) {
    throw new AppError("Payment URL was not created", HTTP_STATUS.BAD_REQUEST);
  }

  const updatedPayment = await prisma.paymentTransaction.update({
    where: {
      id: payment.id,
    },
    data: {
      providerTxnId: result.providerTxnId,
      paymentUrl: result.paymentUrl,
      rawRequest: toJson(createPaymentInput),
      rawResponse: toJson(result.rawResponse),
    },
  });

  return {
    provider: updatedPayment.provider,
    paymentUrl: updatedPayment.paymentUrl,
    providerTxnId: updatedPayment.providerTxnId,
  };
};

const findPaymentByVerifiedResult = async (provider: PaymentProvider, verified: VerifyPaymentResult) => {
  if (!verified.orderCode) {
    throw new AppError("Payment callback is missing order code", HTTP_STATUS.BAD_REQUEST);
  }

  const payment = await prisma.paymentTransaction.findFirst({
    where: {
      provider,
      order: {
        orderCode: verified.orderCode,
      },
    },
    include: paymentOrderInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!payment) {
    throw new AppError("Payment transaction not found", HTTP_STATUS.NOT_FOUND);
  }

  return payment;
};

const assertVerifiedAmount = async (payment: PaymentWithOrder, verified: VerifyPaymentResult): Promise<void> => {
  if (verified.amount === undefined) {
    throw new AppError("Payment callback is missing amount", HTTP_STATUS.BAD_REQUEST);
  }

  if (compareAmount(decimalToNumber(payment.amount), verified.amount)) {
    return;
  }

  if (payment.status === PaymentStatus.PENDING) {
    await prisma.paymentTransaction.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.FAILED,
        failedReason: "Payment amount mismatch",
        rawResponse: toJson(verified.rawPayload),
      },
    });
  }

  throw new AppError("Payment amount mismatch", HTTP_STATUS.BAD_REQUEST);
};

const handleFailedPayment = async (
  payment: PaymentWithOrder,
  verified: VerifyPaymentResult,
): Promise<PaymentCallbackResult> => {
  if (payment.status === PaymentStatus.PAID) {
    return {
      orderCode: payment.order.orderCode,
      status: "success",
      alreadyProcessed: true,
      redirectUrl: buildRedirectUrl(payment.order.orderCode, "success"),
    };
  }

  const updateResult = await prisma.paymentTransaction.updateMany({
    where: {
      id: payment.id,
      status: PaymentStatus.PENDING,
    },
    data: {
      status: PaymentStatus.FAILED,
      failedReason: verified.message ?? "Payment failed",
      providerTxnId: verified.providerTxnId ?? payment.providerTxnId,
      rawResponse: toJson(verified.rawPayload),
    },
  });

  return {
    orderCode: payment.order.orderCode,
    status: "failed",
    alreadyProcessed: updateResult.count !== 1,
    redirectUrl: buildRedirectUrl(payment.order.orderCode, "failed"),
  };
};

const markPaymentSucceeded = async (
  paymentId: string,
  verified: VerifyPaymentResult,
): Promise<PaymentCallbackResult> =>
  prisma.$transaction(async (tx) => {
    const payment = await tx.paymentTransaction.findUnique({
      where: {
        id: paymentId,
      },
      include: paymentOrderInclude,
    });

    if (!payment) {
      throw new AppError("Payment transaction not found", HTTP_STATUS.NOT_FOUND);
    }

    if (verified.amount === undefined || !compareAmount(decimalToNumber(payment.amount), verified.amount)) {
      throw new AppError("Payment amount mismatch", HTTP_STATUS.BAD_REQUEST);
    }

    if (payment.status === PaymentStatus.PAID) {
      return {
        orderCode: payment.order.orderCode,
        status: "success",
        alreadyProcessed: true,
        redirectUrl: buildRedirectUrl(payment.order.orderCode, "success"),
      };
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new AppError("Payment transaction is not pending", HTTP_STATUS.BAD_REQUEST);
    }

    const claimResult = await tx.paymentTransaction.updateMany({
      where: {
        id: payment.id,
        status: PaymentStatus.PENDING,
      },
      data: {
        status: PaymentStatus.PAID,
        providerTxnId: verified.providerTxnId ?? payment.providerTxnId,
        rawResponse: toJson(verified.rawPayload),
        paidAt: new Date(),
      },
    });

    if (claimResult.count !== 1) {
      return {
        orderCode: payment.order.orderCode,
        status: "success",
        alreadyProcessed: true,
        redirectUrl: buildRedirectUrl(payment.order.orderCode, "success"),
      };
    }

    const stockWasDeducted = payment.order.inventoryLogs.some((log) => log.type === InventoryChangeType.SALE);

    if (!stockWasDeducted) {
      for (const item of payment.order.items) {
        const inventoryUpdate = await tx.inventory.updateMany({
          where: {
            productId: item.productId,
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

        const inventory = await tx.inventory.findUniqueOrThrow({
          where: {
            productId: item.productId,
          },
        });

        await tx.inventoryLog.create({
          data: {
            inventoryId: inventory.id,
            type: InventoryChangeType.SALE,
            quantity: -item.quantity,
            note: `Stock deducted for paid order ${payment.order.orderCode}`,
            orderId: payment.order.id,
            createdById: payment.order.userId ?? null,
          },
        });

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
    }

    if (payment.order.couponId) {
      const existingCouponUsage = await tx.couponUsage.findFirst({
        where: {
          couponId: payment.order.couponId,
          orderId: payment.order.id,
        },
      });

      if (!existingCouponUsage) {
        await tx.coupon.update({
          where: {
            id: payment.order.couponId,
          },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });

        await tx.couponUsage.create({
          data: {
            couponId: payment.order.couponId,
            userId: payment.order.userId ?? null,
            orderId: payment.order.id,
          },
        });
      }
    }

    await tx.order.update({
      where: {
        id: payment.order.id,
      },
      data: {
        status: OrderStatus.PAID,
      },
    });

    return {
      orderCode: payment.order.orderCode,
      status: "success",
      alreadyProcessed: false,
      redirectUrl: buildRedirectUrl(payment.order.orderCode, "success"),
    };
  });

export const handlePaymentCallback = async (providerParam: string, payload: unknown): Promise<PaymentCallbackResult> => {
  const provider = normalizeProviderParam(providerParam);
  const adapter = getPaymentProvider(provider);
  const verified = await adapter.verifyCallback(payload);
  const payment = await findPaymentByVerifiedResult(provider, verified);

  await assertVerifiedAmount(payment, verified);

  if (!verified.success) {
    return handleFailedPayment(payment, verified);
  }

  const result = await markPaymentSucceeded(payment.id, verified);

  if (!result.alreadyProcessed) {
    await emailService.sendPaymentSuccessEmail(payment.orderId);
  }

  return result;
};

/**
 * Khách hàng upload ảnh minh chứng chuyển khoản sau khi đặt hàng BANK_TRANSFER.
 * Cập nhật receiptUrl vào PaymentTransaction tương ứng.
 */
export const uploadPaymentReceipt = async (
  orderId: string,
  receiptUrl: string,
  sessionId?: string,
  userId?: string,
): Promise<{ paymentId: string; receiptUrl: string }> => {
  // Tìm payment của order này
  const payment = await prisma.paymentTransaction.findFirst({
    where: {
      orderId,
      provider: PaymentProvider.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
    },
    include: {
      order: {
        select: {
          userId: true,
          guestSessionId: true,
          orderCode: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(
      "No pending bank transfer payment found for this order",
      HTTP_STATUS.NOT_FOUND,
    );
  }

  // Kiểm tra quyền: chỉ chủ order mới được upload
  const orderUserId = payment.order.userId;
  const ownsAuthenticatedOrder = Boolean(orderUserId && userId === orderUserId);
  const ownsGuestOrder = Boolean(
    !orderUserId &&
      payment.order.guestSessionId &&
      sessionId &&
      payment.order.guestSessionId === sessionId,
  );

  if (!ownsAuthenticatedOrder && !ownsGuestOrder) {
    throw new AppError("You do not have permission to update this payment", HTTP_STATUS.FORBIDDEN);
  }

  const normalizedReceiptUrl = new URL(receiptUrl);
  const backendUrl = new URL(env.BACKEND_URL);

  if (normalizedReceiptUrl.origin !== backendUrl.origin || !normalizedReceiptUrl.pathname.startsWith("/uploads/")) {
    throw new AppError("Receipt URL must reference an uploaded image", HTTP_STATUS.BAD_REQUEST);
  }

  const updated = await prisma.paymentTransaction.update({
    where: { id: payment.id },
    data: { receiptUrl: normalizedReceiptUrl.toString() },
  });

  return {
    paymentId: updated.id,
    receiptUrl: updated.receiptUrl ?? normalizedReceiptUrl.toString(),
  };
};
