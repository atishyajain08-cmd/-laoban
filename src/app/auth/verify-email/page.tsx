"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-10 border border-ivory-dark text-center">
        <Link href="/" className="font-display text-2xl tracking-[0.15em] text-charcoal">LAOBAN</Link>
        <div className="py-8">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-gold" />
          </div>
          <h2 className="font-display text-xl text-charcoal mb-3">Verify Your Email</h2>
          <p className="text-warm-gray text-sm mb-6 leading-relaxed">
            We&apos;ve sent a verification link to your email address.
            Please check your inbox and click the link to activate your account.
          </p>
          <div className="bg-ivory p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-charcoal">
              <CheckCircle size={16} className="text-gold" />
              Didn&apos;t receive the email? Check your spam folder.
            </div>
          </div>
          <button className="w-full py-3 border border-charcoal text-charcoal text-sm tracking-[0.15em] uppercase hover:bg-charcoal hover:text-white transition-colors mb-4">
            Resend Verification Email
          </button>
          <Link href="/auth/login" className="text-gold hover:underline text-sm">Back to Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
