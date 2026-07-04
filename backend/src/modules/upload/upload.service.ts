import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

import multer from "multer";

import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/errors/errorCodes";
import { env } from "../../config/env";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type DetectedImage = {
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  extension: ".jpg" | ".png" | ".webp" | ".gif";
};

const startsWith = (buffer: Buffer, signature: number[]): boolean =>
  signature.every((value, index) => buffer[index] === value);

const detectImageType = (buffer: Buffer): DetectedImage | null => {
  if (buffer.length >= 3 && startsWith(buffer, [0xff, 0xd8, 0xff])) {
    return { mimeType: "image/jpeg", extension: ".jpg" };
  }

  if (buffer.length >= 8 && startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mimeType: "image/png", extension: ".png" };
  }

  if (buffer.length >= 6 && ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"))) {
    return { mimeType: "image/gif", extension: ".gif" };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mimeType: "image/webp", extension: ".webp" };
  }

  return null;
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter(_req, file, callback) {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new AppError("Invalid image type", HTTP_STATUS.BAD_REQUEST));
  },
  limits: {
    files: 1,
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

export const saveUploadedImage = async (file: Express.Multer.File): Promise<string> => {
  const detected = detectImageType(file.buffer);

  if (!detected || detected.mimeType !== file.mimetype) {
    throw new AppError("File content does not match a supported image type", HTTP_STATUS.BAD_REQUEST);
  }

  const dateDirectory = new Date().toISOString().slice(0, 10);
  const directory = path.join(UPLOAD_DIR, dateDirectory);
  const filename = `${randomUUID()}${detected.extension}`;

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), file.buffer, { flag: "wx" });

  return `${env.BACKEND_URL.replace(/\/$/, "")}/uploads/${dateDirectory}/${filename}`;
};
