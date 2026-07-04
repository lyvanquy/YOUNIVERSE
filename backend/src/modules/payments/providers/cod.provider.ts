import { PaymentProvider } from "@prisma/client";

import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProviderAdapter,
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
};
