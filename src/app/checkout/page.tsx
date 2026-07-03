"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Banknote, Smartphone, ShieldCheck, Truck, PackageCheck, Lock, Tag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckoutCustomer, createLaobanOrder } from "@/lib/laobanOrders";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";

const FREE_SHIPPING_AT = 2999;
const SHIPPING_FEE = 199;

const FIELDS: { key: keyof CheckoutCustomer; label: string; type: string; span?: boolean; placeholder: string }[] = [
  { key: "name", label: "Full name", type: "text", span: true, placeholder: "e.g. Arjun Mehta" },
  { key: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
  { key: "phone", label: "Mobile number", type: "tel", placeholder: "10-digit mobile" },
  { key: "houseNumber", label: "House / flat number", type: "text", placeholder: "Flat 12B / House 44" },
  { key: "street", label: "Street / locality", type: "text", placeholder: "Street, area, colony" },
  { key: "landmark", label: "Landmark optional", type: "text", span: true, placeholder: "Near metro station, gate, shop, etc." },
  { key: "city", label: "City", type: "text", placeholder: "City" },
  { key: "state", label: "State", type: "text", placeholder: "State" },
  { key: "pincode", label: "PIN code", type: "text", placeholder: "6-digit PIN" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items, totalItems, totalPrice,
    couponCode, couponDiscount, removeCoupon, clearCart,
  } = useCart();
  const [form, setForm] = useState<CheckoutCustomer>({
    name: "", email: "", phone: "", houseNumber: "", street: "", landmark: "", city: "", state: "", pincode: "",
    paymentMethod: "COD",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const trackedRef = useRef(false);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shipping;

  useEffect(() => {
    if (items.length === 0 || trackedRef.current) return;
    trackedRef.current = true;
    trackBeginCheckout(grandTotal, totalItems);
  }, [grandTotal, items.length, totalItems]);

  const setField = (key: keyof CheckoutCustomer, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const placeOrder = async () => {
    setError("");
    const missing = FIELDS.find((f) => f.key !== "landmark" && !String(form[f.key]).trim());
    if (missing) {
      setError(`Please fill in your ${missing.label.toLowerCase()}.`);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    setPlacing(true);
    try {
      const order = await createLaobanOrder({
        customer: form,
        items,
        subtotal,
        shipping,
        total: grandTotal,
        couponCode,
      });
      trackPurchase(order.id, grandTotal, items.map((item) => item.product));
      sessionStorage.setItem(
        "laoban_last_order",
        JSON.stringify({
          id: order.id,
          total: grandTotal,
          name: form.name,
          email: form.email,
          itemCount: totalItems,
          paymentMethod: form.paymentMethod,
        })
      );
      setPlaced(true);
      clearCart();
      router.push("/order-success");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      setError(
        detail.includes("orders")
          ? "Order could not be saved to the Laoban backend. Please contact Laoban on WhatsApp or try again."
          : "Could not place the order. Please try again or contact Laoban on WhatsApp."
      );
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <AnimatedSection className="text-center px-4">
          <ShoppingBag size={64} className="text-ivory-dark mx-auto mb-6" />
          <h1 className="font-display text-3xl text-charcoal mb-3">Nothing to Check Out</h1>
          <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-warm-gray">
            Your bag is empty. Add a few pieces first, then come back here.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors"
          >
            Explore Products
          </Link>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <AnimatedSection>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold">Secure Checkout</p>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mb-3">Checkout</h1>
          <p className="text-warm-gray text-sm mb-10 flex items-center gap-2">
            <Lock size={13} /> Bag → Checkout → Confirmation
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery details */}
            <AnimatedSection className="bg-white border border-ivory-dark p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-xs text-white">1</span>
                <h2 className="font-display text-xl text-charcoal">Delivery Details</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.key} className={f.span ? "sm:col-span-2" : ""}>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-warm-gray">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={String(form[f.key])}
                      onChange={(e) => setField(f.key, e.target.value)}
                      className="w-full border border-ivory-dark px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Payment method */}
            <AnimatedSection className="bg-white border border-ivory-dark p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-xs text-white">2</span>
                <h2 className="font-display text-xl text-charcoal">Payment Method</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "COD" as const, icon: Banknote, title: "Cash on Delivery", note: "Pay when your order arrives" },
                  { value: "UPI" as const, icon: Smartphone, title: "UPI", note: "We confirm payment on WhatsApp" },
                ].map(({ value, icon: Icon, title, note }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setField("paymentMethod", value)}
                    className={`flex items-start gap-3 border p-4 text-left transition-colors ${
                      form.paymentMethod === value
                        ? "border-gold bg-ivory"
                        : "border-ivory-dark hover:border-gold"
                    }`}
                  >
                    <Icon size={20} className={form.paymentMethod === value ? "text-gold" : "text-warm-gray"} />
                    <span>
                      <span className="block text-sm font-medium text-charcoal">{title}</span>
                      <span className="mt-0.5 block text-xs text-warm-gray">{note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-ivory-dark p-6 h-fit sticky top-28 shadow-[0_24px_70px_rgba(26,26,26,0.06)]">
              <h2 className="font-display text-xl text-charcoal mb-6">Your Order</h2>

              <div className="mb-6 max-h-72 space-y-4 overflow-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="relative h-20 w-16 flex-shrink-0 bg-ivory">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-charcoal line-clamp-2">{item.product.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-warm-gray">
                        Size {item.size} · {item.color}
                      </p>
                    </div>
                    <span className="text-xs font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-ivory-dark pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {couponCode && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={14} /> {couponCode}
                      <button onClick={removeCoupon} className="ml-1 text-warm-gray hover:text-charcoal" aria-label="Remove coupon">
                        <X size={12} />
                      </button>
                    </span>
                    <span>-{couponDiscount > 100 ? formatPrice(couponDiscount) : `${couponDiscount}%`}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-warm-gray">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-ivory-dark pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
                <p className="text-[10px] text-warm-gray">Inclusive of all taxes</p>
              </div>

              {error && <p className="mt-4 text-xs text-red-600">{error}</p>}

              <button
                onClick={placeOrder}
                disabled={placing}
                className="mt-5 w-full bg-charcoal py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placing ? "Placing Order…" : `Place Order · ${formatPrice(grandTotal)}`}
              </button>

              <Link
                href="/cart"
                className="mt-3 block text-center text-sm text-warm-gray transition-colors hover:text-gold"
              >
                ← Back to bag
              </Link>

              <div className="mt-6 grid gap-3 text-xs text-warm-gray">
                {[
                  { icon: ShieldCheck, label: "Your details are stored securely" },
                  { icon: Truck, label: `Free shipping above ${formatPrice(FREE_SHIPPING_AT)}` },
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
    </div>
  );
}
