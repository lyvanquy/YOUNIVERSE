import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { sendSuccess } from "../../common/utils/response";
import { clearAuthCookie, setAuthCookie } from "../../common/utils/auth-cookie";
import * as authService from "./auth.service";
import type { GoogleLoginInput, LoginInput, RegisterInput, UpdateAvatarInput, UpdateProfileInput } from "./auth.validation";

const isStorefrontRequest = (clientHeader: string | undefined): boolean => clientHeader === "storefront";

const buildAuthResponse = <T extends { user: unknown; accessToken: string }>(
  result: T,
  storefront: boolean,
) => storefront ? { user: result.user } : result;

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.register(req.body as RegisterInput);
    const storefront = isStorefrontRequest(req.headers["x-auth-client"] as string | undefined);
    if (storefront) setAuthCookie(res, result.accessToken);

    sendSuccess(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: "Register success",
      data: buildAuthResponse(result, storefront),
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body as LoginInput);
    const storefront = isStorefrontRequest(req.headers["x-auth-client"] as string | undefined);
    if (storefront) setAuthCookie(res, result.accessToken);

    sendSuccess(res, {
      message: "Login success",
      data: buildAuthResponse(result, storefront),
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.loginWithGoogle(req.body as GoogleLoginInput);
    const storefront = isStorefrontRequest(req.headers["x-auth-client"] as string | undefined);
    if (storefront) setAuthCookie(res, result.accessToken);

    sendSuccess(res, {
      message: "Google login success",
      data: buildAuthResponse(result, storefront),
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await authService.getMe(req.user.sub);

    sendSuccess(res, {
      message: "OK",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await authService.updateAvatar(req.user.sub, req.body as UpdateAvatarInput);

    sendSuccess(res, {
      message: "Avatar updated",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await authService.updateProfile(req.user.sub, req.body as UpdateProfileInput);

    sendSuccess(res, {
      message: "Profile updated",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
    }

    await authService.revokeTokens(req.user.sub);
    clearAuthCookie(res);

    sendSuccess(res, {
      message: "Logout success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
