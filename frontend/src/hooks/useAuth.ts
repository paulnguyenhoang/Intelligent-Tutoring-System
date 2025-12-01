import { useState, useEffect } from "react";
import type { User } from "../types";
import { STORAGE_KEYS, ROUTES } from "../constants";
import { parseJSON } from "../utils";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      setUser(parseJSON<User>(userStr, null as any));
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    window.location.href = ROUTES.SIGN_IN;
  };

  const getRedirectPath = (role: string) => {
    return role === "teacher" ? ROUTES.TEACHER : ROUTES.QUIZ;
  };

  return { user, login, logout, isAuthenticated: !!user, getRedirectPath };
}
