import jwt, { type SignOptions } from "jsonwebtoken";

import type { JwtPayload } from "../types/auth";
import { env } from "../../config/env";

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    algorithm: "HS256",
    issuer: "youniverse-api",
    audience: "youniverse-web",
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

export const verifyAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: "youniverse-api",
    audience: "youniverse-web",
  });

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.tokenVersion !== "number" ||
    (decoded.role !== "CUSTOMER" && decoded.role !== "ADMIN")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
    tokenVersion: decoded.tokenVersion,
  };
};
