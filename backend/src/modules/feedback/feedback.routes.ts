import { Router } from "express";

import { validate } from "../../common/middlewares/validate.middleware";
import * as feedbackController from "./feedback.controller";
import { createFeedbackSchema } from "./feedback.validation";

const router = Router();

/**
 * POST /api/v1/feedback
 * Public — Khách hàng gửi feedback từ form trên website.
 */
router.post("/", validate({ body: createFeedbackSchema }), feedbackController.createFeedback);

export default router;
