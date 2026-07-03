"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, MessageCircle, Truck, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface LastOrder {
  id: string;
  total: number;
  name: string;
  email: string;
  itemCount: number;
  paymentMethod: string;
}

const NEXT_LINKS = [
  { label: "New Arrivals", href: "/shop?section=new-arrivals", note: "Fresh drops, just in" },
  { label: "Collection", href: "/shop?section=collections", note: "The full Laoban edit" },
  { label: "Lookbook", href: "/shop?section=lookbook", note: "Shop styled looks" },
  { label: "Products", href: "/shop?section=product", note: "Browse everything" },
];

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("laoban_last_order");
      if (raw) setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      /* show the generic confirmation */
    }
  }, []);

  const firstName = order?.name?.trim().split(" ")[0];

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24">
        {/* Gold check */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gold shadow-[0_20px_60px_rgba(200,169,110,0.45)]"
        >
          <Check size={44} className="text-white" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <p className="mb-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
            <Sparkles size={14} /> Order Confirmed
          </p>
          <h1 className="font-display text-4xl text-charcoal md:text-6xl">
            Congratulations{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-warm-gray">
            Your order has been placed successfully. Thank you for choosing Laoban —
            your pieces are being prepared with care.
          </p>
        </motion.div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-10 max-w-md border border-ivory-dark bg-white p-6 text-left shadow-[0_24px_70px_rgba(26,26,26,0.06)]"
        >
          <div className="flex items-center justify-between border-b border-ivory-dark pb-4">
            <span className="text-xs uppercase tracking-[0.18em] text-warm-gray">Order number</span>
            <span className="font-semibold text-charcoal">{order?.id ?? "Confirmed"}</span>
          </div>
          {order && (
            <div className="space-y-2 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">Items</span>
                <span>{order.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Payment</span>
                <span>{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          )}
          <div className="mt-5 grid gap-2.5 border-t border-ivory-dark pt-4 text-xs text-warm-gray">
            <span className="flex items-center gap-2">
              <MessageCircle size={14} className="text-charcoal" />
              We&apos;ll confirm your order on WhatsApp / phone shortly
            </span>
            <span className="flex items-center gap-2">
              <Truck size={14} className="text-charcoal" />
              Delivery in 2–5 business days across India
            </span>
          </div>
        </motion.div>

        {/* Where to next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-14"
        >
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-warm-gray">Keep Exploring</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {NEXT_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-between border border-ivory-dark bg-white px-6 py-5 text-left transition-all hover:border-gold hover:shadow-[0_14px_44px_rgba(200,169,110,0.18)]"
              >
                <span>
                  <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-charcoal group-hover:text-gold transition-colors">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-xs text-warm-gray">{link.note}</span>
                </span>
                <ArrowRight size={16} className="text-warm-gray transition-all group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
