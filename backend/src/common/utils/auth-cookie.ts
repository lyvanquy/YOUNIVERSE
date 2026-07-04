import type { Response } from "express";

import { env } from "../../config/env";

export const AUTH_COOKIE_NAME = env.NODE_ENV === "production"
  ? "__Secure-youniverse_session"
  : "youniverse_session";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  path: "/api/v1",
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
};

export const getAuthCookie = (cookieHeader: string | undefined): string | undefined => {
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === AUTH_COOKIE_NAME) {
      try {
        return decodeURIComponent(rawValue.join("="));
      } catch {
        return undefined;
      }
    }
  }

  return undefined;
};
