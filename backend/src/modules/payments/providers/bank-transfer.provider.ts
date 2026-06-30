import { PaymentProvider } from "@prisma/client";

import { AppError } from "../../../common/errors/AppError";
import { HTTP_STATUS } from "../../../common/errors/errorCodes";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProviderAdapter,
  VerifyPaymentResult,
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

  async verifyCallback(): Promise<VerifyPaymentResult> {
    // Bank transfer không dùng callback tự động — được xác nhận bởi admin
    throw new AppError(
      "Bank transfer does not support automatic payment callbacks. Use admin confirmation endpoint instead.",
      HTTP_STATUS.BAD_REQUEST,
    );
  },
};
