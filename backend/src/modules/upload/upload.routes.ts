import { Router, type RequestHandler } from "express";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { optionalAuthMiddleware } from "../../common/middlewares/auth.middleware";
import { uploadRateLimit } from "../../common/middlewares/rate-limit.middleware";
import { parseGuestSessionId } from "../../common/utils/session";
import { prisma } from "../../config/prisma";
import * as uploadController from "./upload.controller";
import { uploadMiddleware } from "./upload.service";

const router = Router();
const requireUploadIdentity: RequestHandler = async (req, _res, next) => {
  const sessionId = parseGuestSessionId(req.headers["x-session-id"]);

  if (req.user) {
    next();
    return;
  }

  if (!sessionId) {
    next(new AppError("Authentication or a valid guest session is required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  try {
    const guestOrder = await prisma.order.findFirst({
      where: {
        guestSessionId: sessionId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    if (!guestOrder) {
      next(new AppError("Guest upload session is invalid or expired", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/upload/image
 * Upload 1 ảnh (multipart/form-data, field: "file").
 * Yêu cầu xác thực (đã đăng nhập hoặc guest đang checkout).
 * Trả về: { url: string }
 */
router.post(
  "/image",
  uploadRateLimit,
  optionalAuthMiddleware,
  requireUploadIdentity,
  uploadMiddleware.single("file"),
  uploadController.uploadImage,
);

export default router;
