import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../lib/api";
import type { AuthUser } from "../../types/api";

type LoginResult = {
  user: AuthUser;
  accessToken: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBooting: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "youniverse_admin_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBooting, setIsBooting] = useState(Boolean(token));

  const logout = () => {
    if (token) {
      void apiRequest("/auth/logout", { method: "POST", token, keepalive: true }).catch(() => undefined);
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshMe = async () => {
    if (!token) return;
    const data = await apiRequest<{ user: AuthUser }>("/auth/me", { token });
    setUser(data.user);
  };

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!token) {
        setIsBooting(false);
        return;
      }

      try {
        const data = await apiRequest<{ user: AuthUser }>("/auth/me", { token });
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setIsBooting(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<LoginResult>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (data.user.role !== "ADMIN") {
      throw new Error("Tài khoản này không có quyền quản trị.");
    }

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setToken(data.accessToken);
    setUser(data.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "ADMIN",
      isBooting,
      login,
      logout,
      refreshMe,
    }),
    [user, token, isBooting],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
