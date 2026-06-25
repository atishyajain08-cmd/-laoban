"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function LeadCapture() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gold blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection className="text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Exclusive Access
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-white mb-4">
            Get 10% Off Your First Order
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Sign up for exclusive access to new collections, seasonal sales, and style inspiration delivered straight to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gold/20 border border-gold/30 p-6"
            >
              <p className="text-gold font-display text-xl">Welcome to the club!</p>
              <p className="text-white/60 text-sm mt-2">
                Check your inbox for your exclusive 10% off code.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                // TODO: Connect to email service API (e.g., Mailchimp, SendGrid)
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                placeholder="Your name"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold text-sm"
              />
              <input
                type="email"
                placeholder="Your email"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold text-sm"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gold text-white text-sm tracking-[0.15em] uppercase hover:bg-gold-dark transition-colors font-medium whitespace-nowrap"
              >
                Get 10% Off
              </button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
