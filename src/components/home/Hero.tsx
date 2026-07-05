"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-2rem)] overflow-hidden bg-[#c2b29f]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
          <Image
            src="/-laoban/assets/campaign/laoban-knit-hero-model.png"
            alt="Laoban premium knitted T-shirt campaign"
            fill
            className="object-cover object-center md:object-[52%_center]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#c2b29f_0%,#c2b29f_38%,rgba(194,178,159,0.82)_52%,rgba(194,178,159,0)_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_28%,rgba(255,255,255,0.22),transparent_34%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100svh-2rem)] items-center pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-5 text-sm uppercase tracking-[0.32em] text-charcoal"
            >
              Knit Different
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-7 font-display text-5xl leading-[0.92] text-charcoal md:text-7xl lg:text-8xl"
            >
              Made to Move.
              <br />
              <span className="italic text-charcoal">Built to Last.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mb-8 max-w-md text-base leading-8 text-charcoal/75 md:text-lg"
            >
              Premium knitted polos and T-shirts crafted for comfort, movement, and a sharper everyday presence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="px-8 py-4 bg-gold text-white text-sm tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors duration-300"
              >
                Shop Now
              </Link>
              <Link
                href="/shop?filter=new"
                className="px-8 py-4 border border-charcoal/40 text-charcoal text-sm tracking-[0.2em] uppercase hover:bg-charcoal hover:text-white transition-colors duration-300"
              >
                New Arrivals
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8 }}
              className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-charcoal/25 border-t border-charcoal/25 pt-5 text-[10px] uppercase tracking-[0.18em] text-charcoal/80 sm:text-xs"
            >
              <span>Premium Knits</span>
              <span className="pl-5">Soft &amp; Breathable</span>
              <span className="pl-5">Timeless Style</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-charcoal/40 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 bg-charcoal rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
