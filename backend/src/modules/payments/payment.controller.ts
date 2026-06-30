import type { RequestHandler } from "express";

import { sendSuccess } from "../../common/utils/response";
import * as paymentService from "./payment.service";

export const handleCallback: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.handlePaymentCallback(req.params.provider, req.query);

    res.redirect(result.redirectUrl);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.handlePaymentCallback(req.params.provider, req.body);

    sendSuccess(res, {
      message: "Payment callback processed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/payments/receipt
 * Khách hàng gửi URL ảnh minh chứng chuyển khoản.
 * Yêu cầu: { orderId, receiptUrl } trong body.
 */
export const submitReceipt: RequestHandler = async (req, res, next) => {
  try {
    const { orderId, receiptUrl } = req.body as { orderId: string; receiptUrl: string };
    const userId = req.user?.sub;

    const result = await paymentService.uploadPaymentReceipt(orderId, receiptUrl, undefined, userId);

    sendSuccess(res, {
      message: "Payment receipt submitted successfully. Our team will verify your transfer shortly.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
