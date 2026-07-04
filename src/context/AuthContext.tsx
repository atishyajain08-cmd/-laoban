"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

// Customer accounts live in Supabase Auth (GoTrue). Passwords are stored
// hashed by Supabase; password recovery happens via emailed reset links.
const SUPABASE_URL = "https://lzbdavmurwmrsbfhubtu.supabase.co";
const ANON_KEY = "sb_publishable_4YMXFJhyg-Gf37mrOweG7g_ISIRDiOF";
const SESSION_KEY = "laoban_sb_session";
const SITE_URL = "https://atishyajain08-cmd.github.io/-laoban";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  houseNumber?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// Delivery details captured at signup so checkout can prefill them.
export interface SignupProfile {
  phone?: string;
  houseNumber?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface SbSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  user: User;
}

export interface AuthResult {
  ok: boolean;
  message?: string;
  needsEmailConfirm?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, profile?: SignupProfile) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  completePasswordReset: (accessToken: string, newPassword: string) => Promise<AuthResult>;
  sendEmailOtp: () => Promise<AuthResult>;
  verifyEmailOtp: (code: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_HEADERS = { apikey: ANON_KEY, "Content-Type": "application/json" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(sbUser: any): User {
  const meta = sbUser?.user_metadata || {};
  return {
    id: String(sbUser?.id || ""),
    email: String(sbUser?.email || ""),
    name: String(meta.full_name || meta.name || sbUser?.email?.split("@")[0] || "Customer"),
    phone: meta.phone ? String(meta.phone) : undefined,
    avatar: meta.avatar ? String(meta.avatar) : undefined,
    bio: meta.bio ? String(meta.bio) : undefined,
    houseNumber: meta.house_number ? String(meta.house_number) : undefined,
    street: meta.street ? String(meta.street) : undefined,
    landmark: meta.landmark ? String(meta.landmark) : undefined,
    city: meta.city ? String(meta.city) : undefined,
    state: meta.state ? String(meta.state) : undefined,
    pincode: meta.pincode ? String(meta.pincode) : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function friendlyError(payload: any): string {
  const code = payload?.error_code || payload?.code || "";
  const raw = String(payload?.msg || payload?.message || payload?.error_description || "");
  if (code === "invalid_credentials" || /invalid login credentials/i.test(raw))
    return "Invalid email or password.";
  if (code === "email_not_confirmed" || /not confirmed/i.test(raw))
    return "Please confirm your email first — check your inbox for the confirmation link.";
  if (code === "user_already_exists" || /already registered/i.test(raw))
    return "An account with this email already exists. Please sign in instead.";
  if (code === "over_email_send_rate_limit" || /rate limit/i.test(raw))
    return "Too many emails requested. Please wait a few minutes and try again.";
  if (code === "otp_expired" || /expired or is invalid/i.test(raw))
    return "That code is incorrect or has expired. Check the digits or resend a fresh code.";
  if (/password.*(short|least)/i.test(raw)) return "Password must be at least 8 characters.";
  return raw || "Something went wrong. Please try again.";
}

function readSession(): SbSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SbSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: SbSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adoptTokenPayload = useCallback((payload: any): User => {
    const nextUser = mapUser(payload.user);
    const session: SbSession = {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at: payload.expires_at || Math.floor(Date.now() / 1000) + (payload.expires_in || 3600),
      user: nextUser,
    };
    writeSession(session);
    setUser(nextUser);
    return nextUser;
  }, []);

  // Restore (and refresh) the session so customers stay signed in.
  useEffect(() => {
    const session = readSession();
    if (!session) return;
    const stillValid = session.expires_at - 60 > Math.floor(Date.now() / 1000);
    if (stillValid) {
      setUser(session.user);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
          method: "POST",
          headers: BASE_HEADERS,
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        const payload = await res.json();
        if (res.ok && payload.access_token) adoptTokenPayload(payload);
        else writeSession(null);
      } catch {
        // Network hiccup: keep the stored session so the customer isn't logged out offline.
        setUser(session.user);
      }
    })();
  }, [adoptTokenPayload]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: BASE_HEADERS,
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const payload = await res.json();
        if (!res.ok) return { ok: false, message: friendlyError(payload) };
        adoptTokenPayload(payload);
        return { ok: true };
      } catch {
        return { ok: false, message: "Could not reach the server. Check your connection and try again." };
      }
    },
    [adoptTokenPayload]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, profile?: SignupProfile): Promise<AuthResult> => {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: "POST",
          headers: BASE_HEADERS,
          body: JSON.stringify({
            email: email.trim(),
            password,
            data: {
              full_name: name.trim(),
              phone: profile?.phone?.trim() || undefined,
              house_number: profile?.houseNumber?.trim() || undefined,
              street: profile?.street?.trim() || undefined,
              landmark: profile?.landmark?.trim() || undefined,
              city: profile?.city?.trim() || undefined,
              state: profile?.state?.trim() || undefined,
              pincode: profile?.pincode?.trim() || undefined,
            },
          }),
        });
        const payload = await res.json();
        if (!res.ok) return { ok: false, message: friendlyError(payload) };
        // Session present → email confirmation is off; signed in immediately.
        if (payload.access_token) {
          adoptTokenPayload(payload);
          return { ok: true };
        }
        // Duplicate emails come back as a fake user with no identities.
        if (Array.isArray(payload?.identities) && payload.identities.length === 0) {
          return { ok: false, message: "An account with this email already exists. Please sign in instead." };
        }
        return { ok: true, needsEmailConfirm: true };
      } catch {
        return { ok: false, message: "Could not reach the server. Check your connection and try again." };
      }
    },
    [adoptTokenPayload]
  );

  const logout = useCallback(() => {
    const session = readSession();
    if (session?.access_token) {
      fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: { ...BASE_HEADERS, Authorization: `Bearer ${session.access_token}` },
      }).catch(() => {});
    }
    writeSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...data };
      const session = readSession();
      if (session) {
        writeSession({ ...session, user: next });
        fetch(`${SUPABASE_URL}/auth/v1/user`, {
          method: "PUT",
          headers: { ...BASE_HEADERS, Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({
            data: {
              full_name: next.name,
              phone: next.phone,
              bio: next.bio,
              avatar: next.avatar,
              house_number: next.houseNumber,
              street: next.street,
              landmark: next.landmark,
              city: next.city,
              state: next.state,
              pincode: next.pincode,
            },
          }),
        }).catch(() => {});
      }
      return next;
    });
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const redirect = encodeURIComponent(`${SITE_URL}/reset-password/`);
      const res = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${redirect}`, {
        method: "POST",
        headers: BASE_HEADERS,
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        return { ok: false, message: friendlyError(payload) };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: "Could not reach the server. Check your connection and try again." };
    }
  }, []);

  // Order-verification OTP: a 6-digit code emailed to the signed-in
  // customer's own address; the order is only saved after it verifies.
  const sendEmailOtp = useCallback(async (): Promise<AuthResult> => {
    const session = readSession();
    const email = session?.user?.email;
    if (!email) return { ok: false, message: "Please sign in again to continue." };
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
        method: "POST",
        headers: BASE_HEADERS,
        body: JSON.stringify({ email, create_user: false }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        return { ok: false, message: friendlyError(payload) };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: "Could not reach the server. Check your connection and try again." };
    }
  }, []);

  const verifyEmailOtp = useCallback(
    async (code: string): Promise<AuthResult> => {
      const session = readSession();
      const email = session?.user?.email;
      if (!email) return { ok: false, message: "Please sign in again to continue." };
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
          method: "POST",
          headers: BASE_HEADERS,
          body: JSON.stringify({ type: "email", email, token: code.trim() }),
        });
        const payload = await res.json();
        if (!res.ok) return { ok: false, message: friendlyError(payload) };
        // Same customer, fresh session — adopt it to stay signed in.
        if (payload.access_token) adoptTokenPayload(payload);
        return { ok: true };
      } catch {
        return { ok: false, message: "Could not reach the server. Check your connection and try again." };
      }
    },
    [adoptTokenPayload]
  );

  const completePasswordReset = useCallback(
    async (accessToken: string, newPassword: string): Promise<AuthResult> => {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          method: "PUT",
          headers: { ...BASE_HEADERS, Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ password: newPassword }),
        });
        const payload = await res.json();
        if (!res.ok) return { ok: false, message: friendlyError(payload) };
        return { ok: true };
      } catch {
        return { ok: false, message: "Could not reach the server. Check your connection and try again." };
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        requestPasswordReset,
        completePasswordReset,
        sendEmailOtp,
        verifyEmailOtp,
      }}
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
