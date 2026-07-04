import { Router } from "express";

import { optionalAuthMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { receiptRateLimit } from "../../common/middlewares/rate-limit.middleware";
import * as paymentController from "./payment.controller";
import { submitReceiptSchema } from "./payment.validation";


const router = Router();

/**
 * POST /api/v1/payments/receipt
 * Khách hàng (đã đăng nhập hoặc guest) submit ảnh bill chuyển khoản.
 * Body: { orderId: string, receiptUrl: string }
 */
router.post(
  "/receipt",
  receiptRateLimit,
  optionalAuthMiddleware,
  validate({ body: submitReceiptSchema }),
  paymentController.submitReceipt,
);


export default router;
