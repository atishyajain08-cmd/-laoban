"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { categories } from "@/data/categories";

export default function FeaturedCollections() {
  return (
    <section className="py-20 md:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Curated For You
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            Shop by Category
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.id} delay={i * 0.1}>
              <Link href={`/shop?category=${cat.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -8 }}
                  className="relative aspect-[3/4] overflow-hidden bg-ivory"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="font-display text-lg md:text-xl text-white mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-white/60 text-xs hidden md:block">
                      {cat.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
