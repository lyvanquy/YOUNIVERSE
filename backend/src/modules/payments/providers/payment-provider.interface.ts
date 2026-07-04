import type { PaymentProvider } from "@prisma/client";

export type CreatePaymentInput = {
  orderId: string;
  orderCode: string;
  amount: number;
  currency: string;
  ipAddress?: string;
};

export type CreatePaymentResult = {
  provider: PaymentProvider;
  providerTxnId?: string;
  rawResponse?: unknown;
};

export interface PaymentProviderAdapter {
  provider: PaymentProvider;
  canCreatePayment(): boolean;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}
