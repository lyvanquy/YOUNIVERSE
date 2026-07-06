import { Router } from "express";

import { validate } from "../../common/middlewares/validate.middleware";
import * as productController from "./product.controller";
import { productSlugParamsSchema, publicProductListQuerySchema } from "./product.validation";

const router = Router();

router.get("/", validate({ query: publicProductListQuerySchema }), productController.listPublicProducts);
router.get("/featured", productController.listFeaturedProducts);
router.get("/showcase", productController.getShowcase);
router.get("/:slug", validate({ params: productSlugParamsSchema }), productController.getPublicProductBySlug);

export default router;
