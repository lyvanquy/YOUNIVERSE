import { UserStatus } from "@prisma/client";
import type { NextFunction, RequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { prisma } from "../../config/prisma";
import { AppError } from "../errors/AppError";
import { HTTP_STATUS } from "../errors/errorCodes";
import type { JwtPayload } from "../types/auth";
import { verifyAccessToken } from "../utils/jwt";

const getBearerToken = (header: string | undefined): string | undefined =>
  header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : undefined;

const decodeToken = (token: string, next: NextFunction): JwtPayload | null => {
  try {
    return verifyAccessToken(token);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError("Token expired", HTTP_STATUS.UNAUTHORIZED));
      return null;
    }

    if (error instanceof JsonWebTokenError || error instanceof Error) {
      next(new AppError("Invalid authentication token", HTTP_STATUS.UNAUTHORIZED));
      return null;
    }

    next(error);
    return null;
  }
};

const loadCurrentUser = async (payload: JwtPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      tokenVersion: true,
    },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    throw new AppError("Account is not active", HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    throw new AppError("Authentication token has been revoked", HTTP_STATUS.UNAUTHORIZED);
  }

  return {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
};

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    next(new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  const payload = decodeToken(token, next);
  if (!payload) return;

  try {
    req.user = await loadCurrentUser(payload);
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthMiddleware: RequestHandler = async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    next();
    return;
  }

  const payload = decodeToken(token, next);
  if (!payload) return;

  try {
    req.user = await loadCurrentUser(payload);
    next();
  } catch (error) {
    next(error);
  }
};
