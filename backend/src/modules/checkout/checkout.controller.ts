import type { Request, RequestHandler } from "express";

import { sendSuccess } from "../../common/utils/response";
import * as checkoutService from "./checkout.service";
import type { CheckoutInput } from "./checkout.validation";

const getSessionId = (req: Request): string | undefined => {
  const value = req.headers["x-session-id"];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getCheckoutIdentity = (req: Request) => ({
  userId: req.user?.sub,
  sessionId: getSessionId(req),
});

export const validateCheckout: RequestHandler = async (req, res, next) => {
  try {
    const result = await checkoutService.validateCheckout(req.body as CheckoutInput, getCheckoutIdentity(req));

    sendSuccess(res, {
      message: "Checkout valid",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const result = await checkoutService.createOrder(req.body as CheckoutInput, getCheckoutIdentity(req));

    sendSuccess(res, {
      message: "Order created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
