import type { PaymentProvider } from "@prisma/client";

export type CreatePaymentInput = {
  orderId: string;
  orderCode: string;
  amount: number;
  currency: string;
  returnUrl: string;
  ipAddress?: string;
};

export type CreatePaymentResult = {
  provider: PaymentProvider;
  paymentUrl?: string;
  providerTxnId?: string;
  rawResponse?: unknown;
};

export type VerifyPaymentResult = {
  success: boolean;
  providerTxnId?: string;
  amount?: number;
  orderCode?: string;
  rawPayload?: unknown;
  message?: string;
};

export interface PaymentProviderAdapter {
  provider: PaymentProvider;
  canCreatePayment(): boolean;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyCallback(payload: unknown): Promise<VerifyPaymentResult>;
}
