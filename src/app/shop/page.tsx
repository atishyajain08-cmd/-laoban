"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/product/ProductCard";
import LiveCatalog from "@/components/home/LiveCatalog";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

type SortOption = "newest" | "price-low" | "price-high" | "rating";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-white flex items-center justify-center"><div className="shimmer w-16 h-16 rounded-full" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (filterParam === "new") result = result.filter((p) => p.badge === "new");
    if (filterParam === "sale") result = result.filter((p) => p.badge === "sale");
    if (filterParam === "bestseller") result = result.filter((p) => p.badge === "bestseller");

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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

    return result;
  }, [selectedCategory, sortBy, priceRange, searchQuery, filterParam]);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
              Collections
            </p>
            <h1 className="font-display text-4xl md:text-6xl">
              {filterParam === "new"
                ? "New Arrivals"
                : filterParam === "sale"
                ? "Sale"
                : filterParam === "bestseller"
                ? "Best Sellers"
                : selectedCategory !== "all"
                ? categories.find((c) => c.slug === selectedCategory)?.name || "Shop"
                : "Shop All"}
            </h1>
          </AnimatedSection>
        </div>
      </div>

      <LiveCatalog />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-ivory-dark text-sm hover:border-gold transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <span className="text-sm text-warm-gray">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-ivory-dark text-sm focus:outline-none focus:border-gold w-48"
            />
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none px-4 py-2 pr-8 border border-ivory-dark text-sm focus:outline-none focus:border-gold bg-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-warm-gray" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border border-ivory-dark p-6 mb-8 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:text-gold">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs tracking-[0.1em] uppercase font-medium mb-3">Category</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`block text-sm ${selectedCategory === "all" ? "text-gold font-medium" : "text-warm-gray hover:text-charcoal"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`block text-sm ${selectedCategory === cat.slug ? "text-gold font-medium" : "text-warm-gray hover:text-charcoal"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.1em] uppercase font-medium mb-3">Price Range</p>
                <div className="space-y-2">
                  {[
                    [0, 15000, "All Prices"],
                    [0, 3000, "Under ₹3,000"],
                    [3000, 5000, "₹3,000 – ₹5,000"],
                    [5000, 10000, "₹5,000 – ₹10,000"],
                    [10000, 15000, "₹10,000+"],
                  ].map(([min, max, label]) => (
                    <button
                      key={label as string}
                      onClick={() => setPriceRange([min as number, max as number])}
                      className={`block text-sm ${
                        priceRange[0] === min && priceRange[1] === max
                          ? "text-gold font-medium"
                          : "text-warm-gray hover:text-charcoal"
                      }`}
                    >
                      {label as string}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-charcoal mb-2">No products found</p>
            <p className="text-warm-gray text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
