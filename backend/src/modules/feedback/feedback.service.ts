import { prisma } from "../../config/prisma";
import type { CreateFeedbackInput, FeedbackListQuery } from "./feedback.validation";

/**
 * Lưu một feedback mới từ form "Unleash Your YOUniverse".
 */
export const createFeedback = async (input: CreateFeedbackInput) => {
  const feedback = await prisma.feedback.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      message: input.message,
    },
  });

  return feedback;
};

/**
 * Lấy danh sách feedback (admin only).
 * Có hỗ trợ tìm kiếm theo tên/email và phân trang.
 */
export const listFeedbacks = async (query: FeedbackListQuery) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { message: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.feedback.count({ where }),
  ]);

  return {
    feedbacks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Xóa một feedback (admin only).
 */
export const deleteFeedback = async (id: string) => {
  const feedback = await prisma.feedback.findUnique({ where: { id } });

  if (!feedback) {
    return null;
  }

  await prisma.feedback.delete({ where: { id } });

  return feedback;
};
