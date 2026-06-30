import fs from "fs";
import path from "path";

import multer from "multer";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { env } from "../../config/env";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Đảm bảo thư mục upload tồn tại
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const dir = path.join(UPLOAD_DIR, today);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

/**
 * Chuyển đổi đường dẫn file local → public URL có thể truy cập từ browser.
 */
export const fileToPublicUrl = (file: Express.Multer.File): string => {
  const relativePath = path.relative(UPLOAD_DIR, file.path).replace(/\\/g, "/");

  return `${env.BACKEND_URL}/uploads/${relativePath}`;
};
