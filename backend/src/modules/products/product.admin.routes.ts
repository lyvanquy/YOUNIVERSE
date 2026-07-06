import { Router } from "express";

import { validate } from "../../common/middlewares/validate.middleware";
import * as productController from "./product.controller";
import {
  adminProductListQuerySchema,
  createProductSchema,
  createVariantSchema,
  productIdParamsSchema,
  updateProductSchema,
  updateVariantSchema,
  variantIdParamsSchema,
} from "./product.validation";

const router = Router();

router.get("/", validate({ query: adminProductListQuerySchema }), productController.listAdminProducts);
router.post("/", validate({ body: createProductSchema }), productController.createProduct);
router.get("/:id", validate({ params: productIdParamsSchema }), productController.getAdminProductById);
router.patch("/:id", validate({ params: productIdParamsSchema, body: updateProductSchema }), productController.updateProduct);
router.delete("/:id", validate({ params: productIdParamsSchema }), productController.archiveProduct);

// Variant CRUD
router.get("/:id/variants", validate({ params: productIdParamsSchema }), productController.listVariants);
router.post("/:id/variants", validate({ params: productIdParamsSchema, body: createVariantSchema }), productController.createVariant);
router.patch("/:id/variants/:variantId", validate({ params: variantIdParamsSchema, body: updateVariantSchema }), productController.updateVariant);
router.delete("/:id/variants/:variantId", validate({ params: variantIdParamsSchema }), productController.deleteVariant);

export default router;
