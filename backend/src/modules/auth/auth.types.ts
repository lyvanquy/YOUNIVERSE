import type { UserRole, UserStatus } from "@prisma/client";

export type AuthUserDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  user: AuthUserDto;
  accessToken: string;
};
