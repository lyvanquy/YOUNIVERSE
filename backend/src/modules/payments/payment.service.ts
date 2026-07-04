import { PaymentProvider, PaymentStatus, Prisma } from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { getPaymentProvider } from "./providers";

type CreatePaymentForOrderInput = {
  orderId: string;
  paymentId: string;
  provider: PaymentProvider;
  ipAddress?: string;
};

const decimalToNumber = (value: Prisma.Decimal): number => value.toNumber();

const toJson = (value: unknown): Prisma.InputJsonValue | undefined =>
  value === undefined ? undefined : (value as Prisma.InputJsonValue);

export const ensurePaymentProviderCanCreate = (provider: PaymentProvider): void => {
  const adapter = getPaymentProvider(provider);

  if (!adapter.canCreatePayment()) {
    throw new AppError(`${provider} provider is not available`, HTTP_STATUS.BAD_REQUEST);
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
    ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
  };
  const result = await adapter.createPayment(createPaymentInput);

  const updatedPayment = await prisma.paymentTransaction.update({
    where: {
      id: payment.id,
    },
    data: {
      providerTxnId: result.providerTxnId,
      rawRequest: toJson(createPaymentInput),
      rawResponse: toJson(result.rawResponse),
    },
  });

  return {
    provider: updatedPayment.provider,
    providerTxnId: updatedPayment.providerTxnId,
  };
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
