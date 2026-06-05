import { Router } from "express";

import { authMiddleware, optionalAuthMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as cartController from "./cart.controller";
import {
  addCartItemSchema,
  applyCouponSchema,
  cartItemParamsSchema,
  mergeCartSchema,
  updateCartItemSchema,
} from "./cart.validation";

const router = Router();

router.get("/", optionalAuthMiddleware, cartController.getCart);
router.post("/items", optionalAuthMiddleware, validate({ body: addCartItemSchema }), cartController.addCartItem);
router.patch(
  "/items/:itemId",
  optionalAuthMiddleware,
  validate({ params: cartItemParamsSchema, body: updateCartItemSchema }),
  cartController.updateCartItem,
);
router.delete(
  "/items/:itemId",
  optionalAuthMiddleware,
  validate({ params: cartItemParamsSchema }),
  cartController.removeCartItem,
);
router.post("/apply-coupon", optionalAuthMiddleware, validate({ body: applyCouponSchema }), cartController.applyCoupon);
router.post("/merge", authMiddleware, validate({ body: mergeCartSchema }), cartController.mergeCart);

export default router;
