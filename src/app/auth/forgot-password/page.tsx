"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setError(result.message || "Could not send the reset email. Please try again.");
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-10 border border-ivory-dark">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl tracking-[0.15em] text-charcoal">LAOBAN</Link>
          <h2 className="font-display text-xl mt-4 text-charcoal">Reset Password</h2>
          <p className="text-warm-gray text-sm mt-1">
            We&apos;ll email you a secure link to set a new password
          </p>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <Mail size={48} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-lg mb-2">Check Your Email</h3>
            <p className="text-warm-gray text-sm mb-6">
              If an account exists for <strong>{email}</strong>, a password reset
              link is on its way. Check your inbox and spam folder — the link is
              valid for a limited time.
            </p>
            <Link href="/auth/login" className="text-gold hover:underline text-sm font-medium">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">{error}</div>
            )}
            <div>
              <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
                placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors disabled:opacity-50">
              {loading ? "Sending..." : "Email Me a Reset Link"}
            </button>
            <p className="text-center text-sm text-warm-gray">
              <Link href="/auth/login" className="text-gold hover:underline">Back to Sign In</Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
