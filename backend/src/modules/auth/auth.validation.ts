import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password must be at most 72 bytes")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required").max(100),
    email: z.string().trim().max(254).email("Invalid email").toLowerCase(),
    phone: z.string().trim().min(1).max(30).optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().trim().max(254).email("Invalid email").toLowerCase(),
  password: z.string().min(1, "Password is required").max(256),
});

export const googleLoginSchema = z.object({
  credential: z.string().trim().min(1, "Google credential is required"),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().trim().url("Invalid avatar URL").max(1000).refine(
    (value) => /^https?:\/\//i.test(value),
    "Avatar URL must use HTTP or HTTPS",
  ),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100).optional(),
  phone: z.string().trim().min(1, "Phone is required").max(30).optional(),
  address: z.string().trim().min(1, "Address is required").max(500).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
