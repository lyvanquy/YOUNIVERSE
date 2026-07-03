import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "test" | "production";

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? 4000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
};

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  const nodeEnv = value ?? "development";

  if (nodeEnv === "development" || nodeEnv === "test" || nodeEnv === "production") {
    return nodeEnv;
  }

  throw new Error("NODE_ENV must be development, test, or production");
};

const parseOptionalPort = (value: string | undefined, fallback: number): number => {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("EMAIL_SMTP_PORT must be a positive integer");
  }

  return port;
};

export const env = Object.freeze({
  NODE_ENV: parseNodeEnv(process.env.NODE_ENV),
  PORT: parsePort(process.env.PORT),
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
  ADMIN_URL: process.env.ADMIN_URL ?? "http://localhost:5173",
  BACKEND_URL: process.env.BACKEND_URL ?? "http://localhost:4000",
  JWT_SECRET: process.env.JWT_SECRET ?? "change_this_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  PAYMENT_RETURN_URL: process.env.PAYMENT_RETURN_URL ?? "http://localhost:3000/payment-result",
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET ?? "change_this_secret",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME ?? "YOUniverse",
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS ?? "no-reply@youniverse.local",
  EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST ?? "",
  EMAIL_SMTP_PORT: parseOptionalPort(process.env.EMAIL_SMTP_PORT, 587),
  EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER ?? "",
  EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD ?? "",
});
