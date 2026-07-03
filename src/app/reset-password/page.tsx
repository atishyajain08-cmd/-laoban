"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Stage = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const { completePasswordReset } = useAuth();
  const [stage, setStage] = useState<Stage>("checking");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // The emailed link lands here with the recovery token in the URL fragment.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const type = params.get("type");
    if (accessToken && type === "recovery") {
      setToken(accessToken);
      setStage("ready");
    } else {
      setStage("invalid");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const result = await completePasswordReset(token, password);
      if (!result.ok) {
        setError(result.message || "Could not update the password. The link may have expired — request a new one.");
        return;
      }
      setStage("done");
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
          <h2 className="font-display text-xl mt-4 text-charcoal">Set New Password</h2>
        </div>

        {stage === "checking" && (
          <p className="text-center text-warm-gray text-sm py-8">Verifying your reset link…</p>
        )}

        {stage === "invalid" && (
          <div className="text-center py-8">
            <AlertTriangle size={44} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-lg mb-2">Link Invalid or Expired</h3>
            <p className="text-warm-gray text-sm mb-6">
              This reset link is no longer valid. Request a fresh one and use it
              soon after it arrives.
            </p>
            <Link href="/auth/forgot-password"
              className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
              Request New Link
            </Link>
          </div>
        )}

        {stage === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">{error}</div>
            )}
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

        {stage === "done" && (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-lg mb-2">Password Updated</h3>
            <p className="text-warm-gray text-sm mb-6">
              Your password has been changed securely. Sign in with your new password.
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
