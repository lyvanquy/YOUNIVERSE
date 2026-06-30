import { z } from "zod";

export const createFeedbackSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be under 2000 characters"),
});

export const feedbackListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional().default(""),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type FeedbackListQuery = z.infer<typeof feedbackListQuerySchema>;
