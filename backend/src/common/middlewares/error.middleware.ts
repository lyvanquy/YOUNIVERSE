import type { ErrorRequestHandler, RequestHandler } from "express";

import { AppError } from "../errors/AppError";
import { HTTP_STATUS } from "../errors/errorCodes";
import { sendError } from "../utils/response";
import { env } from "../../config/env";

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND));
};

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = isAppError ? error.message : "Internal server error";
  const details = isAppError ? error.errors : undefined;

  if (!isAppError || statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error(error);
  }

  sendError(res, {
    message,
    statusCode,
    errors: details,
    stack: env.NODE_ENV === "production" ? undefined : error instanceof Error ? error.stack : undefined,
  });
};
