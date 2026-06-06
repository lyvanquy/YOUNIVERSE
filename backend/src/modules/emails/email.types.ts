import type { OrderStatus, PaymentProvider, PaymentStatus } from "@prisma/client";

export type EmailTemplateName = "ORDER_CONFIRMATION" | "PAYMENT_SUCCESS" | "ORDER_STATUS_UPDATED";

export type EmailLogStatus = "SENT" | "FAILED";

export type EmailOrderItem = {
  productName: string;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  customText: string | null;
};

export type EmailPaymentSummary = {
  provider: PaymentProvider;
  status: PaymentStatus;
};

export type EmailOrderData = {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  items: EmailOrderItem[];
  payment: EmailPaymentSummary | null;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

export type OrderStatusEmailOptions = {
  previousStatus?: OrderStatus | null;
};
