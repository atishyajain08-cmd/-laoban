"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // TODO: Replace with real API calls
  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      id: "1",
      name: "Arjun Mehta",
      email,
      avatar: "/-laoban/assets/campaign/laoban-social-3.png",
    });
    return true;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, _password: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      setUser({ id: "1", name, email });
      return true;
    },
    []
  );

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
