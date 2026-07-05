import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { sendSuccess } from "../../common/utils/response";
import * as adminService from "./admin.service";
import type {
  AdminOrderListQuery,
  CouponListQuery,
  CreateCouponInput,
  InventoryAdjustInput,
  InventoryListQuery,
  UpdateCouponInput,
  UpdateOrderStatusInput,
  UserListQuery,
} from "./admin.validation";

const getAdminUserIdOrThrow = (userId?: string): string => {
  if (!userId) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }

  return userId;
};

export const getDashboard: RequestHandler = async (_req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();

    sendSuccess(res, {
      message: "OK",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

export const listOrders: RequestHandler = async (req, res, next) => {
  try {
    const result = await adminService.listOrders(req.query as unknown as AdminOrderListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById: RequestHandler = async (req, res, next) => {
  try {
    const order = await adminService.getOrderById(req.params.id);

    sendSuccess(res, {
      message: "OK",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus: RequestHandler = async (req, res, next) => {
  try {
    const adminUserId = getAdminUserIdOrThrow(req.user?.sub);
    const order = await adminService.updateOrderStatus(req.params.id, req.body as UpdateOrderStatusInput, adminUserId);

    sendSuccess(res, {
      message: "Order status updated",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listInventory: RequestHandler = async (req, res, next) => {
  try {
    const result = await adminService.listInventory(req.query as unknown as InventoryListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adjustInventory: RequestHandler = async (req, res, next) => {
  try {
    const adminUserId = getAdminUserIdOrThrow(req.user?.sub);
    const inventory = await adminService.adjustInventory(
      req.params.productId,
      req.body as InventoryAdjustInput,
      adminUserId,
    );

    sendSuccess(res, {
      message: "Inventory adjusted",
      data: {
        inventory,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listCoupons: RequestHandler = async (req, res, next) => {
  try {
    const result = await adminService.listCoupons(req.query as unknown as CouponListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon: RequestHandler = async (req, res, next) => {
  try {
    const coupon = await adminService.createCoupon(req.body as CreateCouponInput);

    sendSuccess(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "Coupon created",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon: RequestHandler = async (req, res, next) => {
  try {
    const coupon = await adminService.updateCoupon(req.params.id, req.body as UpdateCouponInput);

    sendSuccess(res, {
      message: "Coupon updated",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const disableCoupon: RequestHandler = async (req, res, next) => {
  try {
    const coupon = await adminService.disableCoupon(req.params.id);

    sendSuccess(res, {
      message: "Coupon disabled",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await adminService.listUsers(req.query as unknown as UserListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/admin/orders/:id/confirm-payment
 * Xác nhận admin đã nhận được tiền chuyển khoản (BANK_TRANSFER).
 * Tự động kấu trừ kho, đổi trạng thái order và gửi email khách.
 */
export const confirmBankTransferPayment: RequestHandler = async (req, res, next) => {
  try {
    const adminUserId = getAdminUserIdOrThrow(req.user?.sub);
    const result = await adminService.confirmBankTransferPayment(req.params.id, adminUserId);

    sendSuccess(res, {
      message: "Bank transfer payment confirmed. Customer will be notified by email.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder: RequestHandler = async (req, res, next) => {
  try {
    await adminService.deleteOrder(req.params.id);

    sendSuccess(res, {
      message: "Order deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
