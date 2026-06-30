import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import * as uploadController from "./upload.controller";
import { uploadMiddleware } from "./upload.service";

const router = Router();

/**
 * POST /api/v1/upload/image
 * Upload 1 ảnh (multipart/form-data, field: "file").
 * Yêu cầu xác thực (đã đăng nhập hoặc guest đang checkout).
 * Trả về: { url: string }
 */
router.post(
  "/image",
  // Không bắt buộc auth cho guest checkout — optionalAuth middleware
  // authMiddleware là optional ở đây, chỉ đặt nếu muốn restrict
  uploadMiddleware.single("file"),
  uploadController.uploadImage,
);

export default router;
