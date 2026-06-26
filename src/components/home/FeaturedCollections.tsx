"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const flashcards = [
  {
    eyebrow: "New Arrivals",
    title: "Fresh Drops",
    copy: "Latest Laoban essentials, cut clean for everyday presence.",
    href: "/shop?filter=new",
    image: "/-laoban/assets/campaign/hero-black.png",
  },
  {
    eyebrow: "Collection",
    title: "Core Wardrobe",
    copy: "Refined white tees, polos, and quiet luxury staples.",
    href: "/shop?section=collections",
    image: "/-laoban/assets/campaign/ivory-tee.png",
  },
  {
    eyebrow: "Lookbook",
    title: "Styled Edits",
    copy: "Complete men’s looks built around discipline and presence.",
    href: "/shop?section=lookbook",
    image: "/-laoban/assets/campaign/laoban-look-3.png",
  },
  {
    eyebrow: "Products",
    title: "Shop All",
    copy: "Browse every live product uploaded from Laoban backend.",
    href: "/shop",
    image: "/-laoban/assets/campaign/forest-polo.png",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="bg-charcoal py-20 text-white md:py-28">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
        <AnimatedSection className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Enter the Edit
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-white">
            Choose Your Destination
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
            Four clean gateways into Laoban — built like Malteaser’s flashcards,
            tailored for a premium Indian menswear brand.
          </p>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {flashcards.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 0.1}>
              <Link href={card.href} className="group block">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative min-h-[420px] overflow-hidden border border-white/10 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.34)] md:min-h-[520px]"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover opacity-82 transition duration-700 group-hover:scale-105 group-hover:opacity-68"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/16 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                      {card.eyebrow}
                    </span>
                    <span className="h-9 w-9 rounded-full border border-white/30 text-center text-xl leading-8 text-white/80 transition group-hover:border-gold group-hover:text-gold">
                      →
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <h3 className="font-display text-4xl leading-none text-white md:text-5xl">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-white/64">
                      {card.copy}
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
