import rateLimit from "express-rate-limit";

const createLimiter = (windowMs: number, limit: number, message: string) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

export const apiRateLimit = createLimiter(15 * 60 * 1000, 300, "Too many requests, please try again later");
export const checkoutRateLimit = createLimiter(15 * 60 * 1000, 10, "Too many checkout attempts, please try again later");
export const feedbackRateLimit = createLimiter(15 * 60 * 1000, 5, "Too many feedback submissions, please try again later");
export const receiptRateLimit = createLimiter(15 * 60 * 1000, 10, "Too many receipt submissions, please try again later");
export const uploadRateLimit = createLimiter(15 * 60 * 1000, 30, "Too many uploads, please try again later");
