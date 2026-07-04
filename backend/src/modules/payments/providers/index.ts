import { PaymentProvider } from "@prisma/client";

import { bankTransferProvider } from "./bank-transfer.provider";
import { codProvider } from "./cod.provider";
import type { PaymentProviderAdapter } from "./payment-provider.interface";

const providers: Record<PaymentProvider, PaymentProviderAdapter> = {
  [PaymentProvider.COD]: codProvider,
  [PaymentProvider.BANK_TRANSFER]: bankTransferProvider,
};

export const getPaymentProvider = (provider: PaymentProvider): PaymentProviderAdapter => providers[provider];
