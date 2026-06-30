import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { sendSuccess } from "../../common/utils/response";
import * as feedbackService from "./feedback.service";
import type { CreateFeedbackInput, FeedbackListQuery } from "./feedback.validation";

/**
 * POST /api/v1/feedback
 * Public endpoint — Gửi feedback từ form "Unleash Your YOUniverse".
 */
export const createFeedback: RequestHandler = async (req, res, next) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body as CreateFeedbackInput);

    sendSuccess(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "Feedback submitted successfully. Thank you for sharing your YOUniverse!",
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/feedbacks
 * Admin only — Lấy danh sách feedback.
 */
export const listFeedbacks: RequestHandler = async (req, res, next) => {
  try {
    const result = await feedbackService.listFeedbacks(req.query as unknown as FeedbackListQuery);

    sendSuccess(res, {
      message: "OK",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/admin/feedbacks/:id
 * Admin only — Xóa một feedback.
 */
export const deleteFeedback: RequestHandler = async (req, res, next) => {
  try {
    const feedback = await feedbackService.deleteFeedback(req.params.id);

    if (!feedback) {
      throw new AppError("Feedback not found", HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, {
      message: "Feedback deleted",
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};
