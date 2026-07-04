import { Router } from "express";

import { optionalAuthMiddleware } from "../../common/middlewares/auth.middleware";
import { checkoutRateLimit } from "../../common/middlewares/rate-limit.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as checkoutController from "./checkout.controller";
import { checkoutSchema } from "./checkout.validation";

const router = Router();

router.post("/validate", optionalAuthMiddleware, validate({ body: checkoutSchema }), checkoutController.validateCheckout);
router.post(
  "/create-order",
  checkoutRateLimit,
  optionalAuthMiddleware,
  validate({ body: checkoutSchema }),
  checkoutController.createOrder,
);

export default router;
