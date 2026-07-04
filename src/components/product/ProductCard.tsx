"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { trackAddToCart, trackAddToWishlist, trackSelectItem } from "@/lib/analytics";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const router = useRouter();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [quickView, setQuickView] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const detailHref = product.isLiveCatalog && product.liveCatalogId
    ? `/live-product?id=${encodeURIComponent(product.liveCatalogId)}`
    : `/shop/product/${product.slug}`;

  const openProduct = () => {
    trackSelectItem(product);
    router.push(detailHref);
  };

  const [selSize, setSelSize] = useState("");
  const [selColor, setSelColor] = useState(product.colors[0]?.name ?? "");
  const [justAdded, setJustAdded] = useState(false);

  // Professional flow: never add silently — open the quick view so the
  // customer picks a size (and colour) first.
  const openQuickAdd = () => {
    setJustAdded(false);
    setQuickView(true);
  };

  const confirmAddToCart = () => {
    if (!selSize) return;
    trackAddToCart(product, 1, selSize, selColor);
    addToCart(product, selSize, selColor);
    setJustAdded(true);
    window.setTimeout(() => {
      setQuickView(false);
      setJustAdded(false);
      setSelSize("");
    }, 900);
  };

  const toggleWishlist = () => {
    if (!wishlisted) trackAddToWishlist(product);
    wishlisted ? removeItem(product.id) : addItem(product);
  };

  const openProductFromCard = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;
    openProduct();
  };

  const openProductFromKeyboard = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openProduct();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative cursor-pointer"
        role="link"
        tabIndex={0}
        onClick={openProductFromCard}
        onKeyDown={openProductFromKeyboard}
        aria-label={`Open ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory mb-4">
          <Link href={detailHref} onClick={() => trackSelectItem(product)} className="block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-semibold ${
                product.badge === "new"
                  ? "bg-charcoal text-white"
                  : product.badge === "bestseller"
                  ? "bg-gold text-white"
                  : "bg-rose text-charcoal"
              }`}
            >
              {product.badge === "sale" && product.originalPrice
                ? `-${getDiscountPercent(product.price, product.originalPrice)}%`
                : product.badge}
            </span>
          )}

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openQuickAdd}
              className="w-10 h-10 bg-white text-charcoal flex items-center justify-center hover:bg-gold hover:text-white transition-colors shadow-lg"
              aria-label="Choose size and add to cart"
            >
              <ShoppingBag size={18} />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="shadow-lg"
            >
              <Link
                href={detailHref}
                onClick={() => trackSelectItem(product)}
                className="w-10 h-10 bg-white text-charcoal flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
                aria-label="View product details"
              >
                <Eye size={18} />
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className={`w-10 h-10 flex items-center justify-center transition-colors shadow-lg ${
                wishlisted ? "bg-gold text-white" : "bg-white text-charcoal hover:bg-gold hover:text-white"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </motion.button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-[11px] tracking-[0.15em] uppercase text-warm-gray">
            {product.category}
          </p>
          <p className="text-[10px] tracking-[0.16em] uppercase text-gold/80">
            {product.productCode}
          </p>
          <Link href={detailHref} onClick={() => trackSelectItem(product)}>
            <h3 className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-warm-gray line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Color Dots */}
          <div className="flex gap-1.5 pt-1">
            {product.colors.map((c) => (
              <span
                key={c.name}
                className="w-3.5 h-3.5 rounded-full border border-gray-200"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <Modal isOpen={quickView} onClose={() => setQuickView(false)} size="xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-[3/4] bg-ivory">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.15em] uppercase text-gold mb-2">
              {product.category}
            </p>
            <p className="text-[10px] tracking-[0.18em] uppercase text-warm-gray mb-2">
              Code: {product.productCode}
            </p>
            <h2 className="font-display text-2xl text-charcoal mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-warm-gray line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-warm-gray leading-relaxed mb-6">
              {product.description}
            </p>
            <div className="mb-4">
              <p className="text-xs tracking-[0.1em] uppercase font-medium mb-2">
                Select Size{" "}
                {!selSize && (
                  <span className="text-rose text-[10px] normal-case">— required</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelSize(s)}
                    className={`w-10 h-10 border text-sm transition-colors ${
                      selSize === s
                        ? "border-gold bg-gold text-white"
                        : "border-ivory-dark hover:border-gold hover:text-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs tracking-[0.1em] uppercase font-medium mb-2">
                Color: <span className="text-warm-gray normal-case">{selColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selColor === c.name ? "border-gold scale-110" : "border-gray-200 hover:border-gold"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={`Colour ${c.name}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={confirmAddToCart}
              disabled={!selSize}
              className="mb-3 flex w-full items-center justify-center gap-2 bg-charcoal py-3 text-sm uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={16} />
              {justAdded ? "Added to Bag ✓" : selSize ? "Add to Bag" : "Select a Size First"}
            </button>
            <Link
              href={detailHref}
              className="block text-center border border-charcoal text-charcoal py-3 text-sm tracking-[0.15em] uppercase hover:bg-charcoal hover:text-white transition-colors"
              onClick={() => {
                trackSelectItem(product);
                setQuickView(false);
              }}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
