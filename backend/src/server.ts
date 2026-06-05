import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.info(`YOUniverse backend listening on port ${env.PORT}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.info(`${signal} received. Closing HTTP server.`);
  server.close(() => {
    console.info("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
