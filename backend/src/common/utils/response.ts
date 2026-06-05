import type { Response } from "express";

import { HTTP_STATUS } from "../errors/errorCodes";

type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
};

type SuccessOptions<T> = {
  message?: string;
  statusCode?: number;
  data: T;
};

type ErrorOptions = {
  message: string;
  statusCode?: number;
  errors?: unknown;
  stack?: string;
};

export const sendSuccess = <T>(res: Response, options: SuccessOptions<T>): Response<SuccessResponse<T>> => {
  const payload: SuccessResponse<T> = {
    success: true,
    message: options.message ?? "OK",
    data: options.data,
  };

  return res.status(options.statusCode ?? HTTP_STATUS.OK).json(payload);
};

export const sendError = (res: Response, options: ErrorOptions): Response<ErrorResponse> => {
  const payload: ErrorResponse = {
    success: false,
    message: options.message,
  };

  if (options.errors !== undefined) {
    payload.errors = options.errors;
  }

  if (options.stack !== undefined) {
    payload.stack = options.stack;
  }

  return res.status(options.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR).json(payload);
};
