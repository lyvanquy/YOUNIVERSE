import type { RequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { AppError } from "../errors/AppError";
import { HTTP_STATUS } from "../errors/errorCodes";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : undefined;

  if (!token) {
    next(new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError("Token expired", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (error instanceof JsonWebTokenError || error instanceof Error) {
      next(new AppError("Invalid authentication token", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    next(error);
  }
};

export const optionalAuthMiddleware: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : undefined;

  if (!token) {
    next();
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError("Token expired", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (error instanceof JsonWebTokenError || error instanceof Error) {
      next(new AppError("Invalid authentication token", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    next(error);
  }
};
