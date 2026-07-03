import { createPublicKey, createVerify, randomUUID, type JsonWebKey } from "crypto";

import type { User } from "@prisma/client";
import { UserRole, UserStatus } from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { comparePassword, hashPassword } from "../../common/utils/hash";
import { signAccessToken } from "../../common/utils/jwt";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import type { AuthResponse, AuthUserDto } from "./auth.types";
import type { GoogleLoginInput, LoginInput, RegisterInput, UpdateAvatarInput, UpdateProfileInput } from "./auth.validation";

type GoogleJwtHeader = {
  alg?: string;
  kid?: string;
  typ?: string;
};

type GoogleJwtPayload = {
  iss?: string;
  aud?: string | string[];
  sub?: string;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  exp?: number;
  iat?: number;
};

type GoogleJwk = {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
};

type GoogleJwksResponse = {
  keys: GoogleJwk[];
};

let googleJwksCache: { keys: GoogleJwk[]; expiresAt: number } | null = null;

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"]);

const decodeBase64Url = (value: string): Buffer => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  return Buffer.from(padded, "base64");
};

const parseJwtPart = <T>(value: string): T => {
  try {
    return JSON.parse(decodeBase64Url(value).toString("utf8")) as T;
  } catch {
    throw new AppError("Invalid Google credential", HTTP_STATUS.BAD_REQUEST);
  }
};

const getCacheMaxAgeMs = (cacheControl: string | null): number => {
  const maxAge = cacheControl?.match(/max-age=(\d+)/i)?.[1];
  const seconds = maxAge ? Number(maxAge) : 3600;

  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 3600 * 1000;
};

const getGoogleJwks = async (forceRefresh = false): Promise<GoogleJwk[]> => {
  const now = Date.now();

  if (!forceRefresh && googleJwksCache && googleJwksCache.expiresAt > now) {
    return googleJwksCache.keys;
  }

  const response = await fetch(GOOGLE_JWKS_URL);

  if (!response.ok) {
    throw new AppError("Could not verify Google credential", HTTP_STATUS.BAD_REQUEST);
  }

  const payload = (await response.json()) as GoogleJwksResponse;
  const maxAgeMs = getCacheMaxAgeMs(response.headers.get("cache-control"));

  googleJwksCache = {
    keys: payload.keys,
    expiresAt: now + maxAgeMs,
  };

  return payload.keys;
};

const verifyGoogleJwtSignature = async (credential: string): Promise<GoogleJwtPayload> => {
  const parts = credential.split(".");

  if (parts.length !== 3) {
    throw new AppError("Invalid Google credential", HTTP_STATUS.BAD_REQUEST);
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJwtPart<GoogleJwtHeader>(encodedHeader);

  if (header.alg !== "RS256" || !header.kid) {
    throw new AppError("Invalid Google credential", HTTP_STATUS.BAD_REQUEST);
  }

  let keys = await getGoogleJwks();
  let jwk = keys.find((item) => item.kid === header.kid);

  if (!jwk) {
    keys = await getGoogleJwks(true);
    jwk = keys.find((item) => item.kid === header.kid);
  }

  if (!jwk) {
    throw new AppError("Could not verify Google credential", HTTP_STATUS.BAD_REQUEST);
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();

  const publicKey = createPublicKey({
    key: jwk as JsonWebKey,
    format: "jwk",
  });
  const isValid = verifier.verify(publicKey, decodeBase64Url(encodedSignature));

  if (!isValid) {
    throw new AppError("Invalid Google credential", HTTP_STATUS.UNAUTHORIZED);
  }

  return parseJwtPart<GoogleJwtPayload>(encodedPayload);
};

const verifyGoogleCredential = async (credential: string): Promise<GoogleJwtPayload> => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AppError("Google login is not configured", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  const payload = await verifyGoogleJwtSignature(credential);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  const emailVerified = payload.email_verified === true || payload.email_verified === "true";
  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (!payload.iss || !GOOGLE_ISSUERS.has(payload.iss)) {
    throw new AppError("Invalid Google credential issuer", HTTP_STATUS.UNAUTHORIZED);
  }

  if (!audiences.includes(env.GOOGLE_CLIENT_ID)) {
    throw new AppError("Invalid Google credential audience", HTTP_STATUS.UNAUTHORIZED);
  }

  if (!payload.exp || payload.exp <= nowInSeconds) {
    throw new AppError("Google credential has expired", HTTP_STATUS.UNAUTHORIZED);
  }

  if (!payload.sub || !payload.email || !emailVerified) {
    throw new AppError("Google account email is not verified", HTTP_STATUS.UNAUTHORIZED);
  }

  return payload;
};

const toAuthUserDto = (user: User & { addresses?: any[] }): AuthUserDto => {
  const defaultAddress = user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0];
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    address: defaultAddress ? defaultAddress.addressLine : null,
  };
};

