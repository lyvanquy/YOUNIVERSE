import { PaymentProvider } from "@prisma/client";

import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProviderAdapter,
} from "./payment-provider.interface";

/**
 * Bank Transfer provider — thanh toán chuyển khoản thủ công.
 * Khách hàng chuyển khoản theo QR, sau đó upload ảnh bill.
 * Admin xác nhận thủ công qua endpoint /admin/orders/:id/confirm-payment.
 */
export const bankTransferProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.BANK_TRANSFER,

  canCreatePayment() {
    return true;
  },

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // Không cần tạo payment URL — khách tự chuyển khoản theo QR tĩnh của shop
    return {
      provider: PaymentProvider.BANK_TRANSFER,
      providerTxnId: `BT-${input.orderCode}`,
      rawResponse: {
        message: "Bank transfer awaiting manual confirmation",
        orderCode: input.orderCode,
        amount: input.amount,
        currency: input.currency,
      },
    };
  },
};
