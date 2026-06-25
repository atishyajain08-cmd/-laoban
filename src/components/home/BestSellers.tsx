"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/product/ProductCard";
import { getBestSellers } from "@/data/products";
import Link from "next/link";

export default function BestSellers() {
  const products = getBestSellers();

  return (
    <section className="py-20 md:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Most Loved
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            Best Sellers
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop?filter=bestseller"
            className="inline-block px-8 py-3 bg-gold text-white text-sm tracking-[0.15em] uppercase hover:bg-gold-dark transition-colors duration-300"
          >
            Shop Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
