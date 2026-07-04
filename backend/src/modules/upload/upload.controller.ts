import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { sendSuccess } from "../../common/utils/response";
import { saveUploadedImage } from "./upload.service";

/**
 * POST /api/v1/upload/image
 * Upload 1 file ảnh, trả về URL công khai.
 * Dùng multipart/form-data với field name "file".
 */
export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded", HTTP_STATUS.BAD_REQUEST);
    }

    const url = await saveUploadedImage(req.file);

    sendSuccess(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "File uploaded successfully",
      data: { url },
    });
  } catch (error) {
    next(error);
  }
};
