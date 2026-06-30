import { Router } from "express";

import { optionalAuthMiddleware } from "../../common/middlewares/auth.middleware";
import * as paymentController from "./payment.controller";


const router = Router();

router.get("/callback/:provider", paymentController.handleCallback);
router.post("/webhook/:provider", paymentController.handleWebhook);

/**
 * POST /api/v1/payments/receipt
 * Khách hàng (đã đăng nhập hoặc guest) submit ảnh bill chuyển khoản.
 * Body: { orderId: string, receiptUrl: string }
 */
router.post("/receipt", optionalAuthMiddleware, paymentController.submitReceipt);


export default router;
