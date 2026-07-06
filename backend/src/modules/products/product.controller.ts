import type { RequestHandler } from "express";

import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { sendSuccess } from "../../common/utils/response";
import * as productService from "./product.service";
import type {
  AdminProductListQuery,
  CreateProductInput,
  PublicProductListQuery,
  UpdateProductInput,
} from "./product.validation";

export const listPublicProducts: RequestHandler = async (req, res, next) => {
  try {
    const result = await productService.listPublicProducts(req.query as unknown as PublicProductListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const listFeaturedProducts: RequestHandler = async (_req, res, next) => {
  try {
    const products = await productService.listFeaturedProducts();

    sendSuccess(res, {
      message: "OK",
      data: {
        items: products,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProductBySlug: RequestHandler = async (req, res, next) => {
  try {
    const product = await productService.getPublicProductBySlug(req.params.slug);

    sendSuccess(res, {
      message: "OK",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminProducts: RequestHandler = async (req, res, next) => {
  try {
    const result = await productService.listAdminProducts(req.query as unknown as AdminProductListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById: RequestHandler = async (req, res, next) => {
  try {
    const product = await productService.getAdminProductById(req.params.id);

    sendSuccess(res, {
      message: "OK",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body as CreateProductInput);

    sendSuccess(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "Product created",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body as UpdateProductInput);

    sendSuccess(res, {
      message: "Product updated",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const archiveProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await productService.archiveProduct(req.params.id);

    sendSuccess(res, {
      message: "Product archived",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getShowcase: RequestHandler = async (_req, res, next) => {
  try {
    const items = await productService.getShowcaseData();

    sendSuccess(res, {
      message: "OK",
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};

export const listVariants: RequestHandler = async (req, res, next) => {
  try {
    const variants = await productService.listVariants(req.params.id);

    sendSuccess(res, {
      message: "OK",
      data: { variants },
    });
  } catch (error) {
    next(error);
  }
};

export const createVariant: RequestHandler = async (req, res, next) => {
  try {
    const variant = await productService.createVariant(req.params.id, req.body);

    sendSuccess(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "Variant created",
      data: { variant },
    });
  } catch (error) {
    next(error);
  }
};

export const updateVariant: RequestHandler = async (req, res, next) => {
  try {
    const variant = await productService.updateVariant(req.params.id, req.params.variantId, req.body);

    sendSuccess(res, {
      message: "Variant updated",
      data: { variant },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVariant: RequestHandler = async (req, res, next) => {
  try {
    await productService.deleteVariant(req.params.id, req.params.variantId);

    sendSuccess(res, {
      message: "Variant deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
