import nodemailer from "nodemailer";
import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import {
  renderOrderConfirmationEmail,
  renderOrderStatusUpdatedEmail,
  renderPaymentSuccessEmail,
} from "./email.templates";
import type { EmailLogStatus, EmailOrderData, EmailTemplateName, OrderStatusEmailOptions, RenderedEmail } from "./email.types";

const orderEmailInclude = {
  items: true,
  payments: {
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  },
} satisfies Prisma.OrderInclude;

type OrderEmailPayload = Prisma.OrderGetPayload<{
  include: typeof orderEmailInclude;
}>;

const decimalToNumber = (value: Prisma.Decimal): number => value.toNumber();

const isSmtpConfigured = (): boolean =>
  Boolean(env.EMAIL_SMTP_HOST && env.EMAIL_SMTP_USER && env.EMAIL_SMTP_PASSWORD);

const getFromAddress = (): string => `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`;

const toOrderData = (order: OrderEmailPayload): EmailOrderData => ({
  id: order.id,
  orderCode: order.orderCode,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  shippingAddress: order.shippingAddress,
  subtotalAmount: decimalToNumber(order.subtotalAmount),
  discountAmount: decimalToNumber(order.discountAmount),
  shippingFee: decimalToNumber(order.shippingFee),
  totalAmount: decimalToNumber(order.totalAmount),
  status: order.status,
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    productName: item.productName,
    variantName: item.variantName,
    unitPrice: decimalToNumber(item.unitPrice),
    quantity: item.quantity,
    totalPrice: decimalToNumber(item.totalPrice),
    customText: item.customText,
  })),
  payment: order.payments[0]
    ? {
        provider: order.payments[0].provider,
        status: order.payments[0].status,
      }
    : null,
});

const getOrderData = async (orderId: string): Promise<EmailOrderData | null> => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: orderEmailInclude,
  });

  return order ? toOrderData(order) : null;
};

const createEmailLog = async (input: {
  orderId?: string;
  toEmail: string;
  subject: string;
  template: EmailTemplateName;
  status: EmailLogStatus;
  error?: string;
}) => {
  await prisma.emailLog.create({
    data: {
      orderId: input.orderId,
      toEmail: input.toEmail,
      subject: input.subject,
      template: input.template,
      status: input.status,
      error: input.error,
    },
  });
};

const sendRenderedEmail = async (input: {
  orderId?: string;
  toEmail: string;
  template: EmailTemplateName;
  rendered: RenderedEmail;
}): Promise<void> => {
  try {
    if (!isSmtpConfigured() && env.NODE_ENV !== "production") {
      if (env.NODE_ENV !== "test") {
        console.info(`[email:fallback] ${input.template} to ${input.toEmail}`);
        console.info(input.rendered.text);
      }

      await createEmailLog({
        orderId: input.orderId,
        toEmail: input.toEmail,
        subject: input.rendered.subject,
        template: input.template,
        status: "SENT",
      });
      return;
    }

    if (!isSmtpConfigured()) {
      throw new Error("SMTP is not configured");
    }

    const transporter = nodemailer.createTransport({
      host: env.EMAIL_SMTP_HOST,
      port: env.EMAIL_SMTP_PORT,
      secure: env.EMAIL_SMTP_PORT === 465,
      auth: {
        user: env.EMAIL_SMTP_USER,
        pass: env.EMAIL_SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: getFromAddress(),
      to: input.toEmail,
      subject: input.rendered.subject,
      html: input.rendered.html,
      text: input.rendered.text,
    });

    await createEmailLog({
      orderId: input.orderId,
      toEmail: input.toEmail,
      subject: input.rendered.subject,
      template: input.template,
      status: "SENT",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";

    try {
      await createEmailLog({
        orderId: input.orderId,
        toEmail: input.toEmail,
        subject: input.rendered.subject,
        template: input.template,
        status: "FAILED",
        error: message,
      });
    } catch (logError) {
      console.error("Failed to write EmailLog", logError);
    }

    console.error(`Email ${input.template} failed for ${input.toEmail}: ${message}`);
  }
};

const sendOrderEmail = async (
  orderId: string,
  template: EmailTemplateName,
  render: (order: EmailOrderData) => RenderedEmail,
): Promise<void> => {
  try {
    const order = await getOrderData(orderId);

    if (!order) {
      console.error(`Email ${template} skipped: order ${orderId} not found`);
      return;
    }

    await sendRenderedEmail({
      orderId,
      toEmail: order.customerEmail,
      template,
      rendered: render(order),
    });
  } catch (error) {
    console.error(`Email ${template} failed before send`, error);
  }
};

export const sendOrderConfirmationEmail = async (orderId: string): Promise<void> => {
  await sendOrderEmail(orderId, "ORDER_CONFIRMATION", renderOrderConfirmationEmail);
};

export const sendPaymentSuccessEmail = async (orderId: string): Promise<void> => {
  await sendOrderEmail(orderId, "PAYMENT_SUCCESS", renderPaymentSuccessEmail);
};

export const sendOrderStatusUpdatedEmail = async (
  orderId: string,
  options: OrderStatusEmailOptions = {},
): Promise<void> => {
  await sendOrderEmail(orderId, "ORDER_STATUS_UPDATED", (order) => renderOrderStatusUpdatedEmail(order, options));
};
