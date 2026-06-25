"use client";
import { useEffect, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/data/products";
import { fetchLiveCatalogProducts } from "@/lib/supabaseCatalog";

interface Props {
  compact?: boolean;
}

export default function LiveCatalog({ compact = false }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  useEffect(() => {
    let active = true;

    fetchLiveCatalogProducts()
      .then((items) => {
        if (!active) return;
        setProducts(compact ? items.slice(0, 4) : items);
        setStatus(items.length ? "ready" : "empty");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [compact]);

  if (status === "empty") return null;

  return (
    <section className={`${compact ? "py-16 md:py-20 bg-warm-white" : "py-12 bg-warm-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Backend Connected
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            Live from Laoban Studio
          </h2>
          <p className="text-warm-gray text-sm mt-3">
            Products uploaded in Laoban Admin appear here automatically.
          </p>
        </AnimatedSection>

        {status === "loading" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="aspect-[3/4] shimmer" />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="text-center text-sm text-warm-gray">
            Live catalog is connected but no public products could be loaded right now.
          </p>
        )}

        {status === "ready" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
