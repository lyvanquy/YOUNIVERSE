import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as settingsController from "./settings.controller";
import { updatePaymentSettingSchema } from "./settings.validation";

const router = Router();

router.get("/payment", settingsController.getPaymentSetting);
router.patch(
  "/payment",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  validate({ body: updatePaymentSettingSchema }),
  settingsController.updatePaymentSetting,
);

export default router;
