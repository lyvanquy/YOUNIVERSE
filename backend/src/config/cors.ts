import type { CorsOptions } from "cors";

import { env } from "./env";

const allowedOrigins = [env.FRONTEND_URL, env.ADMIN_URL]
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isAllowedOrigin = (origin: string | undefined): boolean =>
  Boolean(origin && allowedOrigins.includes(origin));

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
