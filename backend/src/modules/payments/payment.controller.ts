import type { RequestHandler } from "express";

import { sendSuccess } from "../../common/utils/response";
import { parseGuestSessionId } from "../../common/utils/session";
import * as paymentService from "./payment.service";
import type { SubmitReceiptInput } from "./payment.validation";

/**
 * POST /api/v1/payments/receipt
 * Khách hàng gửi URL ảnh minh chứng chuyển khoản.
 * Yêu cầu: { orderId, receiptUrl } trong body.
 */
export const submitReceipt: RequestHandler = async (req, res, next) => {
  try {
    const { orderId, receiptUrl } = req.body as SubmitReceiptInput;
    const userId = req.user?.sub;
    const sessionId = parseGuestSessionId(req.headers["x-session-id"]);

    const result = await paymentService.uploadPaymentReceipt(orderId, receiptUrl, sessionId, userId);

    sendSuccess(res, {
      message: "Payment receipt submitted successfully. Our team will verify your transfer shortly.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
