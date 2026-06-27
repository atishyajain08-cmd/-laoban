"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [quickView, setQuickView] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const detailHref = product.isLiveCatalog && product.liveCatalogId
    ? `/live-product?id=${encodeURIComponent(product.liveCatalogId)}`
    : `/shop/product/${product.slug}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory mb-4">
          <Link href={detailHref} className="block h-full w-full">
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
              onClick={() => addToCart(product, product.sizes[1] || product.sizes[0], product.colors[0].name)}
              className="w-10 h-10 bg-white text-charcoal flex items-center justify-center hover:bg-gold hover:text-white transition-colors shadow-lg"
              aria-label="Add to cart"
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
                className="w-10 h-10 bg-white text-charcoal flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
                aria-label="View product details"
              >
                <Eye size={18} />
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                wishlisted ? removeItem(product.id) : addItem(product)
              }
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
          <Link href={detailHref}>
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
          {product.pdfUrl && (
            <a
              href={product.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal underline underline-offset-4 transition-colors hover:text-gold"
            >
              PDF Gallery
            </a>
          )}
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
            {product.pdfUrl && (
              <a
                href={product.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex w-fit items-center border-b border-gold pb-1 text-xs uppercase tracking-[0.18em] text-gold hover:text-gold-dark"
              >
                View PDF Gallery
              </a>
            )}
            <div className="mb-4">
              <p className="text-xs tracking-[0.1em] uppercase font-medium mb-2">Sizes</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className="w-10 h-10 border border-ivory-dark text-sm hover:border-gold hover:text-gold transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs tracking-[0.1em] uppercase font-medium mb-2">Colors</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gold transition-colors"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <Link
              href={detailHref}
              className="block text-center bg-charcoal text-white py-3 text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors"
              onClick={() => setQuickView(false)}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
