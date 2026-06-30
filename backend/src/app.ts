import path from "path";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { corsOptions } from "./config/cors";
import { errorMiddleware, notFoundMiddleware } from "./common/middlewares/error.middleware";
import { requestLogger } from "./common/middlewares/request-logger.middleware";
import adminRoutes from "./modules/admin/admin.routes";
import authRoutes from "./modules/auth/auth.routes";
import cartRoutes from "./modules/cart/cart.routes";
import categoryRoutes from "./modules/categories/category.routes";
import checkoutRoutes from "./modules/checkout/checkout.routes";
import feedbackRoutes from "./modules/feedback/feedback.routes";
import healthRoutes from "./modules/health/health.routes";
import orderRoutes from "./modules/orders/order.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import productRoutes from "./modules/products/product.routes";
import uploadRoutes from "./modules/upload/upload.routes";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Serve uploaded files statically
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