const createAuthResponse = (user: User): AuthResponse => ({
  user: toAuthUserDto(user),
  accessToken: signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  }),
});

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      addresses: true,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", HTTP_STATUS.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
    include: {
      addresses: true,
    },
  });

  return createAuthResponse(user);
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError("Account is not active", HTTP_STATUS.FORBIDDEN);
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  return createAuthResponse(user);
};

export const loginWithGoogle = async (input: GoogleLoginInput): Promise<AuthResponse> => {
  const googleUser = await verifyGoogleCredential(input.credential);
  const email = googleUser.email?.toLowerCase();

  if (!email) {
    throw new AppError("Google account email is required", HTTP_STATUS.UNAUTHORIZED);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      addresses: true,
    },
  });

  if (existingUser) {
    if (existingUser.status !== UserStatus.ACTIVE) {
      throw new AppError("Account is not active", HTTP_STATUS.FORBIDDEN);
    }

    const nextUser = existingUser.emailVerified && (existingUser.avatarUrl || !googleUser.picture)
      ? existingUser
      : await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            emailVerified: true,
            avatarUrl: existingUser.avatarUrl ?? googleUser.picture ?? null,
          },
          include: {
            addresses: true,
          },
        });

    return createAuthResponse(nextUser);
  }

  const fullName = googleUser.name?.trim() || email.split("@")[0] || "YOUniverse Customer";
  const passwordHash = await hashPassword(`google:${googleUser.sub}:${randomUUID()}`);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      avatarUrl: googleUser.picture ?? null,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    include: {
      addresses: true,
    },
  });

  return createAuthResponse(user);
};

export const updateAvatar = async (userId: string, input: UpdateAvatarInput): Promise<AuthUserDto> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError("Account is not active", HTTP_STATUS.FORBIDDEN);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl: input.avatarUrl,
    },
    include: {
      addresses: true,
    },
  });

  return toAuthUserDto(updatedUser);
};

export const getMe = async (userId: string): Promise<AuthUserDto> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError("Account is not active", HTTP_STATUS.FORBIDDEN);
  }

  return toAuthUserDto(user);
};

export const updateProfile = async (userId: string, input: UpdateProfileInput): Promise<AuthUserDto> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError("Account is not active", HTTP_STATUS.FORBIDDEN);
  }

  const updateData: any = {};
  if (input.fullName !== undefined) updateData.fullName = input.fullName;
  if (input.phone !== undefined) updateData.phone = input.phone;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });

  if (input.address !== undefined) {
    const defaultAddress = user.addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      await prisma.address.update({
        where: {
          id: defaultAddress.id,
        },
        data: {
          fullName: input.fullName ?? updatedUser.fullName,
          phone: input.phone ?? updatedUser.phone ?? "",
          addressLine: input.address,
        },
      });
    } else {
      await prisma.address.create({
        data: {
          userId,
          fullName: input.fullName ?? updatedUser.fullName,
          phone: input.phone ?? updatedUser.phone ?? "",
          addressLine: input.address,
          isDefault: true,
        },
      });
    }
  }

  const finalUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: true,
    },
  });

  return toAuthUserDto(finalUser!);
};
