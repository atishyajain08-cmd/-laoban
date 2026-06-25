"use client";
import Image from "next/image";
import { Camera } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const images = [
  "/assets/campaign/laoban-social-1.png",
  "/assets/campaign/laoban-social-2.png",
  "/assets/campaign/laoban-social-3.png",
  "/assets/campaign/laoban-social-4.png",
  "/assets/campaign/laoban-social-5.png",
  "/assets/campaign/laoban-social-6.png",
];

export default function InstagramGrid() {
  return (
    <section className="py-20 md:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            @laoban
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-4">
            Follow Our Style
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-gold transition-colors"
          >
            <Camera size={18} />
            Follow us on Instagram
          </a>
        </AnimatedSection>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {images.map((img, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative aspect-square overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Laoban style ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                  <Camera
                    size={24}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
