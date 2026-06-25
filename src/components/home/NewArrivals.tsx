"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/product/ProductCard";
import { getNewArrivals } from "@/data/products";
import Link from "next/link";

export default function NewArrivals() {
  const products = getNewArrivals();

  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Just Dropped
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            New Arrivals
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop?filter=new"
            className="inline-block px-8 py-3 border-2 border-charcoal text-charcoal text-sm tracking-[0.15em] uppercase hover:bg-charcoal hover:text-white transition-colors duration-300"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
