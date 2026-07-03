"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Step = "email" | "password" | "done";

export default function ForgotPasswordPage() {
  const { hasAccount, resetPassword } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hasAccount(email)) {
      setError("No Laoban account found with this email on this device. You can create a new account instead.");
      return;
    }
    setStep("password");
  };

  const saveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const ok = await resetPassword(email, password);
      if (!ok) {
        setError("Could not reset the password. Please try again.");
        return;
      }
      setStep("done");
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
            {step === "email" && "Enter your account email to set a new password"}
            {step === "password" && `Set a new password for ${email}`}
            {step === "done" && "All set"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">{error}</div>
        )}

        {step === "email" && (
          <form onSubmit={verifyEmail} className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
                placeholder="you@example.com" />
            </div>
            <button type="submit"
              className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
              Continue
            </button>
            <p className="text-center text-sm text-warm-gray">
              <Link href="/auth/login" className="text-gold hover:underline">Back to Sign In</Link>
              {" · "}
              <Link href="/auth/signup" className="text-gold hover:underline">Create Account</Link>
            </p>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={saveNewPassword} className="space-y-5">
            <div>
              <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">New Password</label>
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
              <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Confirm New Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors disabled:opacity-50">
              <KeyRound size={15} />
              {loading ? "Saving..." : "Set New Password"}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-lg mb-2">Password Updated</h3>
            <p className="text-warm-gray text-sm mb-6">
              Your password has been changed. Sign in with your new password to continue.
            </p>
            <Link href="/auth/login"
              className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
