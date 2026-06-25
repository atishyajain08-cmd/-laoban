"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, totalItems, totalPrice,
    couponCode, couponDiscount, applyCoupon, removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!applyCoupon(couponInput)) {
      setCouponError("Invalid coupon code");
    }
    setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <AnimatedSection className="text-center">
          <ShoppingBag size={64} className="text-ivory-dark mx-auto mb-6" />
          <h1 className="font-display text-3xl text-charcoal mb-3">Your Cart is Empty</h1>
          <p className="text-warm-gray text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
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
          <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">Shopping Cart</h1>
          <p className="text-warm-gray text-sm mb-10">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>
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
                className="flex gap-4 bg-white p-4 border border-ivory-dark"
              >
                <div className="relative w-24 h-32 flex-shrink-0 bg-ivory">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <Link
                        href={`/shop/product/${item.product.slug}`}
                        className="font-medium text-sm text-charcoal hover:text-gold transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-warm-gray hover:text-charcoal p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-warm-gray mt-1">
                      Size: {item.size} • Color: {item.color}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-ivory-dark">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ivory"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-xs border-x border-ivory-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ivory"
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
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-ivory-dark p-6 h-fit sticky top-28">
            <h2 className="font-display text-xl text-charcoal mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    {couponCode}
                    <button onClick={removeCoupon} className="text-warm-gray hover:text-charcoal ml-1">
                      <X size={12} />
                    </button>
                  </span>
                  <span>-{couponDiscount > 100 ? formatPrice(couponDiscount) : `${couponDiscount}%`}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray">Shipping</span>
                <span className={subtotal >= 2999 ? "text-green-600" : ""}>
                  {subtotal >= 2999 ? "Free" : formatPrice(199)}
                </span>
              </div>
              <div className="border-t border-ivory-dark pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(totalPrice + (subtotal < 2999 ? 199 : 0))}</span>
              </div>
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

            {/* TODO: Connect payment gateway (Razorpay / Stripe) */}
            <button className="w-full py-4 bg-gold text-white text-sm tracking-[0.15em] uppercase hover:bg-gold-dark transition-colors font-medium">
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
              className="block text-center mt-4 text-sm text-warm-gray hover:text-gold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
