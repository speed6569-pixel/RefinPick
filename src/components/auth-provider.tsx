"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { AUTH_STORAGE_KEY, DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from "@/data/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (saved === DEMO_USER_EMAIL) {
      setIsAuthenticated(true);
      setUserEmail(saved);
    }

    setIsReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    if (email !== DEMO_USER_EMAIL || password !== DEMO_USER_PASSWORD) {
      return {
        ok: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다. 데모 계정을 다시 확인해 주세요.",
      };
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, email);
    setIsAuthenticated(true);
    setUserEmail(email);

    return { ok: true };
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated, isReady, userEmail, login, logout }),
    [isAuthenticated, isReady, userEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
