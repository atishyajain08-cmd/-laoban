"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallbackPage() {
  const { completeOAuthLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    (async () => {
      const result = await completeOAuthLogin(window.location.hash || "");
      if (result.ok) {
        let next = "/dashboard";
        try {
          next = sessionStorage.getItem("laoban_oauth_next") || next;
          sessionStorage.removeItem("laoban_oauth_next");
        } catch {
          /* fall back to dashboard */
        }
        router.replace(next.startsWith("/") ? next : "/dashboard");
      } else {
        setError(result.message || "Sign-in did not complete.");
      }
    })();
  }, [completeOAuthLogin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-ivory-dark bg-white p-10 text-center"
      >
        {error ? (
          <>
            <h1 className="font-display text-xl text-charcoal">Sign-In Didn&apos;t Complete</h1>
            <p className="mt-3 text-sm text-warm-gray">{error}</p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block bg-charcoal px-6 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-gold"
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-ivory-dark border-t-gold" />
            <h1 className="font-display text-xl text-charcoal">Signing You In…</h1>
            <p className="mt-2 text-sm text-warm-gray">One moment while we complete your Google sign-in.</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
