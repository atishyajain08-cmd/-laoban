"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[90vh] md:h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/-laoban/assets/campaign/laoban-knit-hero.png"
          alt="Laoban premium knitted T-shirt campaign"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gold text-sm tracking-[0.3em] uppercase mb-4"
            >
              Knit Different
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-6"
            >
              Made to Move.
              <br />
              <span className="text-gradient-gold italic">Built to Last.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-white/70 text-base md:text-lg mb-8 max-w-md"
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
                className="px-8 py-4 border border-white/40 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-charcoal transition-colors duration-300"
              >
                New Arrivals
              </Link>
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
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
