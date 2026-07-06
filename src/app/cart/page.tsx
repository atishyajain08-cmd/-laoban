"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, Tag, ShieldCheck, Truck, PackageCheck, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, totalItems, totalPrice,
    couponCode, couponDiscount, deliveryFee, applyCoupon, removeCoupon,
  } = useCart();
  const { user } = useAuth();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const grandTotal = totalPrice + deliveryFee;

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!applyCoupon(couponInput)) {
      setCouponError("Invalid coupon code");
    }
    setCouponInput("");
  };

  const productHref = (item: typeof items[number]) =>
    item.product.isLiveCatalog && item.product.liveCatalogId
      ? `/live-product?id=${encodeURIComponent(item.product.liveCatalogId)}`
      : `/shop/product/${item.product.slug}`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <AnimatedSection className="text-center px-4">
          <ShoppingBag size={64} className="text-ivory-dark mx-auto mb-6" />
          <h1 className="font-display text-3xl text-charcoal mb-3">Your Bag is Empty</h1>
          <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-warm-gray">
            Looks like you haven&apos;t added anything yet. Explore the collection and find your fit.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors"
          >
            Continue Shopping
          </Link>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <AnimatedSection>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold">
            {user?.name ? `Welcome, ${user.name}` : "Shopping Bag"}
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mb-3">Your Bag</h1>
          <p className="text-warm-gray text-sm mb-8">
            {totalItems} item{totalItems !== 1 ? "s" : ""} · Secure checkout across India
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-5 bg-white p-5 border border-ivory-dark shadow-[0_10px_40px_rgba(26,26,26,0.04)]"
              >
                <Link href={productHref(item)} className="relative w-24 h-32 flex-shrink-0 bg-ivory overflow-hidden">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between gap-3">
                      <Link
                        href={productHref(item)}
                        className="font-medium text-sm text-charcoal hover:text-gold transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-warm-gray hover:text-charcoal p-1"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="border border-ivory-dark bg-ivory px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-charcoal">
                        Size {item.size}
                      </span>
                      <span className="border border-ivory-dark bg-ivory px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-charcoal">
                        {item.color}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-warm-gray">
                        {item.product.productCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-ivory-dark">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-ivory"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-xs border-x border-ivory-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-ivory"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link
              href="/shop"
              className="inline-block pt-2 text-sm text-warm-gray hover:text-gold transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-ivory-dark p-6 h-fit sticky top-28 shadow-[0_24px_70px_rgba(26,26,26,0.06)]">
            <h2 className="font-display text-xl text-charcoal mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    {couponCode}
                    <button onClick={removeCoupon} className="text-warm-gray hover:text-charcoal ml-1" aria-label="Remove coupon">
                      <X size={12} />
                    </button>
                  </span>
                  <span>-{couponDiscount > 100 ? formatPrice(couponDiscount) : `${couponDiscount}%`}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray">Delivery</span>
                <span className={deliveryFee === 0 ? "font-semibold text-green-600" : ""}>
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[11px] text-gold">
                  Apply code <span className="font-semibold">WELCOME10</span> for FREE delivery
                </p>
              )}
              <div className="border-t border-ivory-dark pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-warm-gray">Inclusive of all taxes</p>
            </div>

            {/* Coupon */}
            {!couponCode && (
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-ivory-dark text-sm focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-charcoal text-white text-xs tracking-wider uppercase hover:bg-gold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                <p className="text-[10px] text-warm-gray mt-1">Try: WELCOME10, LAOBAN20</p>
              </div>
            )}

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 py-4 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors font-medium"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            <div className="mt-6 grid gap-3 text-xs text-warm-gray">
              {[
                { icon: ShieldCheck, label: "Safe & secure checkout" },
                { icon: Truck, label: "Free delivery with code WELCOME10" },
                { icon: PackageCheck, label: "7-day easy returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-charcoal" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
