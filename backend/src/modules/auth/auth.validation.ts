import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Invalid email").toLowerCase(),
    phone: z.string().trim().min(1).optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const googleLoginSchema = z.object({
  credential: z.string().trim().min(1, "Google credential is required"),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().trim().url("Invalid avatar URL").max(1000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
