import crypto from "crypto";
import { PaymentProvider } from "@prisma/client";

import { AppError } from "../../../common/errors/AppError";
import { HTTP_STATUS } from "../../../common/errors/errorCodes";
import { env } from "../../../config/env";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProviderAdapter,
  VerifyPaymentResult,
} from "./payment-provider.interface";

type MockPayload = {
  orderCode: string;
  amount: string;
  status: string;
  transactionId: string;
};

const getPayloadValue = (payload: Record<string, unknown>, key: keyof MockPayload | "signature"): string => {
  const value = payload[key];

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

    throw new AppError(`Missing mock payment field: ${key}`, HTTP_STATUS.BAD_REQUEST);
};

const buildSignaturePayload = (payload: MockPayload): string =>
  [payload.orderCode, payload.amount, payload.status, payload.transactionId].join("|");

const signPayload = (payload: MockPayload): string =>
  crypto.createHmac("sha256", env.PAYMENT_WEBHOOK_SECRET).update(buildSignaturePayload(payload)).digest("hex");

const timingSafeEqualHex = (actual: string, expected: string): boolean => {
  const actualBuffer = Buffer.from(actual, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
};

export const mockOnlineProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.MOCK_ONLINE,

  canCreatePayment() {
    return true;
  },

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const transactionId = `MOCK-${input.orderCode}-${Date.now()}`;
    const payload: MockPayload = {
      orderCode: input.orderCode,
      amount: String(input.amount),
      status: "success",
      transactionId,
    };
    const signature = signPayload(payload);
    const callbackUrl = new URL(`${env.BACKEND_URL}/api/v1/payments/callback/mock-online`);

    callbackUrl.searchParams.set("orderCode", payload.orderCode);
    callbackUrl.searchParams.set("amount", payload.amount);
    callbackUrl.searchParams.set("status", payload.status);
    callbackUrl.searchParams.set("transactionId", payload.transactionId);
    callbackUrl.searchParams.set("signature", signature);

    return {
      provider: PaymentProvider.MOCK_ONLINE,
      paymentUrl: callbackUrl.toString(),
      providerTxnId: transactionId,
      rawResponse: {
        callbackUrl: callbackUrl.toString(),
        returnUrl: input.returnUrl,
      },
    };
  },

  async verifyCallback(payload: unknown): Promise<VerifyPaymentResult> {
    if (!payload || typeof payload !== "object") {
      throw new AppError("Invalid mock payment payload", HTTP_STATUS.BAD_REQUEST);
    }

    const rawPayload = payload as Record<string, unknown>;
    const parsedPayload: MockPayload = {
      orderCode: getPayloadValue(rawPayload, "orderCode"),
      amount: getPayloadValue(rawPayload, "amount"),
      status: getPayloadValue(rawPayload, "status"),
      transactionId: getPayloadValue(rawPayload, "transactionId"),
    };
    const signature = getPayloadValue(rawPayload, "signature");
    const expectedSignature = signPayload(parsedPayload);

    if (!timingSafeEqualHex(signature, expectedSignature)) {
      throw new AppError("Invalid mock payment signature", HTTP_STATUS.BAD_REQUEST);
    }

    const amount = Number(parsedPayload.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError("Invalid mock payment amount", HTTP_STATUS.BAD_REQUEST);
    }

    return {
      success: parsedPayload.status === "success",
      providerTxnId: parsedPayload.transactionId,
      amount,
      orderCode: parsedPayload.orderCode,
      rawPayload,
      message: parsedPayload.status,
    };
  },
};
