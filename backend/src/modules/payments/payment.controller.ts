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
