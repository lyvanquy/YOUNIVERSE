import { PaymentProvider } from "@prisma/client";

import { AppError } from "../../../common/errors/AppError";
import { HTTP_STATUS } from "../../../common/errors/errorCodes";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProviderAdapter,
  VerifyPaymentResult,
} from "./payment-provider.interface";

export const codProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.COD,

  canCreatePayment() {
    return true;
  },

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return {
      provider: PaymentProvider.COD,
      providerTxnId: `COD-${input.orderCode}`,
      rawResponse: {
        message: "COD payment does not require redirect",
      },
    };
  },

  async verifyCallback(): Promise<VerifyPaymentResult> {
    throw new AppError("COD does not support payment callbacks", HTTP_STATUS.BAD_REQUEST);
  },
};
