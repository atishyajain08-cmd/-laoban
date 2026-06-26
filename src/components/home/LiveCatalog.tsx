"use client";
import { useEffect, useMemo, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/data/products";
import { fetchLiveCatalogProducts } from "@/lib/supabaseCatalog";

interface Props {
  compact?: boolean;
  section?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  emptyMessage?: string;
  tone?: "warm" | "ivory" | "dark";
  showEmpty?: boolean;
  searchQuery?: string;
  sortBy?: string;
  selectedSizes?: string[];
  selectedColors?: string[];
  selectedBadges?: string[];
  priceRange?: [number, number];
}

export default function LiveCatalog({
  compact = false,
  section,
  eyebrow = "Backend Connected",
  title = "Live from Laoban Studio",
  description = "Products uploaded in Laoban Admin appear here automatically.",
  emptyMessage,
  tone = "warm",
  showEmpty = false,
  searchQuery = "",
  sortBy = "newest",
  selectedSizes = [],
  selectedColors = [],
  selectedBadges = [],
  priceRange,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  useEffect(() => {
    let active = true;

    fetchLiveCatalogProducts(section)
      .then((items) => {
        if (!active) return;
        setProducts(items);
        setStatus(items.length ? "ready" : "empty");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [compact, section]);

  const visibleProducts = useMemo(() => {
    let result = [...products];

    if (priceRange) {
      result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);
    }

    if (selectedSizes.length > 0) {
      result = result.filter((product) => selectedSizes.some((size) => product.sizes.includes(size)));
    }

    if (selectedColors.length > 0) {
      result = result.filter((product) => product.colors.some((color) => selectedColors.includes(color.name)));
    }

    if (selectedBadges.length > 0) {
      result = result.filter((product) => product.badge && selectedBadges.includes(product.badge));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
        || product.description.toLowerCase().includes(query)
        || product.category.toLowerCase().includes(query)
        || product.productCode?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return compact ? result.slice(0, 4) : result;
  }, [compact, priceRange, products, searchQuery, selectedBadges, selectedColors, selectedSizes, sortBy]);

  if (status === "empty" && !showEmpty) return null;

  const sectionClass = tone === "dark"
    ? "bg-charcoal text-white"
    : tone === "ivory"
      ? "bg-ivory"
      : "bg-warm-white";
  const headingClass = tone === "dark" ? "text-white" : "text-charcoal";
  const bodyClass = tone === "dark" ? "text-white/55" : "text-warm-gray";

  return (
    <section className={`${compact ? "py-16 md:py-20" : "py-12"} ${sectionClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className={`font-display text-3xl md:text-5xl ${headingClass}`}>
            {title}
          </h2>
          <p className={`${bodyClass} text-sm mt-3`}>
            {description}
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
          <p className={`text-center text-sm ${bodyClass}`}>
            {emptyMessage || "Live catalog is connected but no public products could be loaded right now."}
          </p>
        )}

        {status === "empty" && showEmpty && (
          <p className={`text-center text-sm ${bodyClass}`}>
            {emptyMessage || "No products have been uploaded under this section yet."}
          </p>
        )}

        {status === "ready" && visibleProducts.length === 0 && (
          <p className={`text-center text-sm ${bodyClass}`}>
            No products match the selected filters in this section.
          </p>
        )}

        {status === "ready" && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
