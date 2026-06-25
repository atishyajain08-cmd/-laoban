"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield } from "lucide-react";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug as string);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "delivery" | "returns">("description");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-gold hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-warm-gray">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-gold capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] bg-ivory overflow-hidden"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 px-4 py-1.5 text-xs tracking-[0.15em] uppercase font-semibold ${
                  product.badge === "new" ? "bg-charcoal text-white" : product.badge === "bestseller" ? "bg-gold text-white" : "bg-rose text-charcoal"
                }`}>
                  {product.badge === "sale" && product.originalPrice
                    ? `-${getDiscountPercent(product.price, product.originalPrice)}%`
                    : product.badge}
                </span>
              )}
            </motion.div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 border-2 overflow-hidden ${
                    i === selectedImage ? "border-gold" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">{product.category}</p>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-warm-gray">
              Product Code: {product.productCode}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-warm-gray">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-warm-gray line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm bg-rose/20 text-rose px-2 py-0.5">
                    -{getDiscountPercent(product.price, product.originalPrice)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-warm-gray leading-relaxed mb-8">{product.description}</p>

            {/* Size */}
            <div className="mb-6">
              <p className="text-xs tracking-[0.15em] uppercase font-medium mb-3">
                Size {!selectedSize && <span className="text-rose text-[10px] normal-case">— Please select</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 border text-sm transition-colors ${
                      selectedSize === s
                        ? "border-gold bg-gold text-white"
                        : "border-ivory-dark hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-xs tracking-[0.15em] uppercase font-medium mb-3">
                Color: {selectedColor || <span className="text-rose text-[10px] normal-case">Please select</span>}
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-gold scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs tracking-[0.15em] uppercase font-medium mb-3">Quantity</p>
              <div className="flex items-center border border-ivory-dark w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ivory transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm border-x border-ivory-dark">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ivory transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white py-4 text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  wishlisted ? "bg-gold border-gold text-white" : "border-ivory-dark hover:border-gold hover:text-gold"
                }`}
              >
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </motion.button>
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-ivory-dark">
              {[
                { icon: Truck, label: `${product.deliveryDays}-day delivery` },
                { icon: RotateCcw, label: "7-day returns" },
                { icon: Shield, label: "Genuine product" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={18} className="text-gold" />
                  <span className="text-xs text-warm-gray">{label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-6 border-t border-ivory-dark pt-6">
              <div className="flex gap-6 mb-4">
                {(["description", "delivery", "returns"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${
                      activeTab === tab ? "border-gold text-charcoal" : "border-transparent text-warm-gray"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-sm text-warm-gray leading-relaxed">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "delivery" && (
                  <div className="space-y-2">
                    <p>Standard delivery: {product.deliveryDays} business days</p>
                    <p>Free shipping on orders above ₹2,999</p>
                    <p>Cash on Delivery available</p>
                    <p>Express delivery available in select cities</p>
                  </div>
                )}
                {activeTab === "returns" && (
                  <div className="space-y-2">
                    <p>7-day easy return policy</p>
                    <p>Items must be unused with original tags</p>
                    <p>Refund processed within 5-7 business days</p>
                    <p>Exchange available for size/color</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <AnimatedSection className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl text-charcoal">You May Also Like</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
