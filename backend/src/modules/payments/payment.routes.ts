import { Router } from "express";

import * as paymentController from "./payment.controller";

const router = Router();

router.get("/callback/:provider", paymentController.handleCallback);
router.post("/webhook/:provider", paymentController.handleWebhook);

export default router;
