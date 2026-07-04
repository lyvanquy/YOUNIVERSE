import { UserStatus } from "@prisma/client";
import type { Request, RequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { prisma } from "../../config/prisma";
import { isAllowedOrigin } from "../../config/cors";
import { AppError } from "../errors/AppError";
import { HTTP_STATUS } from "../errors/errorCodes";
import type { JwtPayload } from "../types/auth";
import { clearAuthCookie, getAuthCookie } from "../utils/auth-cookie";
import { verifyAccessToken } from "../utils/jwt";

const getBearerToken = (header: string | undefined): string | undefined =>
  header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : undefined;

const getRequestToken = (req: Request): { token?: string; fromCookie: boolean } => {
  const bearerToken = getBearerToken(req.headers.authorization);
  if (bearerToken) return { token: bearerToken, fromCookie: false };

  return {
    token: getAuthCookie(req.headers.cookie),
    fromCookie: true,
  };
};

const validateCookieRequestOrigin = (req: Request, fromCookie: boolean): void => {
  if (!fromCookie || ["GET", "HEAD", "OPTIONS"].includes(req.method)) return;

  if (!isAllowedOrigin(req.headers.origin)) {
    throw new AppError("Untrusted request origin", HTTP_STATUS.FORBIDDEN);
  }
};

const decodeToken = (token: string): JwtPayload => {
  try {
    return verifyAccessToken(token);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError("Token expired", HTTP_STATUS.UNAUTHORIZED);
    }

    if (error instanceof JsonWebTokenError || error instanceof Error) {
      throw new AppError("Invalid authentication token", HTTP_STATUS.UNAUTHORIZED);
    }

    throw error;
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

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const { token, fromCookie } = getRequestToken(req);

  if (!token) {
    next(new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  res.setHeader("Cache-Control", "private, no-store");

  try {
    validateCookieRequestOrigin(req, fromCookie);
  } catch (error) {
    next(error);
    return;
  }

  let payload: JwtPayload;
  try {
    payload = decodeToken(token);
  } catch (error) {
    if (fromCookie) clearAuthCookie(res);
    next(error);
    return;
  }

  try {
    req.user = await loadCurrentUser(payload);
    next();
  } catch (error) {
    if (fromCookie) clearAuthCookie(res);
    next(error);
  }
};

export const optionalAuthMiddleware: RequestHandler = async (req, res, next) => {
  const { token, fromCookie } = getRequestToken(req);

  if (!token) {
    next();
    return;
  }

  res.setHeader("Cache-Control", "private, no-store");

  try {
    validateCookieRequestOrigin(req, fromCookie);
  } catch (error) {
    next(error);
    return;
  }

  let payload: JwtPayload;
  try {
    payload = decodeToken(token);
  } catch (error) {
    if (fromCookie) clearAuthCookie(res);
    next(error);
    return;
  }

  try {
    req.user = await loadCurrentUser(payload);
    next();
  } catch (error) {
    if (fromCookie) clearAuthCookie(res);
    next(error);
  }
};
