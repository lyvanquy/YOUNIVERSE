import { Router } from "express";

import { sendSuccess } from "../../common/utils/response";
import { env } from "../../config/env";

const router = Router();

router.get("/", (_req, res) => {
  sendSuccess(res, {
    message: "OK",
    data: {
      service: "youniverse-backend",
      status: "healthy",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
