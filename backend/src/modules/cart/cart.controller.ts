import type { Request, RequestHandler } from "express";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { sendSuccess } from "../../common/utils/response";
import { parseGuestSessionId } from "../../common/utils/session";
import * as cartService from "./cart.service";
import type { AddCartItemInput, ApplyCouponInput, MergeCartInput, UpdateCartItemInput } from "./cart.validation";

const getSessionId = (req: Request): string | undefined => parseGuestSessionId(req.headers["x-session-id"]);

const getCartIdentity = (req: Request) => ({
  userId: req.user?.sub,
  sessionId: req.user ? undefined : getSessionId(req),
});

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(getCartIdentity(req));

    sendSuccess(res, {
      message: "OK",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addCartItem: RequestHandler = async (req, res, next) => {
  try {
    const cart = await cartService.addCartItem(getCartIdentity(req), req.body as AddCartItemInput);

    sendSuccess(res, {
      message: "Cart item added",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem: RequestHandler = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(getCartIdentity(req), req.params.itemId, req.body as UpdateCartItemInput);

    sendSuccess(res, {
      message: "Cart item updated",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem: RequestHandler = async (req, res, next) => {
  try {
    const cart = await cartService.removeCartItem(getCartIdentity(req), req.params.itemId);

    sendSuccess(res, {
      message: "Cart item removed",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon: RequestHandler = async (req, res, next) => {
  try {
    const cart = await cartService.applyCoupon(getCartIdentity(req), req.body as ApplyCouponInput);

    sendSuccess(res, {
      message: "Coupon applied",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const mergeCart: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
    }

    const cart = await cartService.mergeCart(req.user.sub, req.body as MergeCartInput);

    sendSuccess(res, {
      message: "Cart merged",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};
