import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { sendSuccess } from "../../common/utils/response";
import productAdminRoutes from "../products/product.admin.routes";
import * as adminController from "./admin.controller";
import {
  adminOrderListQuerySchema,
  couponListQuerySchema,
  createCouponSchema,
  idParamsSchema,
  inventoryAdjustSchema,
  inventoryListQuerySchema,
  productIdParamsSchema,
  updateCouponSchema,
  updateOrderStatusSchema,
  userListQuerySchema,
} from "./admin.validation";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.ADMIN));

router.get("/access-check", (_req, res) => {
  sendSuccess(res, {
    message: "OK",
    data: {
      access: "admin",
    },
  });
});

router.get("/dashboard", adminController.getDashboard);
router.get("/", adminController.getDashboard);

router.use("/products", productAdminRoutes);

router.get("/orders", validate({ query: adminOrderListQuerySchema }), adminController.listOrders);
router.get("/orders/:id", validate({ params: idParamsSchema }), adminController.getOrderById);
router.patch(
  "/orders/:id/status",
  validate({ params: idParamsSchema, body: updateOrderStatusSchema }),
  adminController.updateOrderStatus,
);

router.get("/inventory", validate({ query: inventoryListQuerySchema }), adminController.listInventory);
router.patch(
  "/inventory/:productId/adjust",
  validate({ params: productIdParamsSchema, body: inventoryAdjustSchema }),
  adminController.adjustInventory,
);

router.get("/coupons", validate({ query: couponListQuerySchema }), adminController.listCoupons);
router.post("/coupons", validate({ body: createCouponSchema }), adminController.createCoupon);
router.patch("/coupons/:id", validate({ params: idParamsSchema, body: updateCouponSchema }), adminController.updateCoupon);
router.delete("/coupons/:id", validate({ params: idParamsSchema }), adminController.disableCoupon);

router.get("/users", validate({ query: userListQuerySchema }), adminController.listUsers);

export default router;
