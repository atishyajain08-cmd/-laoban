"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Dashboard</p>
            <h1 className="font-display text-3xl">My Wishlist</h1>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {items.length === 0 ? (
          <AnimatedSection className="text-center py-16">
            <Heart size={48} className="text-ivory-dark mx-auto mb-4" />
            <p className="font-display text-xl text-charcoal mb-2">Your Wishlist is Empty</p>
            <p className="text-warm-gray text-sm mb-6">Save your favorite items to come back to later.</p>
            <Link href="/shop"
              className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
              Start Shopping
            </Link>
          </AnimatedSection>
        ) : (
          <>
            <p className="text-warm-gray text-sm mb-8">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
