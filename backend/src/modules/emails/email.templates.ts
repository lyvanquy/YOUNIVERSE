import { env } from "../../config/env";
import type { EmailOrderData, OrderStatusEmailOptions, RenderedEmail } from "./email.types";

const slogan = "A galaxy to hold, a story to be told";

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const renderItemsHtml = (order: EmailOrderData): string =>
  order.items
    .map((item) => {
      const name = item.variantName ? `${item.productName} - ${item.variantName}` : item.productName;
      const customText = item.customText ? `<div style="color:#555;font-size:13px;">Custom: ${escapeHtml(item.customText)}</div>` : "";

      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            <strong>${escapeHtml(name)}</strong>
            ${customText}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.totalPrice)}</td>
        </tr>
      `;
    })
    .join("");

const renderItemsText = (order: EmailOrderData): string =>
  order.items
    .map((item) => {
      const name = item.variantName ? `${item.productName} - ${item.variantName}` : item.productName;
      const customText = item.customText ? `, custom: ${item.customText}` : "";

      return `- ${name} x${item.quantity}${customText}: ${formatCurrency(item.totalPrice)}`;
    })
    .join("\n");

const renderBaseEmail = (title: string, intro: string, order: EmailOrderData, extraHtml = "", extraText = ""): RenderedEmail => {
  const paymentText = order.payment ? `${order.payment.provider} / ${order.payment.status}` : "Chua co thong tin";
  const subject = title.replace("#{orderCode}", order.orderCode);
  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.55;max-width:680px;margin:0 auto;padding:24px;">
      <div style="border-bottom:3px solid #111;padding-bottom:16px;margin-bottom:24px;">
        <div style="font-size:26px;font-weight:800;letter-spacing:0;">YOUniverse</div>
        <div style="color:#666;">${slogan}</div>
      </div>
      <h1 style="font-size:24px;margin:0 0 12px;">${escapeHtml(subject)}</h1>
      <p>Hi ${escapeHtml(order.customerName)},</p>
      <p>${escapeHtml(intro)}</p>
      ${extraHtml}
      <div style="background:#f7f7f7;border:1px solid #e7e7e7;padding:16px;margin:20px 0;">
        <div><strong>Ma don:</strong> ${escapeHtml(order.orderCode)}</div>
        <div><strong>Ngay dat:</strong> ${formatDate(order.createdAt)}</div>
        <div><strong>Trang thai don:</strong> ${order.status}</div>
        <div><strong>Thanh toan:</strong> ${paymentText}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr>
            <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #111;">San pham</th>
            <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #111;">SL</th>
            <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #111;">Thanh tien</th>
          </tr>
        </thead>
        <tbody>${renderItemsHtml(order)}</tbody>
      </table>
      <div style="margin-left:auto;max-width:280px;">
        <div style="display:flex;justify-content:space-between;"><span>Tam tinh</span><strong>${formatCurrency(order.subtotalAmount)}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Giam gia</span><strong>${formatCurrency(order.discountAmount)}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Van chuyen</span><strong>${formatCurrency(order.shippingFee)}</strong></div>
        <div style="display:flex;justify-content:space-between;font-size:18px;border-top:1px solid #ddd;margin-top:8px;padding-top:8px;"><span>Tong</span><strong>${formatCurrency(order.totalAmount)}</strong></div>
      </div>
      <div style="margin-top:24px;">
        <strong>Dia chi giao hang</strong>
        <p>${escapeHtml(order.shippingAddress)}</p>
        <p>Phone: ${escapeHtml(order.customerPhone)}</p>
      </div>
      <p style="margin-top:28px;">Cam on ban da tao nen mot vu tru nho cung YOUniverse.</p>
    </div>
  `;
  const text = [
    subject,
    "",
    `Hi ${order.customerName},`,
    intro,
    extraText,
    "",
    `Ma don: ${order.orderCode}`,
    `Ngay dat: ${formatDate(order.createdAt)}`,
    `Trang thai don: ${order.status}`,
    `Thanh toan: ${paymentText}`,
    "",
    renderItemsText(order),
    "",
    `Tam tinh: ${formatCurrency(order.subtotalAmount)}`,
    `Giam gia: ${formatCurrency(order.discountAmount)}`,
    `Van chuyen: ${formatCurrency(order.shippingFee)}`,
    `Tong: ${formatCurrency(order.totalAmount)}`,
    "",
    `Dia chi giao hang: ${order.shippingAddress}`,
    `Phone: ${order.customerPhone}`,
    "",
    `${env.EMAIL_FROM_NAME} - ${slogan}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
};

export const renderOrderConfirmationEmail = (order: EmailOrderData): RenderedEmail =>
  renderBaseEmail(
    "YOUniverse xac nhan don hang #{orderCode}",
    "Don hang cua ban da duoc ghi nhan. Chung minh se som chuan bi charm cho vu tru rieng cua ban.",
    order,
  );

export const renderPaymentSuccessEmail = (order: EmailOrderData): RenderedEmail =>
  renderBaseEmail(
    "Thanh toan thanh cong cho don hang #{orderCode}",
    "Thanh toan cua ban da duoc xac nhan. Don hang se duoc chuyen sang buoc xu ly tiep theo.",
    order,
  );

export const renderOrderStatusUpdatedEmail = (
  order: EmailOrderData,
  options: OrderStatusEmailOptions = {},
): RenderedEmail => {
  const previous = options.previousStatus ? `Trang thai cu: ${options.previousStatus}` : "";
  const extraHtml = previous ? `<p style="color:#555;">${previous}</p>` : "";

  return renderBaseEmail(
    "Don hang #{orderCode} da duoc cap nhat trang thai",
    `Trang thai hien tai cua don hang la ${order.status}.`,
    order,
    extraHtml,
    previous,
  );
};
