"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await signup(name, email, password);
      if (!result.ok) {
        setError(result.message || "Failed to create account.");
        return;
      }
      if (result.needsEmailConfirm) {
        setConfirmSent(true);
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="font-display text-xl mt-4 text-charcoal">Create Account</h2>
          <p className="text-warm-gray text-sm mt-1">Join the Laoban club</p>
        </div>

        {confirmSent ? (
          <div className="text-center py-6">
            <h3 className="font-display text-lg mb-2 text-charcoal">Confirm Your Email</h3>
            <p className="text-warm-gray text-sm mb-6">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>.
              Open it, then sign in to continue.
            </p>
            <Link href="/auth/login" className="text-gold hover:underline text-sm font-medium">
              Go to Sign In
            </Link>
          </div>
        ) : (
        <>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={8}
                className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm pr-10"
                placeholder="Min 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-warm-gray mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold hover:underline font-medium">Sign In</Link>
        </p>
        </>
        )}
      </motion.div>
    </div>
  );
}
