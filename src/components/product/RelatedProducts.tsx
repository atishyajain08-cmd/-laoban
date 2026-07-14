"use client";
import { useEffect, useState } from "react";
import { Product } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { fetchLiveCatalogProducts } from "@/lib/supabaseCatalog";

// Words too common to signal that two products are related.
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "your", "our", "you",
  "men", "mens", "man", "premium", "laoban", "product", "piece", "quality",
  "soft", "ultra", "extra", "high", "fashion", "wear", "style", "new",
]);

function wordsOf(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
  );
}

function overlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  a.forEach((word) => {
    if (b.has(word)) count += 1;
  });
  return count;
}

interface Props {
  name: string;
  description: string;
  /** id of the product currently open, so it never recommends itself */
  excludeId: string;
}

export default function RelatedProducts({ name, description, excludeId }: Props) {
  const [related, setRelated] = useState<Product[]>([]);
  const [isWordMatch, setIsWordMatch] = useState(true);

  useEffect(() => {
    let active = true;
    fetchLiveCatalogProducts()
      .then((all) => {
        if (!active) return;
        const candidates = all.filter(
          (p) => p.liveCatalogId !== excludeId && p.id !== excludeId
        );
        const nameWords = wordsOf(name);
        const descWords = wordsOf(description);

        // Name-word matches count double — the title is the strongest signal.
        const scored = candidates
          .map((p) => {
            const pWords = wordsOf(`${p.name} ${p.description}`);
            const score = overlap(nameWords, pWords) * 2 + overlap(descWords, pWords);
            return { p, score };
          })
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score);

        if (scored.length) {
          setIsWordMatch(true);
          setRelated(scored.slice(0, 4).map(({ p }) => p));
        } else {
          // Nothing shares words with this product — show the latest pieces instead.
          setIsWordMatch(false);
          setRelated(candidates.slice(0, 4));
        }
      })
      .catch(() => {
        if (active) setRelated([]);
      });
    return () => {
      active = false;
    };
  }, [name, description, excludeId]);

  if (!related.length) return null;

  return (
    <section className="border-t border-ivory-dark bg-warm-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Keep Exploring</p>
          <h2 className="font-display text-3xl text-charcoal md:text-4xl">
            {isWordMatch ? "Related Products" : "You May Also Like"}
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {related.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
