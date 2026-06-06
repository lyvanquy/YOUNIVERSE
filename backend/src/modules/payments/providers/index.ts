import { PaymentProvider } from "@prisma/client";

import { AppError } from "../../../common/errors/AppError";
import { HTTP_STATUS } from "../../../common/errors/errorCodes";
import { codProvider } from "./cod.provider";
import { mockOnlineProvider } from "./mock-online.provider";
import { momoProvider } from "./momo.provider";
import type { PaymentProviderAdapter } from "./payment-provider.interface";
import { stripeProvider } from "./stripe.provider";
import { vnpayProvider } from "./vnpay.provider";

const providers: Record<PaymentProvider, PaymentProviderAdapter> = {
  [PaymentProvider.COD]: codProvider,
  [PaymentProvider.MOCK_ONLINE]: mockOnlineProvider,
  [PaymentProvider.VNPAY]: vnpayProvider,
  [PaymentProvider.MOMO]: momoProvider,
  [PaymentProvider.STRIPE]: stripeProvider,
};

export const normalizeProviderParam = (provider: string): PaymentProvider => {
  const normalized = provider.trim().replace(/-/g, "_").toUpperCase();

  if (Object.values(PaymentProvider).includes(normalized as PaymentProvider)) {
    return normalized as PaymentProvider;
  }

  throw new AppError("Unsupported payment provider", HTTP_STATUS.BAD_REQUEST);
};

export const getPaymentProvider = (provider: PaymentProvider): PaymentProviderAdapter => providers[provider];
