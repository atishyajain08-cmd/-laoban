"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserCircle2, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function nextPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") ? next : "/dashboard";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.message || "Invalid email or password.");
        return;
      }
      router.push(nextPath());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Already signed in → offer account + logout instead of the form.
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 md:p-10 border border-ivory-dark text-center"
        >
          <Link href="/" className="font-display text-2xl tracking-[0.15em] text-charcoal">
            LAOBAN
          </Link>
          <UserCircle2 size={56} className="mx-auto mt-6 text-gold" strokeWidth={1.2} />
          <h2 className="font-display text-xl mt-4 text-charcoal">You&apos;re Signed In</h2>
          <p className="text-warm-gray text-sm mt-2">
            {user.name} · {user.email}
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/cart"
              className="flex w-full items-center justify-center gap-2 py-3 border border-charcoal text-charcoal text-sm tracking-[0.15em] uppercase hover:bg-charcoal hover:text-white transition-colors"
            >
              <ShoppingBag size={15} /> View Bag
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 py-3 border border-ivory-dark text-warm-gray text-sm tracking-[0.15em] uppercase hover:border-red-300 hover:text-red-500 transition-colors"
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-10 border border-ivory-dark"
      >
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl tracking-[0.15em] text-charcoal">
            LAOBAN
          </Link>
          <h2 className="font-display text-xl mt-4 text-charcoal">Welcome Back</h2>
          <p className="text-warm-gray text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-gold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-warm-gray mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            onClick={(e) => {
              // carry the ?next= destination over to signup
              if (typeof window !== "undefined" && window.location.search) {
                e.preventDefault();
                router.push(`/auth/signup${window.location.search}`);
              }
            }}
            className="text-gold hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
