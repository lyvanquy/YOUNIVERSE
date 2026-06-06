import { PaymentProvider } from "@prisma/client";

import { AppError } from "../../../common/errors/AppError";
import { HTTP_STATUS } from "../../../common/errors/errorCodes";
import type {
  CreatePaymentResult,
  PaymentProviderAdapter,
  VerifyPaymentResult,
} from "./payment-provider.interface";

export const vnpayProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.VNPAY,

  canCreatePayment() {
    return false;
  },

  async createPayment(): Promise<CreatePaymentResult> {
    throw new AppError("VNPay provider is not configured yet", HTTP_STATUS.BAD_REQUEST);
  },

  async verifyCallback(): Promise<VerifyPaymentResult> {
    throw new AppError("VNPay callback verification is not configured yet", HTTP_STATUS.BAD_REQUEST);
  },
};
