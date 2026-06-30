"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, Tag, ShieldCheck, Truck, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckoutCustomer, createLaobanOrder } from "@/lib/laobanOrders";

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, totalItems, totalPrice,
    couponCode, couponDiscount, applyCoupon, removeCoupon, clearCart,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [checkout, setCheckout] = useState<CheckoutCustomer>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 2999 ? 0 : 199;
  const grandTotal = totalPrice + shipping;

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

  const submitOrder = async () => {
    setOrderError("");
    setOrderMessage("");

    const missing = Object.entries(checkout).find(([key, value]) => key !== "paymentMethod" && !String(value).trim());
    if (missing) {
      setOrderError("Please fill all delivery details before placing the order.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(checkout.phone.trim())) {
      setOrderError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(checkout.pincode.trim())) {
      setOrderError("Enter a valid 6-digit PIN code.");
      return;
    }

    setPlacingOrder(true);
    try {
      const order = await createLaobanOrder({
        customer: checkout,
        items,
        subtotal,
        shipping,
        total: grandTotal,
        couponCode,
      });
      clearCart();
      setOrderMessage(`Order ${order.id} placed successfully. We will contact you on WhatsApp/phone for confirmation.`);
    } catch {
      setOrderError("Could not place the order. Please try again or contact Laoban on WhatsApp.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <AnimatedSection className="text-center">
          <ShoppingBag size={64} className="text-ivory-dark mx-auto mb-6" />
          <h1 className="font-display text-3xl text-charcoal mb-3">
            {orderMessage ? "Order Received" : "Your Cart is Empty"}
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-warm-gray">
            {orderMessage || "Looks like you haven’t added anything yet."}
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors"
          >
            {orderMessage ? "Shop More" : "Continue Shopping"}
          </Link>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <AnimatedSection>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold">Shopping Bag</p>
          <h1 className="font-display text-5xl md:text-7xl text-charcoal mb-3">Your cart</h1>
          <p className="text-warm-gray text-sm mb-10">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart · Secure checkout for India</p>
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
                        href={productHref(item)}
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
                      Code: {item.product.productCode} · Size: {item.size} · Color: {item.color}
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
          <div className="bg-white border border-ivory-dark p-6 h-fit sticky top-28 shadow-[0_24px_70px_rgba(26,26,26,0.06)]">
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
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t border-ivory-dark pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
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

            <div className="mb-6 border-t border-ivory-dark pt-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">Delivery details</h3>
              <div className="grid gap-3">
                {[
                  ["name", "Full name"],
                  ["email", "Email"],
                  ["phone", "10-digit mobile"],
                  ["address", "House / street address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "PIN code"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    type={key === "email" ? "email" : "text"}
                    placeholder={label}
                    value={String(checkout[key as keyof CheckoutCustomer])}
                    onChange={(event) => setCheckout((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full border border-ivory-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                ))}
                <select
                  value={checkout.paymentMethod}
                  onChange={(event) => setCheckout((current) => ({ ...current, paymentMethod: event.target.value as CheckoutCustomer["paymentMethod"] }))}
                  className="w-full border border-ivory-dark bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI / payment after confirmation</option>
                </select>
              </div>
            </div>

            {orderError && <p className="mb-3 text-xs text-red-600">{orderError}</p>}
            <button
              onClick={submitOrder}
              disabled={placingOrder}
              className="w-full py-4 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder ? "Placing order..." : "Place Order"}
            </button>

            <div className="mt-6 grid gap-3 text-xs text-warm-gray">
              {[
                { icon: ShieldCheck, label: "Order details saved securely" },
                { icon: Truck, label: "Free shipping above ₹2,999" },
                { icon: PackageCheck, label: "7-day return support" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-charcoal" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

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
