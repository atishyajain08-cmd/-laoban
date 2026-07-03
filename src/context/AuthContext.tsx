"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
}

interface StoredAccount extends User {
  password: string;
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

// Client-side account store for the static site. Accounts live in the
// shopper's own browser; swap for Supabase auth when going fully live.
const ACCOUNTS_KEY = "laoban_accounts";
const SESSION_KEY = "laoban_session";

function readAccounts(): StoredAccount[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function toUser(account: StoredAccount): User {
  const { password: _password, ...user } = account;
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore the session so a signed-in customer stays signed in across visits.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const persistSession = (next: User | null) => {
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 400));
    const account = readAccounts().find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!account || account.password !== password) return false;
    const next = toUser(account);
    setUser(next);
    persistSession(next);
    return true;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 400));
      const accounts = readAccounts();
      const exists = accounts.some(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) return false;
      const account: StoredAccount = {
        id: `LBN-${Date.now().toString(36).toUpperCase()}`,
        name: name.trim(),
        email: email.trim(),
        password,
      };
      writeAccounts([...accounts, account]);
      const next = toUser(account);
      setUser(next);
      persistSession(next);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    persistSession(null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...data };
      persistSession(next);
      const accounts = readAccounts().map((a) =>
        a.id === next.id ? { ...a, ...data } : a
      );
      writeAccounts(accounts);
      return next;
    });
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
